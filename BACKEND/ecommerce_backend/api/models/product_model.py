import uuid
from django.db import models
from api.models.category_model import Category


class Product(models.Model):

    sku = models.CharField(max_length=100, blank=True, null=True)
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)

    length = models.FloatField()
    width = models.FloatField()
    height = models.FloatField()

    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)

    is_active = models.BooleanField(default=True)

    weight = models.FloatField(default=0)

    def save(self, *args, **kwargs):
        if not self.sku:
            self.sku = "SKU-" + uuid.uuid4().hex[:8].upper()
        super().save(*args, **kwargs)


class ProductImage(models.Model):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='images'   
    )
    image = models.ImageField(upload_to='products/')