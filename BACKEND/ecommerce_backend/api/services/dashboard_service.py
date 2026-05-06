from api.models.user_model import User
from api.models.product_model import Product
from api.models.order_model import Order

from django.db.models import Sum
from datetime import timedelta
from django.utils.timezone import now


def get_dashboard_service():
    # 📊 COUNTS
    total_users = User.objects.count()
    total_products = Product.objects.count()
    total_orders = Order.objects.count()

    # 💰 TOTAL PROFIT (DELIVERED ONLY)
    total_profit = (
        Order.objects.filter(status="DELIVERED")
        .aggregate(total=Sum("grand_total"))["total"] or 0
    )

    # 📦 RECENT ORDERS
    recent_orders = []
    orders = Order.objects.select_related("user").order_by("-id")[:5]

    for o in orders:
        recent_orders.append({
            "id": o.id,
            "customer_name": o.user.name,
            "status": o.status,
            "amount": float(o.grand_total)
        })

    # 📈 LAST 7 DAYS CHART DATA
    last_7_days = []
    labels = []

    for i in range(6, -1, -1):
        day = now().date() - timedelta(days=i)

        orders_count = Order.objects.filter(created_at__date=day).count()

        profit = (
            Order.objects.filter(
                created_at__date=day,
                status="DELIVERED"
            ).aggregate(total=Sum("grand_total"))["total"] or 0
        )

        labels.append(day.strftime("%d %b"))
        last_7_days.append({
            "orders": orders_count,
            "profit": float(profit)
        })

    return {
        "total_users": total_users,
        "total_products": total_products,
        "total_orders": total_orders,
        "total_profit": float(total_profit),
        "recent_orders": recent_orders,
        "chart": {
            "labels": labels,
            "data": last_7_days
        }
    }, "Dashboard fetched"