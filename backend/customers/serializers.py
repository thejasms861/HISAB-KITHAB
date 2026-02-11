from rest_framework import serializers
from .models import Customer
from .utils import validate_indian_phone

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['id', 'name', 'phone', 'address', 'created_at']
        read_only_fields = ['created_by']

    def validate_phone(self, value):
        return validate_indian_phone(value)
