# 🛍️ Punjabi E-commerce Store Product Manager

A **standalone Python GUI application** that allows you to directly manage products in your e-commerce store **without going through the web interface**. This bypasses any potential refresh issues and gives you complete control over your product catalog.

## 🚀 **Quick Start**

### **Option 1: Direct Python Execution**
```bash
python3 product_manager.py
```

### **Option 2: Using the Launcher Script**
```bash
./run_product_manager.sh
```

### **Option 3: Double-click (macOS)**
- Right-click `product_manager.py`
- Select "Open With" → "Python Launcher"

## ✨ **Features**

### **🔄 Direct File Management**
- **No web interface** - Direct access to `data/products.json`
- **No server restarts** - Changes saved immediately to file
- **No refresh issues** - Products stay exactly where you put them
- **Backup system** - Automatic backups before each save

### **📝 Product Management**
- ➕ **Add New Products** - Complete product forms with validation
- ✏️ **Edit Existing Products** - Double-click to edit any product
- 🗑️ **Delete Products** - Remove products with confirmation
- 🔍 **Search & Sort** - Click column headers to sort
- 📊 **Export to CSV** - Backup your products to spreadsheet

### **🏷️ Smart Categorization**
- **Automatic subcategory** - Jutti products get `subcategory: 'jutti'`
- **Fulkari products** - Automatically set to `category: 'fulkari'`
- **Size & Color variants** - Easy management of product options
- **Stock tracking** - Monitor inventory levels

### **💾 Data Persistence**
- **Local storage** - All data stays on your computer
- **JSON format** - Human-readable data structure
- **Automatic backups** - Timestamped backup files
- **No external sync** - Complete control over your data

## 🎯 **How It Solves Your Problem**

### **❌ Before (Web Interface Issues)**
- Products would "vanish" after some time
- Server restarts would reset products
- AWS sync would overwrite local changes
- Unpredictable behavior

### **✅ Now (Direct File Management)**
- Products stay **exactly where you put them**
- **No server restarts** affect your products
- **No AWS sync** can overwrite your data
- **Complete control** over your product catalog

## 🖥️ **GUI Interface**

### **Main Window**
```
┌─────────────────────────────────────────────────────────────┐
│ 🛍️ Punjabi E-commerce Store Product Manager                │
├─────────────────────────────────────────────────────────────┤
│ [➕ Add] [✏️ Edit] [🗑️ Delete] [💾 Save] [🔄 Refresh]     │
├─────────────────────────────────────────────────────────────┤
│ Products List                                              │
│ ┌─────┬──────────────┬──────────────┬──────────┬──────┐    │
│ │ ID  │ Name         │ Punjabi Name │ Category │ Price│    │
│ ├─────┼──────────────┼──────────────┼──────────┼──────┤    │
│ │ 1   │ Test Jutti   │ ਪੰਜਾਬੀ ਜੁੱਤੀ │ men      │ ₹1500│    │
│ └─────┴──────────────┴──────────────┴──────────┴──────┘    │
├─────────────────────────────────────────────────────────────┤
│ Status: Showing 1 products                                │
└─────────────────────────────────────────────────────────────┘
```

### **Add/Edit Product Form**
```
┌─────────────────────────────────────────────────────────────┐
│ Add New Product                                            │
├─────────────────────────────────────────────────────────────┤
│ Basic Information                                          │
│ Product Name*: [________________________]                  │
│ Punjabi Name: [________________________]                  │
│ Description:  [________________________]                  │
├─────────────────────────────────────────────────────────────┤
│ Category Information                                       │
│ Product Type*: [jutti ▼]                                  │
│ Category*:     [men ▼]                                    │
│ Subcategory:   [jutti]                                    │
├─────────────────────────────────────────────────────────────┤
│ Pricing & Stock                                            │
│ Price (₹)*:    [1500]                                     │
│ Stock:         [10]                                        │
├─────────────────────────────────────────────────────────────┤
│ Variants                                                    │
│ Sizes:        [UK 8] [+] [UK 8, UK 9, UK 10]             │
│ Colors:       [Brown] [+] [Brown, Black]                  │
├─────────────────────────────────────────────────────────────┤
│ [Add Product] [Cancel]                                     │
└─────────────────────────────────────────────────────────────┘
```

## 📁 **File Structure**

```
punjabi-ecom-storeV4/
├── product_manager.py          # Main Python application
├── run_product_manager.sh      # Launcher script
├── requirements.txt            # Dependencies (none required!)
├── PRODUCT_MANAGER_README.md   # This file
├── data/
│   ├── products.json          # Your products (auto-created)
│   └── backups/               # Automatic backups
│       ├── products_backup_20241201_143022.json
│       └── products_backup_20241201_143156.json
```

## 🛠️ **Installation & Setup**

