from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import TablesViewSet, OrdersViewSet
from .menus_views import menus_list_create, menus_detail
from .order_events_view import order_events_list_create, order_events_detail

router = DefaultRouter()
router.register(r"tables", TablesViewSet, basename="tables")
router.register(r"orders", OrdersViewSet, basename="orders")

urlpatterns = [
    # Mongo
    path("menus/", menus_list_create),
    path("menus/<str:id>/", menus_detail),
    path("order_events/", order_events_list_create),
    path("order_events/<str:id>/", order_events_detail),
]

urlpatterns += router.urls