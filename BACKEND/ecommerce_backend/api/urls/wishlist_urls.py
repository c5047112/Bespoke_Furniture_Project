# api/urls/wishlist_urls.py

from django.urls import path
from api.views.wishlist_view import *

urlpatterns = [
    path("add/", add_to_wishlist),
    path("<uuid:user_id>/", get_wishlist),
    path("delete/<int:item_id>/", remove_from_wishlist),
]