### **Requirements**
- **Python 3.6+** (built-in on macOS, easy to install on other systems)
- **No external packages** - Uses only Python standard library

### **macOS (Already Ready!)**
```bash
# Python 3 is pre-installed
python3 product_manager.py
```

### **Windows**
1. Download Python from [python.org](https://python.org)
2. Install with "Add to PATH" checked
3. Run: `python product_manager.py`

### **Linux/Ubuntu**
```bash
sudo apt-get install python3
python3 product_manager.py
```

## 📖 **Usage Guide**

### **1. Adding a New Product**
1. Click **"➕ Add New Product"**
2. Fill in the required fields (marked with *)
3. Add sizes, colors, and images as needed
4. Click **"Add Product"**

### **2. Editing an Existing Product**
1. **Double-click** on any product in the list
2. Modify the fields as needed
3. Click **"Update Product"**

### **3. Deleting a Product**
1. Select a product in the list
2. Click **"🗑️ Delete Selected"**
3. Confirm the deletion

### **4. Saving Changes**
- Click **"💾 Save All Changes"** to save to file
- **Automatic backups** are created before each save
- Changes are **immediately visible** in your web store

### **5. Exporting Data**
- Click **"📊 Export to CSV"** to backup your products
- Choose save location and filename
- Open in Excel/Google Sheets for analysis

## 🔧 **Technical Details**

### **Data Format**
Products are stored in `data/products.json` with this structure:
```json
{
  "products": [
    {
      "_id": "product_1701434567890_abc12345",
      "name": "Traditional Punjabi Jutti",
      "punjabiName": "ਪੰਜਾਬੀ ਜੁੱਤੀ",
      "description": "Handmade traditional jutti",
      "price": 1500,
      "category": "men",
      "subcategory": "jutti",
      "productType": "jutti",
      "sizes": ["UK 7", "UK 8", "UK 9"],
      "colors": ["Brown", "Black"],
      "stock": 10,
      "images": [],
      "createdAt": "2024-12-01T14:30:22.123456",
      "updatedAt": "2024-12-01T14:30:22.123456"
    }
  ]
}
```

### **Automatic Features**
- **ID Generation**: Unique IDs for each product
- **Timestamps**: Automatic creation and update times
- **Category Logic**: Smart subcategory assignment
- **Validation**: Required field checking
- **Backup System**: Automatic backups before saves

## 🚨 **Troubleshooting**

### **"Python not found" Error**
```bash
# Check Python installation
python3 --version

# If not found, install Python 3
# macOS: brew install python3
# Ubuntu: sudo apt-get install python3
# Windows: Download from python.org
```

### **"Permission denied" Error**
```bash
# Make launcher script executable
chmod +x run_product_manager.sh

# Or run directly with Python
python3 product_manager.py
```

### **GUI Not Displaying**
- Ensure you're running on a system with GUI support
- For servers: Use X11 forwarding or VNC
- For WSL: Install Windows X Server

### **File Not Found Error**
- Ensure you're running from the project root directory
- Check that `data/` folder exists
- The app will create missing directories automatically

## 🔒 **Security & Backup**

### **Automatic Backups**
- **Before each save**: Automatic timestamped backup
- **Backup location**: `data/backups/` folder
- **Backup format**: `products_backup_YYYYMMDD_HHMMSS.json`

### **Data Safety**
- **Local storage only**: No data sent to external servers
- **No internet required**: Works completely offline
- **Human-readable format**: JSON files can be manually edited
- **Version control friendly**: Easy to track changes in Git

## 🎉 **Benefits Over Web Interface**

| Feature | Web Interface | Python GUI |
|---------|---------------|------------|
| **Product Persistence** | ❌ Products vanish | ✅ **Products stay forever** |
| **Server Restarts** | ❌ Resets products | ✅ **No effect on products** |
| **AWS Sync Issues** | ❌ Overwrites data | ✅ **No external sync** |
| **Speed** | 🐌 Web loading | ⚡ **Instant access** |
| **Offline Use** | ❌ Requires server | ✅ **Works offline** |
| **Data Control** | ❌ Limited control | ✅ **Complete control** |
| **Backup System** | ❌ Manual only | ✅ **Automatic backups** |

## 🚀 **Next Steps**

1. **Run the application**: `python3 product_manager.py`
2. **Add your first product** using the GUI
3. **Test the web store** to see your products
4. **Create backups** using the export feature
5. **Enjoy permanent product management**! 🎯

## 📞 **Support**

If you encounter any issues:
1. Check this README for troubleshooting
2. Ensure Python 3 is installed
3. Run from the project root directory
4. Check the status bar for error messages

---

**🎯 Result**: Your products will **NEVER vanish again** because you're managing them directly in the file system, completely bypassing any web interface refresh issues!
