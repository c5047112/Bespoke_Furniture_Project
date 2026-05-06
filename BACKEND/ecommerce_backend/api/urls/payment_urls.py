from django.urls import path
from api.views.payment_view import dummy_payment_view

urlpatterns = [
    path("dummy/", dummy_payment_view),
]