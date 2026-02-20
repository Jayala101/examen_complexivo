from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import TablesViewSet, OrdersViewSet
from .menus_views import service_types_list_create, service_types_detail
from .order_events_view import vehicle_services_list_create, vehicle_services_detail

router = DefaultRouter()
router.register(r"tables", TablesViewSet, basename="tables")
router.register(r"orders", OrdersViewSet, basename="orders")

urlpatterns = [
    # Mongo
    path("service-types/", service_types_list_create),
    path("service-types//", service_types_detail),
    path("vehicle-services/", vehicle_services_list_create),
    path("vehicle-services//", vehicle_services_detail),
]

urlpatterns += router.urls