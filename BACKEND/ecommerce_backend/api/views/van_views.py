from rest_framework.decorators import api_view
from rest_framework.response import Response
from api.services.van_service import *
from api.serializers.van_serializer import VanSerializer

@api_view(["POST"])
def add_van_view(request):
    van = add_van(request.data)
    return Response({
        "success": True,
        "data": VanSerializer(van).data
    })

@api_view(["GET"])
def list_vans_view(request):
    vans = list_vans()
    return Response({
        "success": True,
        "data": VanSerializer(vans, many=True).data
    })

@api_view(["GET"])
def available_vans_view(request):
    vans = list_available_vans()
    return Response({
        "success": True,
        "data": VanSerializer(vans, many=True).data
    })


@api_view(["PUT"])
def update_van_view(request, van_id):
    res = edit_van(van_id, request.data)

    if not res["success"]:
        return Response(res, status=404)

    return Response({
        "success": True,
        "data": VanSerializer(res["data"]).data
    })


@api_view(["DELETE"])
def delete_van_view(request, van_id):
    res = remove_van(van_id)

    if not res["success"]:
        return Response(res, status=404)

    return Response(res)