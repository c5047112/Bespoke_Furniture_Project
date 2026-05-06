from django.urls import path, include

urlpatterns = [
    path("auth/", include("api.urls.auth_urls")),
    path("products/",include("api.urls.product_urls")),
    path("cart/", include("api.urls.cart_urls")),
    path("address/",include("api.urls.address_urls")),
    path("order/", include("api.urls.order_urls")),
    path("admin/staff/", include("api.urls.staff_urls")),
    path("admin/vans/", include("api.urls.van_urls")),
    path("payment/", include("api.urls.payment_urls")),
    path("", include("api.urls.order_urls")),
    path("admin/",include("api.urls.admin_urls")),
    path("wishlist/", include("api.urls.wishlist_urls")),
]