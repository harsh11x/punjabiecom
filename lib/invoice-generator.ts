import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export interface InvoiceData {
  orderNumber: string
  orderDate: string
  customerName: string
  customerAddress: string
  customerCity: string
  customerState: string
  customerPincode: string
  customerPhone: string
  items: Array<{
    name: string
    quantity: number
    size: string
    color: string
    price: number
    total: number
  }>
  subtotal: number
  shippingCost: number
  tax: number
  total: number
  paymentMethod: string
  status: string
}

export class InvoiceGenerator {
  private doc: jsPDF
  private currentY: number = 20
  private pageWidth: number = 210
  private margin: number = 20
  private contentWidth: number = 170

  constructor() {
    this.doc = new jsPDF('p', 'mm', 'a4')
    this.doc.setFont('helvetica')
  }

  private addText(text: string, x: number, y: number, fontSize: number = 12, fontStyle: string = 'normal') {
    this.doc.setFontSize(fontSize)
    this.doc.setFont('helvetica', fontStyle)
    this.doc.text(text, x, y)
  }

  private addLine(x1: number, y1: number, x2: number, y2: number) {
    this.doc.line(x1, y1, x2, y2)
  }

  private addRect(x: number, y: number, width: number, height: number) {
    this.doc.rect(x, y, width, height)
  }

  private checkPageBreak(requiredHeight: number) {
    if (this.currentY + requiredHeight > 270) {
      this.doc.addPage()
      this.currentY = 20
    }
  }

  generateInvoice(data: InvoiceData): jsPDF {
    // Header
    this.addHeader(data)
    
    // Company Information
    this.addCompanyInfo()
    
    // Customer Information
    this.addCustomerInfo(data)
    
    // Order Details
    this.addOrderDetails(data)
    
    // Items Table
    this.addItemsTable(data)
    
    // Totals
    this.addTotals(data)
    
    // Footer
    this.addFooter()
    
    return this.doc
  }

  private addHeader(data: InvoiceData) {
    // Company Logo and Name
    this.addText('ਪ', this.margin, this.currentY, 24, 'bold')
    this.addText('PUNJAB HERITAGE', this.margin + 15, this.currentY, 18, 'bold')
    this.currentY += 8
    
    // Tagline
    this.addText('Authentic Punjabi Jutti & Fulkari', this.margin + 15, this.currentY, 10, 'italic')
    this.currentY += 15
    
    // Invoice Title
    this.addText('INVOICE', this.pageWidth - this.margin - 30, this.currentY, 16, 'bold')
    this.currentY += 8
    
    // Invoice Number and Date
    this.addText(`Invoice #: ${data.orderNumber}`, this.pageWidth - this.margin - 30, this.currentY, 10)
    this.currentY += 5
    this.addText(`Date: ${this.formatDate(data.orderDate)}`, this.pageWidth - this.margin - 30, this.currentY, 10)
    this.currentY += 5
    this.addText(`Status: ${data.status.toUpperCase()}`, this.pageWidth - this.margin - 30, this.currentY, 10)
    this.currentY += 20
  }

  private addCompanyInfo() {
    this.addText('Company Details:', this.margin, this.currentY, 12, 'bold')
    this.currentY += 6
    this.addText('Punjabi Jutti and Fulkari', this.margin, this.currentY, 10)
    this.currentY += 5
    this.addText('Haveli, Highway, Grand Trunk Rd', this.margin, this.currentY, 10)
    this.currentY += 5
    this.addText('Amritsar, Jandiala Rural, Punjab 143115', this.margin, this.currentY, 10)
    this.currentY += 5
    this.addText('Phone: +91 7527072000', this.margin, this.currentY, 10)
    this.currentY += 5
    this.addText('Email: info@punjabijuttiandfulkari.com', this.margin, this.currentY, 10)
    this.currentY += 5
    this.addText('Website: www.punjabijuttiandfulkari.com', this.margin, this.currentY, 10)
    this.currentY += 15
  }

  private addCustomerInfo(data: InvoiceData) {
    this.addText('Bill To:', this.margin, this.currentY, 12, 'bold')
    this.currentY += 6
    this.addText(data.customerName, this.margin, this.currentY, 10)
    this.currentY += 5
    this.addText(data.customerAddress, this.margin, this.currentY, 10)
    this.currentY += 5
    this.addText(`${data.customerCity}, ${data.customerState} ${data.customerPincode}`, this.margin, this.currentY, 10)
    this.currentY += 5
    this.addText(`Phone: ${data.customerPhone}`, this.margin, this.currentY, 10)
    this.currentY += 20
  }

