from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    shop_name = models.CharField(max_length=255)
    owner_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=15, unique=True)
    email = models.EmailField(unique=True)

    # Set email as the unique identifier for auth
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'shop_name', 'owner_name', 'phone']

    def __str__(self):
        return f"{self.shop_name} ({self.owner_name})"
