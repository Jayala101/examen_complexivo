from rest_framework import serializers
from .models import Tables, Orders

class TablesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tables
        fields = ["id", "name", "capacity", "is_available"]

class OrdersSerializer(serializers.ModelSerializer):
    tables_name = serializers.CharField(source="tables.name", read_only=True)

    class Meta:
        model = Orders
        fields = ["id", "tables_name", "total", "status","created_at"]