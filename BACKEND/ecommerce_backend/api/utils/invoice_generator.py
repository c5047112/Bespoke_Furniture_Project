from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
)
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from io import BytesIO
from datetime import datetime


def generate_invoice_pdf(order):
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer)

    styles = getSampleStyleSheet()
    elements = []

    # 🏢 COMPANY DETAILS
    elements.append(Paragraph("🪑 Furniture Store", styles["Title"]))
    elements.append(Paragraph("Hyderabad, India", styles["Normal"]))
    elements.append(Paragraph("Phone: 9876543210", styles["Normal"]))
    elements.append(Paragraph("Email: support@furniture.com", styles["Normal"]))
    elements.append(Spacer(1, 15))

    # 📄 INVOICE DETAILS
    elements.append(Paragraph("Invoice Details", styles["Heading2"]))
    elements.append(Paragraph(f"Invoice No: {order.id}", styles["Normal"]))
    elements.append(Paragraph(f"Date: {datetime.now().strftime('%Y-%m-%d')}", styles["Normal"]))
    elements.append(Paragraph(f"Payment Status: {order.payment_status}", styles["Normal"]))
    elements.append(Spacer(1, 10))

    # 👤 CUSTOMER DETAILS
    elements.append(Paragraph("Customer Details", styles["Heading2"]))
    elements.append(Paragraph(f"Name: {order.user.name}", styles["Normal"]))
    elements.append(Paragraph(f"Email: {order.user.email}", styles["Normal"]))
    elements.append(Paragraph(f"Phone: {order.user.phone}", styles["Normal"]))
    elements.append(Spacer(1, 10))

    # 📍 ADDRESS
    if order.address:
        elements.append(Paragraph("Shipping Address", styles["Heading2"]))
        elements.append(Paragraph(order.address.address_line, styles["Normal"]))
        elements.append(Paragraph(f"{order.address.city}, {order.address.state}", styles["Normal"]))
        elements.append(Paragraph(f"Pincode: {order.address.pincode}", styles["Normal"]))
        elements.append(Spacer(1, 10))

    # 🪑 ORDER ITEMS TABLE
    data = [["S.No", "Product", "Qty", "Unit Price", "Total"]]

    for idx, item in enumerate(order.items.all(), start=1):
        data.append([
            idx,
            item.product.name,
            item.quantity,
            f"₹ {item.price}",
            f"₹ {item.price * item.quantity}"
        ])

    table = Table(data, colWidths=[40, 150, 60, 80, 80])

    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.darkblue),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("GRID", (0, 0), (-1, -1), 1, colors.black),
        ("ALIGN", (2, 1), (-1, -1), "CENTER"),
    ]))

    elements.append(table)
    elements.append(Spacer(1, 15))

    # 💰 PRICING SUMMARY
    elements.append(Paragraph("Pricing Summary", styles["Heading2"]))

    elements.append(Paragraph(f"Subtotal: ₹ {order.total_price}", styles["Normal"]))
    elements.append(Paragraph(f"Tax: ₹ {order.tax}", styles["Normal"]))
    elements.append(Paragraph(f"Delivery Charges: ₹ {order.delivery_charge}", styles["Normal"]))
    elements.append(Paragraph(f"Discount: ₹ {order.discount}", styles["Normal"]))

    elements.append(Spacer(1, 10))

    elements.append(
        Paragraph(f"Grand Total: ₹ {order.grand_total}", styles["Heading1"])
    )

    elements.append(Spacer(1, 20))

    # 📝 TERMS
    elements.append(Paragraph("Terms & Conditions", styles["Heading2"]))
    elements.append(Paragraph("1. Goods once sold will not be returned.", styles["Normal"]))
    elements.append(Paragraph("2. Warranty covers only manufacturing defects.", styles["Normal"]))
    elements.append(Paragraph("3. Delivery may vary based on location.", styles["Normal"]))

    doc.build(elements)
    buffer.seek(0)

    return buffer