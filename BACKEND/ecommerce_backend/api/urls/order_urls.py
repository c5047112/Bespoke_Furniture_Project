from django.urls import path
from api.views.order_views import *

urlpatterns = [
    path("checkout/<str:user_id>/<int:address_id>/", checkout_view),
    path("send-otp/", send_otp_view),
    path("confirm/", confirm_order_view),
    path("history/<str:user_id>/", order_history_view),


    # Admin order urls
    path("admin/orders/", list_all_orders_view),
    path("admin/orders/<int:order_id>/assign/", assign_order_view),
    path("admin/orders/<int:order_id>/assign/", assign_order_view),
    path("admin/user-orders/<str:user_id>/", user_orders_view),

    # ✅ STAFF DASHBOARD
    path("staff/orders/<int:staff_id>/", staff_orders_view),
    path("admin/orders/<int:order_id>/delete/", delete_order_view),
    path("admin/orders/<int:order_id>/", get_order_detail_view),
    path("admin/orders/<int:order_id>/vans/", suitable_vans_view),
]