from django.db import models
from api.models.user_model import User
from api.models.product_model import Product


class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)