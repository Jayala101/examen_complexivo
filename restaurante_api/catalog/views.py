from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Tables, Orders
from .serializers import TablesSerializer, OrdersSerializer
from .permissions import IsAdminOrReadOnly

class TablesViewSet(viewsets.ModelViewSet):
    queryset = Tables.objects.all().order_by("id")
    serializer_class = TablesSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ["name"]
    ordering_fields = ["id", "name", "capacity", "is_available"]

class OrdersViewSet(viewsets.ModelViewSet):
    queryset = Orders.objects.select_related("table").all().order_by("-id")
    serializer_class = OrdersSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["table", "status"]
    search_fields = ["id", "items_summary", "status", "created_at"]
    ordering_fields = ["id", "total", "status", "created_at"]

    def get_queryset(self):
        return super().get_queryset()

    def get_permissions(self):
        if self.action == "list":
            return [AllowAny()]
        return super().get_permissions()