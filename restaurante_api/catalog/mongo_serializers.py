from rest_framework import serializers

class MenusSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=120)
    category = serializers.CharField(required=False, allow_blank=True)
    price = serializers.FloatField(required=False)
    is_available = serializers.BooleanField(default=True)
    created_at = serializers.DateField(required=False) 

class OrderEventSerializer(serializers.Serializer):
    order_id = serializers.IntegerField()        # ID de Vehiculo (Postgres)
    event_type = serializers.CharField()
    source = serializers.CharField()
    created_at = serializers.DateField(required=False) 