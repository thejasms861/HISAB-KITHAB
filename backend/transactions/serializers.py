from rest_framework import serializers
from .models import Transaction

class TransactionSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.name', read_only=True)

    class Meta:
        model = Transaction
        fields = ['id', 'customer', 'customer_name', 'amount', 'transaction_type', 'date', 'note', 'created_at']
