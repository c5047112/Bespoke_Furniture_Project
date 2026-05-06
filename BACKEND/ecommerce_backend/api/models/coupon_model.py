from django.db import models

class Coupon(models.Model):
    code = models.CharField(max_length=50)
    discount_percent = models.IntegerField()
    min_order = models.FloatField()
    order_number = models.IntegerField()  # 1st, 5th order