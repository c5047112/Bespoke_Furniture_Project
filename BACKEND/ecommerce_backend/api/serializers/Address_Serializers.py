from rest_framework import serializers
from api.models.address_model import Address

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = "__all__"