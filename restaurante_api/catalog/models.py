from django.db import models


class Tables(models.Model):
    name = models.CharField(max_length=120,null=False)
    capacity = models.IntegerField()
    is_available = models.BooleanField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Orders(models.Model):
    table = models.ForeignKey(Tables, on_delete=models.PROTECT, related_name="tables")
    items_summary = models.CharField()
    total = models.DecimalField(max_digits=10, decimal_places=2)
    class Estado(models.TextChoices):
        PENDING = "Pendiente"
        IN_PROGRESS = "En progreso"
        SERVED = "Servido"
        PAID = "Pagado"
    status = models.CharField(
        max_length=20,
        choices=Estado.choices,
        default=Estado.PENDING
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.items_summary