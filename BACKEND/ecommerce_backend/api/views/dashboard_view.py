from rest_framework.decorators import api_view
from rest_framework.response import Response
from api.models.user_model import User
from api.models.product_model import Product
from api.models.order_model import Order
from api.models.staff_model import Staff
from api.models.van_model import Van


@api_view(["GET"])
def dashboard_view(request):
    data = {
        "total_users": User.objects.count(),
        "total_products": Product.objects.count(),
        "total_orders": Order.objects.count(),
        "total_staff": Staff.objects.count(),     # ✅ NEW
        "total_vans": Van.objects.count(),        # ✅ NEW
        "recent_orders": [
            {
                "id": o.id,
                "customer_name": o.user.name,
                "status": o.status
            }
            for o in Order.objects.order_by("-id")[:5]
        ]
    }

    return Response({"success": True, "data": data})



from django.db.models import Count

@api_view(["GET"])
def admin_users_view(request):
    users = User.objects.annotate(order_count=Count("orders"))

    return Response({
        "success": True,
        "data": list(users.values(
            "id", "name", "email", "phone", "order_count"
        ))
    })


from rest_framework.decorators import api_view
from rest_framework.response import Response
from api.models.order_model import Order
from api.serializers.OrderSerializer import OrderSerializer

@api_view(["GET"])
def user_orders_view(request, user_id):
    orders = Order.objects.filter(user_id=user_id).prefetch_related("items__product")

    serializer = OrderSerializer(
        orders,
        many=True,
        context={"request": request}
    )

    return Response({"success": True, "data": serializer.data})