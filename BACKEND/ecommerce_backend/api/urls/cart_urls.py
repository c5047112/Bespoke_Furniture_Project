from django.urls import path
from api.views.cart_view import (
    add_to_cart_view,
    get_cart_view,
    update_cart_item_view,
    delete_cart_item_view
)

urlpatterns = [
    path("add/", add_to_cart_view),
    path("<str:user_id>/", get_cart_view),  
    path("update/<int:item_id>/", update_cart_item_view),
    path("delete/<int:item_id>/", delete_cart_item_view),
]