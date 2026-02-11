from django.urls import path
from .views import DashboardStatsView

urlpatterns = [
    path('monthly/', DashboardStatsView.as_view(), name='dashboard_stats'),
]
