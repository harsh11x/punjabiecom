#!/usr/bin/env python3
"""
Punjabi E-commerce Store Product Manager
A GUI application to directly manage products in the JSON file
"""

import tkinter as tk
from tkinter import ttk, messagebox, filedialog, scrolledtext
import json
import os
import shutil
from datetime import datetime
import uuid

class ProductManager:
    def __init__(self, root):
        self.root = root
        self.root.title("Punjabi E-commerce Store - Product Manager")
        self.root.geometry("1200x800")
        self.root.configure(bg='#f0f0f0')
        
        # File paths
        self.products_file = "data/products.json"
        self.backup_dir = "data/backups"
        
        # Ensure directories exist
        os.makedirs("data", exist_ok=True)
        os.makedirs(self.backup_dir, exist_ok=True)
        
        # Load existing products
        self.products = self.load_products()
        
        # Create GUI
        self.create_gui()
        
        # Refresh product list
        self.refresh_product_list()
    
    def load_products(self):
        """Load products from JSON file"""
        try:
            if os.path.exists(self.products_file):
                with open(self.products_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    return data.get('products', [])
            else:
                # Create empty products file
                empty_data = {"products": []}
                with open(self.products_file, 'w', encoding='utf-8') as f:
                    json.dump(empty_data, f, indent=2, ensure_ascii=False)
                return []
        except Exception as e:
            messagebox.showerror("Error", f"Failed to load products: {str(e)}")
            return []
    
    def save_products(self):
        """Save products to JSON file with backup"""
        try:
            # Create backup
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            backup_file = os.path.join(self.backup_dir, f"products_backup_{timestamp}.json")
            
            if os.path.exists(self.products_file):
                shutil.copy2(self.products_file, backup_file)
            
            # Save current data
            data = {"products": self.products}
            with open(self.products_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            
            messagebox.showinfo("Success", f"Products saved successfully!\nBackup created: {backup_file}")
            return True
        except Exception as e:
            messagebox.showerror("Error", f"Failed to save products: {str(e)}")
            return False
    
    def create_gui(self):
        """Create the main GUI"""
        # Main frame
        main_frame = ttk.Frame(self.root, padding="10")
        main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Configure grid weights
        self.root.columnconfigure(0, weight=1)
        self.root.rowconfigure(0, weight=1)
        main_frame.columnconfigure(1, weight=1)
        main_frame.rowconfigure(2, weight=1)
        
        # Title
        title_label = ttk.Label(main_frame, text="🛍️ Punjabi E-commerce Store Product Manager", 
                               font=('Arial', 16, 'bold'))
        title_label.grid(row=0, column=0, columnspan=3, pady=(0, 20))
        
        # Buttons frame
        buttons_frame = ttk.Frame(main_frame)
        buttons_frame.grid(row=1, column=0, columnspan=3, pady=(0, 20), sticky=(tk.W, tk.E))
        
        ttk.Button(buttons_frame, text="➕ Add New Product", command=self.add_product_window).pack(side=tk.LEFT, padx=5)
        ttk.Button(buttons_frame, text="✏️ Edit Selected", command=self.edit_product_window).pack(side=tk.LEFT, padx=5)
        ttk.Button(buttons_frame, text="🗑️ Delete Selected", command=self.delete_product).pack(side=tk.LEFT, padx=5)
        ttk.Button(buttons_frame, text="💾 Save All Changes", command=self.save_products).pack(side=tk.LEFT, padx=5)
        ttk.Button(buttons_frame, text="🔄 Refresh List", command=self.refresh_product_list).pack(side=tk.LEFT, padx=5)
        ttk.Button(buttons_frame, text="📊 Export to CSV", command=self.export_to_csv).pack(side=tk.LEFT, padx=5)
        ttk.Button(buttons_frame, text="📁 Open Data Folder", command=self.open_data_folder).pack(side=tk.LEFT, padx=5)
        
        # Product list frame
        list_frame = ttk.LabelFrame(main_frame, text="Products List", padding="10")
        list_frame.grid(row=2, column=0, columnspan=3, sticky=(tk.W, tk.E, tk.N, tk.S), pady=(0, 10))
        list_frame.columnconfigure(0, weight=1)
        list_frame.rowconfigure(0, weight=1)
        
        # Create Treeview
        columns = ('ID', 'Name', 'Punjabi Name', 'Category', 'Subcategory', 'Price', 'Stock', 'Status')
        self.tree = ttk.Treeview(list_frame, columns=columns, show='headings', height=15)
        
        # Configure columns
        for col in columns:
            self.tree.heading(col, text=col, command=lambda c=col: self.sort_treeview(c))
            self.tree.column(col, width=120, minwidth=100)
        
        # Scrollbars
        v_scrollbar = ttk.Scrollbar(list_frame, orient=tk.VERTICAL, command=self.tree.yview)
        h_scrollbar = ttk.Scrollbar(list_frame, orient=tk.HORIZONTAL, command=self.tree.xview)
        self.tree.configure(yscrollcommand=v_scrollbar.set, xscrollcommand=h_scrollbar.set)
        
        # Grid layout
        self.tree.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        v_scrollbar.grid(row=0, column=1, sticky=(tk.N, tk.S))
        h_scrollbar.grid(row=1, column=0, sticky=(tk.W, tk.E))
        
        # Status bar
        self.status_var = tk.StringVar()
        self.status_var.set("Ready")
        status_bar = ttk.Label(main_frame, textvariable=self.status_var, relief=tk.SUNKEN)
        status_bar.grid(row=3, column=0, columnspan=3, sticky=(tk.W, tk.E))
        
        # Bind double-click to edit
        self.tree.bind('<Double-1>', lambda e: self.edit_product_window())
        
        # Bind selection change
        self.tree.bind('<<TreeviewSelect>>', self.on_selection_change)
    
    def add_product_window(self):
        """Open window to add new product"""
        self.product_window = tk.Toplevel(self.root)
        self.product_window.title("Add New Product")
        self.product_window.geometry("600x700")
        self.product_window.transient(self.root)
        self.product_window.grab_set()
        
        self.create_product_form(self.product_window, mode="add")
    
    def edit_product_window(self):
        """Open window to edit selected product"""
        selection = self.tree.selection()
        if not selection:
            messagebox.showwarning("Warning", "Please select a product to edit")
            return
        
        item = self.tree.item(selection[0])
        product_id = item['values'][0]
        
        # Find product
        product = None
        for p in self.products:
            if p.get('_id') == product_id or p.get('id') == product_id:
                product = p
                break
        
        if not product:
            messagebox.showerror("Error", "Product not found")
            return
        
        self.product_window = tk.Toplevel(self.root)
        self.product_window.title(f"Edit Product: {product.get('name', 'Unknown')}")
        self.product_window.geometry("600x700")
        self.product_window.transient(self.root)
        self.product_window.grab_set()
        
        self.create_product_form(self.product_window, mode="edit", product=product)
    
    def create_product_form(self, window, mode="add", product=None):
        """Create product form in the given window"""
        # Main frame
        main_frame = ttk.Frame(window, padding="20")
        main_frame.pack(fill=tk.BOTH, expand=True)
        
        # Form fields
        fields = []
        
        # Basic Information
        basic_frame = ttk.LabelFrame(main_frame, text="Basic Information", padding="10")
        basic_frame.pack(fill=tk.X, pady=(0, 10))
        
        fields.append(('name', 'Product Name*:', 'text', basic_frame))
        fields.append(('punjabiName', 'Punjabi Name:', 'text', basic_frame))
        fields.append(('description', 'Description:', 'text', basic_frame))
        
        # Category Information
        category_frame = ttk.LabelFrame(main_frame, text="Category Information", padding="10")
        category_frame.pack(fill=tk.X, pady=(0, 10))
        
        fields.append(('productType', 'Product Type*:', 'combo', category_frame, ['jutti', 'fulkari']))
        fields.append(('category', 'Category*:', 'combo', category_frame, ['men', 'women', 'kids', 'fulkari']))
        fields.append(('subcategory', 'Subcategory:', 'text', category_frame))
        
        # Pricing and Stock
        pricing_frame = ttk.LabelFrame(main_frame, text="Pricing & Stock", padding="10")
        pricing_frame.pack(fill=tk.X, pady=(0, 10))
        
        fields.append(('price', 'Price (₹)*:', 'number', pricing_frame))
        fields.append(('stock', 'Stock Quantity*:', 'number', pricing_frame))
        
        # Variants
        variants_frame = ttk.LabelFrame(main_frame, text="Variants", padding="10")
        variants_frame.pack(fill=tk.X, pady=(0, 10))
        
        fields.append(('sizes', 'Available Sizes:', 'list', variants_frame))
        fields.append(('colors', 'Available Colors:', 'list', variants_frame))
        
        # Images
        images_frame = ttk.LabelFrame(main_frame, text="Images", padding="10")
        images_frame.pack(fill=tk.X, pady=(0, 10))
        
        fields.append(('images', 'Image URLs:', 'list', images_frame))
        
        # Create form widgets
        self.form_widgets = {}
        for i, field_info in enumerate(fields):
            field_name, label_text, field_type, parent_frame, *extra = field_info
            
            # Label
            label = ttk.Label(parent_frame, text=label_text)
            label.grid(row=i, column=0, sticky=tk.W, padx=(0, 10), pady=5)
            
            # Input widget
            if field_type == 'text':
                widget = ttk.Entry(parent_frame, width=40)
                widget.grid(row=i, column=1, sticky=(tk.W, tk.E), padx=(0, 10), pady=5)
            elif field_type == 'number':
                widget = ttk.Entry(parent_frame, width=40)
                widget.grid(row=i, column=1, sticky=(tk.W, tk.E), padx=(0, 10), pady=5)
            elif field_type == 'combo':
                widget = ttk.Combobox(parent_frame, values=extra[0], width=37)
                widget.grid(row=i, column=1, sticky=(tk.W, tk.E), padx=(0, 10), pady=5)
            elif field_type == 'list':
                # Create frame for list input
                list_frame = ttk.Frame(parent_frame)
                list_frame.grid(row=i, column=1, sticky=(tk.W, tk.E), padx=(0, 10), pady=5)
                
                entry = ttk.Entry(list_frame, width=30)
                entry.pack(side=tk.LEFT, fill=tk.X, expand=True)
                
                add_btn = ttk.Button(list_frame, text="+", width=3, 
                                   command=lambda e=entry, f=field_name: self.add_list_item(e, f))
                add_btn.pack(side=tk.LEFT, padx=(5, 0))
                
                # Create listbox for display
                listbox_frame = ttk.Frame(parent_frame)
                listbox_frame.grid(row=i+1, column=1, sticky=(tk.W, tk.E), padx=(0, 10), pady=(0, 5))
                
                listbox = tk.Listbox(listbox_frame, height=3)
                listbox.pack(side=tk.LEFT, fill=tk.X, expand=True)
                
                scrollbar = ttk.Scrollbar(listbox_frame, orient=tk.VERTICAL, command=listbox.yview)
                scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
                listbox.configure(yscrollcommand=scrollbar.set)
                
                # Store both entry and listbox
                widget = {'entry': entry, 'listbox': listbox}
                
                # Move to next row for listbox
                i += 1
            
            self.form_widgets[field_name] = widget
        
        # Buttons
        button_frame = ttk.Frame(main_frame)
        button_frame.pack(fill=tk.X, pady=(20, 0))
        
        if mode == "add":
            ttk.Button(button_frame, text="Add Product", command=lambda: self.save_product(mode)).pack(side=tk.RIGHT, padx=(5, 0))
        else:
            ttk.Button(button_frame, text="Update Product", command=lambda: self.save_product(mode, product)).pack(side=tk.RIGHT, padx=(5, 0))
        
        ttk.Button(button_frame, text="Cancel", command=window.destroy).pack(side=tk.RIGHT)
        
        # Populate form if editing
        if mode == "edit" and product:
            self.populate_form(product)
        
        # Configure grid weights
        for frame in [basic_frame, category_frame, pricing_frame, variants_frame, images_frame]:
            frame.columnconfigure(1, weight=1)
    
    def add_list_item(self, entry, field_name):
        """Add item to list field"""
        value = entry.get().strip()
        if value:
            widget = self.form_widgets[field_name]
            if isinstance(widget, dict) and 'listbox' in widget:
                widget['listbox'].insert(tk.END, value)
                entry.delete(0, tk.END)
    
    def populate_form(self, product):
        """Populate form with existing product data"""
        for field_name, widget in self.form_widgets.items():
            value = product.get(field_name, '')
            
            if isinstance(widget, dict):
                # List field
                if 'listbox' in widget:
                    widget['listbox'].delete(0, tk.END)
                    if isinstance(value, list):
                        for item in value:
                            widget['listbox'].insert(tk.END, item)
            else:
                # Regular field
                if hasattr(widget, 'set'):
                    widget.set(value)
                elif hasattr(widget, 'insert'):
                    widget.delete(0, tk.END)
                    widget.insert(0, str(value))
    
    def save_product(self, mode, product=None):
        """Save product data"""
        try:
            # Collect form data
            product_data = {}
            
            for field_name, widget in self.form_widgets.items():
                if isinstance(widget, dict):
                    # List field
                    if 'listbox' in widget:
                        values = list(widget['listbox'].get(0, tk.END))
                        product_data[field_name] = values
                else:
                    # Regular field
                    if hasattr(widget, 'get'):
                        value = widget.get()
                    elif hasattr(widget, 'get_value'):
                        value = widget.get_value()
                    else:
                        value = ''
                    
                    # Convert number fields
                    if field_name in ['price', 'stock']:
                        try:
                            value = float(value) if field_name == 'price' else int(value)
                        except ValueError:
                            messagebox.showerror("Error", f"Invalid {field_name}: {value}")
                            return
                    
                    product_data[field_name] = value
            
            # Validation
            required_fields = ['name', 'productType', 'category', 'price', 'stock']
            for field in required_fields:
                if not product_data.get(field):
                    messagebox.showerror("Error", f"Field '{field}' is required")
                    return
            
            # Auto-set subcategory based on productType
            if product_data['productType'] == 'fulkari':
                product_data['category'] = 'fulkari'
                product_data['subcategory'] = 'fulkari'
            else:
                product_data['subcategory'] = 'jutti'
            
            # Generate ID
            if mode == "add":
                product_data['_id'] = f"product_{int(datetime.now().timestamp() * 1000)}_{str(uuid.uuid4())[:8]}"
                product_data['id'] = product_data['_id']
                product_data['createdAt'] = datetime.now().isoformat()
                product_data['updatedAt'] = datetime.now().isoformat()
                
                # Add to products list
                self.products.append(product_data)
                messagebox.showinfo("Success", "Product added successfully!")
            else:
                # Update existing product
                product_data['updatedAt'] = datetime.now().isoformat()
                
                # Find and update product
                for i, p in enumerate(self.products):
                    if p.get('_id') == product.get('_id') or p.get('id') == product.get('id'):
                        self.products[i] = {**p, **product_data}
                        break
                
                messagebox.showinfo("Success", "Product updated successfully!")
            
            # Close window
            self.product_window.destroy()
            
            # Refresh product list
            self.refresh_product_list()
            
            # Update status
            self.status_var.set(f"Product {'added' if mode == 'add' else 'updated'} successfully")
            
        except Exception as e:
            messagebox.showerror("Error", f"Failed to save product: {str(e)}")
    
    def delete_product(self):
        """Delete selected product"""
        selection = self.tree.selection()
        if not selection:
            messagebox.showwarning("Warning", "Please select a product to delete")
            return
        
        item = self.tree.item(selection[0])
        product_id = item['values'][0]
        product_name = item['values'][1]
        
        # Confirm deletion
        if not messagebox.askyesno("Confirm Delete", f"Are you sure you want to delete '{product_name}'?"):
            return
        
        # Remove from products list
        self.products = [p for p in self.products 
                        if p.get('_id') != product_id and p.get('id') != product_id]
        
        # Refresh product list
        self.refresh_product_list()
        
        # Update status
        self.status_var.set(f"Product '{product_name}' deleted")
        
        messagebox.showinfo("Success", f"Product '{product_name}' deleted successfully!")
    
    def refresh_product_list(self):
        """Refresh the product list display"""
        # Clear existing items
        for item in self.tree.get_children():
            self.tree.delete(item)
        
        # Add products
        for product in self.products:
            values = (
                product.get('_id', ''),
                product.get('name', ''),
                product.get('punjabiName', ''),
                product.get('category', ''),
                product.get('subcategory', ''),
                f"₹{product.get('price', 0)}",
                product.get('stock', 0),
                'Active' if product.get('stock', 0) > 0 else 'Out of Stock'
            )
            self.tree.insert('', tk.END, values=values)
        
        # Update status
        self.status_var.set(f"Showing {len(self.products)} products")
    
    def sort_treeview(self, col):
        """Sort treeview by column"""
        # Get all items
        items = [(self.tree.set(item, col), item) for item in self.tree.get_children('')]
        
        # Sort items
        items.sort()
        
        # Rearrange items in sorted positions
        for index, (val, item) in enumerate(items):
            self.tree.move(item, '', index)
    
    def on_selection_change(self, event):
        """Handle selection change in treeview"""
        selection = self.tree.selection()
        if selection:
            item = self.tree.item(selection[0])
            product_name = item['values'][1]
            self.status_var.set(f"Selected: {product_name}")
        else:
            self.status_var.set("Ready")
    
    def export_to_csv(self):
        """Export products to CSV file"""
        try:
            filename = filedialog.asksaveasfilename(
                defaultextension=".csv",
                filetypes=[("CSV files", "*.csv"), ("All files", "*.*")]
            )
            
            if filename:
                import csv
                with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
                    if self.products:
                        fieldnames = self.products[0].keys()
                        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                        writer.writeheader()
                        writer.writerows(self.products)
                
                messagebox.showinfo("Success", f"Products exported to {filename}")
        except Exception as e:
            messagebox.showerror("Error", f"Failed to export: {str(e)}")
    
    def open_data_folder(self):
        """Open the data folder in file explorer"""
        try:
            import subprocess
            import platform
            
            if platform.system() == "Windows":
                subprocess.run(["explorer", "data"])
            elif platform.system() == "Darwin":  # macOS
                subprocess.run(["open", "data"])
            else:  # Linux
                subprocess.run(["xdg-open", "data"])
        except Exception as e:
            messagebox.showerror("Error", f"Failed to open folder: {str(e)}")

def main():
    """Main function"""
    root = tk.Tk()
    app = ProductManager(root)
    root.mainloop()

if __name__ == "__main__":
    main()
