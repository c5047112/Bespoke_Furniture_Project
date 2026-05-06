from rest_framework import serializers
from api.models.order_model import Order
from api.serializers.Address_Serializers import AddressSerializer


class OrderSerializer(serializers.ModelSerializer):
    driver_name = serializers.SerializerMethodField()
    van_number = serializers.SerializerMethodField()
    items = serializers.SerializerMethodField()
    address = AddressSerializer(read_only=True)

    class Meta:
        model = Order
        fields = "__all__"

    def get_driver_name(self, obj):
        return obj.driver.name if obj.driver else None

    def get_van_number(self, obj):
        return obj.van.vehicle_number if obj.van else None

    # ✅ FIXED PROPERLY
    def get_items(self, obj):
        request = self.context.get("request")

        items_data = []

        for item in obj.items.all():
            product = item.product

            images = []
            if product.images.exists():
                for img in product.images.all():
                    url = img.image.url
                    if request:
                        url = request.build_absolute_uri(url)
                    images.append(url)

            items_data.append({
                "product_name": product.name,
                "quantity": item.quantity,
                "price": float(item.price),
                "total": float(item.price * item.quantity),
                "images": images,
                "size": getattr(product, "size", None),
                "color": getattr(product, "color", None),
            })

        return items_data