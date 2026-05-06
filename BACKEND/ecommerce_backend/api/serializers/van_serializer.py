from rest_framework import serializers
from api.models.van_model import Van

class VanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Van
        fields = "__all__"