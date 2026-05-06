from rest_framework import serializers
from api.models.wishlist_model import Wishlist, WishlistItem

class WishlistItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name")
    product_image = serializers.SerializerMethodField()
    product_id = serializers.IntegerField(source="product.id")

    class Meta:
        model = WishlistItem
        fields = ["id", "product_id", "product_name", "product_image"] 

    def get_product_image(self, obj):
        request = self.context.get("request")
        image = obj.product.images.first()
        if image:
            return request.build_absolute_uri(image.image.url)
        return None


class WishlistSerializer(serializers.ModelSerializer):
    items = WishlistItemSerializer(many=True, read_only=True)

    class Meta:
        model = Wishlist
        fields = ["id", "items"]