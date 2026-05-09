from django.urls import path
from api.views.admin_views import admin_login_view
from api.views.dashboard_view import dashboard_view
from api.views.user_view import admin_users_view
from api.views.dashboard_view import user_orders_view

urlpatterns = [
    path('login/', admin_login_view),
    path('dashboard/', dashboard_view),
    path("users/", admin_users_view), 

    path("user-orders/<str:user_id>/", user_orders_view),
]