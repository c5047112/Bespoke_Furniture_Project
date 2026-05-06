from rest_framework.decorators import api_view
from rest_framework.response import Response
from api.models.address_model import Address
from api.serializers.Address_Serializers import AddressSerializer

@api_view(["POST"])
def add_address(request):
    print("DATA:", request.data)  

    serializer = AddressSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"success": True, "data": serializer.data})

    print("ERROR:", serializer.errors)
    return Response(serializer.errors, status=400)


@api_view(["GET"])
def get_addresses(request, user_id):
    addresses = Address.objects.filter(user_id=user_id)
    serializer = AddressSerializer(addresses, many=True)
    return Response({"success": True, "data": serializer.data})