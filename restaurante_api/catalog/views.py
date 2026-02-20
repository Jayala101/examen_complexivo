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
    queryset = Orders.objects.select_related("tables_name").all().order_by("-id")
    serializer_class = OrdersSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["tables_name"]
    search_fields = ["id", "tables_name", "total", "status","created_at"]
    ordering_fields = ["id", "tables_name", "total", "status","created_at"]

    def get_queryset(self):
        qs = super().get_queryset()
        anio_min = self.request.query_params.get("anio_min")
        anio_max = self.request.query_params.get("anio_max")
        if anio_min:
            qs = qs.filter(anio__gte=int(anio_min))
        if anio_max:
            qs = qs.filter(anio__lte=int(anio_max))
        return qs

    def get_permissions(self):
        # Público: SOLO listar vehículos
        if self.action == "list":
            return [AllowAny()]
        return super().get_permissions()