from rest_framework import serializers
from .models import Tables, Orders

class TablesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tables
        fields = ["id", "name", "capacity", "is_available"]

class OrdersSerializer(serializers.ModelSerializer):
    tables_name = serializers.CharField(source="table.name", read_only=True)

    class Meta:
        model = Orders
        fields = ["id", "table", "tables_name", "items_summary", "total", "status", "created_at"]