from django.core.mail import EmailMessage
from django.conf import settings
from api.utils.invoice_generator import generate_invoice_pdf

def send_invoice_email(order):
    pdf = generate_invoice_pdf(order)

    email = EmailMessage(
    subject=f"Invoice for Order #{order.id}",
    body=f"""
Hi {order.user.name},

Your payment was successful ✅

Order ID: {order.id}
Amount Paid: ₹ {order.grand_total}

Please find your invoice attached.

Thank you for shopping with us 🪑
""",
    from_email=settings.DEFAULT_FROM_EMAIL,
    to=[order.user.email],
)

    email.attach(
        f"invoice_{order.id}.pdf",
        pdf.read(),
        "application/pdf"
    )

    email.send()