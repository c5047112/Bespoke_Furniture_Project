from rest_framework import serializers
from decimal import Decimal
from api.models.cart_model import Cart, CartItem


# ✅ CART ITEM
class CartItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    price = serializers.DecimalField(
        source="product.price",
        max_digits=10,
        decimal_places=2,
        read_only=True
    )
    product_image = serializers.SerializerMethodField()

    stock = serializers.IntegerField(source="product.stock", read_only=True)


    class Meta:
        model = CartItem
        fields = [
            "id",
            "product",
            "product_name",
            "price",
            "quantity",
            "product_image",
            "stock",
        ]

    def get_product_image(self, obj):
        if obj.product.images.exists():
            return obj.product.images.first().image.url
        return ""


# ✅ CART SERIALIZER (FULL FIX)
class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)

    total_price = serializers.SerializerMethodField()
    tax = serializers.SerializerMethodField()
    delivery_charge = serializers.SerializerMethodField()
    grand_total = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ["id", "items", "total_price", "tax", "delivery_charge", "grand_total"]

    def get_total_price(self, obj):
        return sum(
            (item.product.price * item.quantity for item in obj.items.all()),
            Decimal("0.00")
        )

    from decimal import Decimal

    # DELIVERY SLABS
    def get_delivery_charge(self, obj):
        total = self.get_total_price(obj)

        if total <= 5000:
            return Decimal("500")
        elif total <= 10000:
            return Decimal("1000")
        elif total <= 20000:
            return Decimal("1500")
        elif total <= 50000:
            return Decimal("2000")
        elif total <= 100000:
            return Decimal("3000")
        else:
            return Decimal("5000")

    # TAX SLABS
    def get_tax(self, obj):
        total = self.get_total_price(obj)

        if total <= 5000:
            return total * Decimal("0.05")
        elif total <= 10000:
            return total * Decimal("0.08")
        elif total <= 20000:
            return total * Decimal("0.10")
        elif total <= 50000:
            return total * Decimal("0.12")
        elif total <= 100000:
            return total * Decimal("0.15")
        else:
            return total * Decimal("0.18")
        

    def get_grand_total(self, obj):
        return (
            self.get_total_price(obj)
            + self.get_tax(obj)
            + self.get_delivery_charge(obj)
        )