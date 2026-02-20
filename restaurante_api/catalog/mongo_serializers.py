from rest_framework import serializers

class MenusSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=120)
    category = serializers.CharField(required=False, allow_blank=True)
    price = serializers.FloatField(required=False)
    is_available = serializers.BooleanField(default=True)
    created_at = serializers.DateField(required=False) 

class OrderEventSerializer(serializers.Serializer):
    order_id = serializers.IntegerField()       
    event_type = serializers.CharField()          
    source = serializers.CharField()         
    note = serializers.CharField(required=False, allow_blank=True)
    created_at = serializers.DateField(required=False)