  private addOrderDetails(data: InvoiceData) {
    this.addText('Order Information:', this.margin, this.currentY, 12, 'bold')
    this.currentY += 6
    this.addText(`Order Number: ${data.orderNumber}`, this.margin, this.currentY, 10)
    this.currentY += 5
    this.addText(`Order Date: ${this.formatDate(data.orderDate)}`, this.margin, this.currentY, 10)
    this.currentY += 5
    this.addText(`Payment Method: ${data.paymentMethod.toUpperCase()}`, this.margin, this.currentY, 10)
    this.currentY += 15
  }

  private addItemsTable(data: InvoiceData) {
    this.checkPageBreak(80)
    
    // Table Header
    this.addRect(this.margin, this.currentY, this.contentWidth, 8)
    this.addText('Item', this.margin + 2, this.currentY + 6, 9, 'bold')
    this.addText('Qty', this.margin + 80, this.currentY + 6, 9, 'bold')
    this.addText('Size', this.margin + 100, this.currentY + 6, 9, 'bold')
    this.addText('Color', this.margin + 120, this.currentY + 6, 9, 'bold')
    this.addText('Price', this.margin + 140, this.currentY + 6, 9, 'bold')
    this.addText('Total', this.margin + 160, this.currentY + 6, 9, 'bold')
    this.currentY += 8

    // Table Rows
    data.items.forEach((item, index) => {
      this.checkPageBreak(15)
      
      const rowY = this.currentY
      this.addRect(this.margin, rowY, this.contentWidth, 12)
      
      // Item name (truncated if too long)
      const itemName = item.name.length > 20 ? item.name.substring(0, 17) + '...' : item.name
      this.addText(itemName, this.margin + 2, rowY + 8, 8)
      
      // Quantity
      this.addText(item.quantity.toString(), this.margin + 80, rowY + 8, 8)
      
      // Size
      this.addText(item.size, this.margin + 100, rowY + 8, 8)
      
      // Color
      this.addText(item.color, this.margin + 120, rowY + 8, 8)
      
      // Price
      this.addText(`₹${item.price}`, this.margin + 140, rowY + 8, 8)
      
      // Total
      this.addText(`₹${item.total}`, this.margin + 160, rowY + 8, 8)
      
      this.currentY += 12
    })
    
    this.currentY += 10
  }

  private addTotals(data: InvoiceData) {
    this.checkPageBreak(50)
    
    const totalsX = this.pageWidth - this.margin - 60
    
    this.addText('Subtotal:', totalsX, this.currentY, 10)
    this.addText(`₹${data.subtotal}`, totalsX + 40, this.currentY, 10)
    this.currentY += 6
    
    this.addText('Shipping:', totalsX, this.currentY, 10)
    this.addText(`₹${data.shippingCost}`, totalsX + 40, this.currentY, 10)
    this.currentY += 6
    
    this.addText('Tax:', totalsX, this.currentY, 10)
    this.addText(`₹${data.tax}`, totalsX + 40, this.currentY, 10)
    this.currentY += 8
    
    // Total line
    this.addLine(totalsX, this.currentY, totalsX + 60, this.currentY)
    this.currentY += 6
    
    this.addText('TOTAL:', totalsX, this.currentY, 12, 'bold')
    this.addText(`₹${data.total}`, totalsX + 40, this.currentY, 12, 'bold')
    this.currentY += 20
  }

  private addFooter() {
    this.checkPageBreak(30)
    
    this.addText('Thank you for your business!', this.margin, this.currentY, 10, 'italic')
    this.currentY += 8
    this.addText('For any queries, please contact us at +91 7527072000', this.margin, this.currentY, 8)
    this.currentY += 8
    this.addText('Visit us at www.punjabijuttiandfulkari.com', this.margin, this.currentY, 8)
    this.currentY += 8
    this.addText('Follow us on Instagram: @uniquepunjabijuttiandfulkari', this.margin, this.currentY, 8)
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  // Generate and download invoice
  static async generateAndDownload(data: InvoiceData, filename?: string): Promise<void> {
    const generator = new InvoiceGenerator()
    const pdf = generator.generateInvoice(data)
    
    const finalFilename = filename || `invoice-${data.orderNumber}.pdf`
    pdf.save(finalFilename)
  }

  // Generate invoice as blob for preview
  static async generateAsBlob(data: InvoiceData): Promise<Blob> {
    const generator = new InvoiceGenerator()
    const pdf = generator.generateInvoice(data)
    
    return new Blob([pdf.output('blob')], { type: 'application/pdf' })
  }
}
