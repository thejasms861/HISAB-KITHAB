from django.db import models
from customers.models import Customer

class Transaction(models.Model):
    TRANSACTION_TYPES = (
        ('udhar', 'Udhar (Credit)'),
        ('nagad', 'Nagad (Cash)'),
        ('udhar_vapis', 'Udhar Vapis (Repayment)'),
    )

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='transactions')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    date = models.DateField()
    note = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.transaction_type} - {self.amount} - {self.customer.name}"
