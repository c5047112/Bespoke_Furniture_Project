from rest_framework.decorators import api_view
from rest_framework.response import Response
from api.models.order_model import Order

@api_view(["POST"])
def dummy_payment_view(request):
    order_id = request.data.get("order_id")

    order = Order.objects.filter(id=order_id).first()

    if not order:
        return Response({"success": False, "error": "Order not found"})

    # ✅ prevent duplicate payment
    if order.payment_status == "SUCCESS":
        return Response({"success": False, "error": "Already paid"})

    # ✅ ONLY UPDATE PAYMENT STATUS (NOT ORDER STATUS)
    order.payment_status = "SUCCESS"
    order.save()

    return Response({
        "success": True,
        "message": "Payment successful"
    })