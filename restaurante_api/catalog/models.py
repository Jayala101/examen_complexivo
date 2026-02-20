from django.db import models


class Tables(models.Model):
    name = models.CharField(max_length=50, null=False, unique=True)
    capacity = models.IntegerField()
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Orders(models.Model):
    table = models.ForeignKey(Tables, on_delete=models.PROTECT, related_name="tables")
    items_summary = models.TextField()
    total = models.DecimalField(max_digits=10, decimal_places=2)
    class Estado(models.TextChoices):
        PENDING = "PENDING"
        IN_PROGRESS = "IN_PROGRESS"
        SERVED = "SERVED"
        PAID = "PAID"
    status = models.CharField(
        max_length=20,
        choices=Estado.choices,
        default=Estado.PENDING
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.id} - {self.status}"