from api.models.order_model import Order

def process_dummy_payment(order_id):
    order = Order.objects.filter(id=order_id).first()

    if not order:
        return {"success": False, "error": "Order not found"}

    if order.payment_status == "SUCCESS":
        return {"success": False, "error": "Already paid"}

    # ✅ Simulate success
    order.payment_status = "SUCCESS"
    order.status = "CONFIRMED"
    order.save()

    return {
        "success": True,
        "message": "Payment successful",
        "order_id": order.id
    }