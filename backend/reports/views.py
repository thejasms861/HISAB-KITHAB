from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from transactions.models import Transaction
from customers.models import Customer
from django.db.models import Sum, F
from django.db import models
from django.db.models.functions import TruncWeek
from django.utils import timezone
from datetime import timedelta

class DashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        total_customers = Customer.objects.filter(created_by=user).count()
        transactions = Transaction.objects.filter(customer__created_by=user)
        
        total_credit = transactions.filter(transaction_type='udhar').aggregate(Sum('amount'))['amount__sum'] or 0
        total_debit = transactions.filter(transaction_type='udhar_vapis').aggregate(Sum('amount'))['amount__sum'] or 0
        total_nagad = transactions.filter(transaction_type='nagad').aggregate(Sum('amount'))['amount__sum'] or 0
        
        # Chart Data
        period = request.query_params.get('period', 'weekly')
        today = timezone.now().date()
        
        if period == 'monthly':
            from django.db.models.functions import TruncMonth
            start_date = today - timedelta(days=180) # Last 6 months
            trunc_func = TruncMonth('date')
            date_format = '%b %Y'
        else: # weekly
            start_date = today - timedelta(days=28) # Last 4 weeks
            trunc_func = TruncWeek('date')
            date_format = '%d %b'

        chart_data = (
            transactions.filter(date__gte=start_date)
            .annotate(period=trunc_func)
            .values('period')
            .annotate(
                credit=Sum('amount', filter=models.Q(transaction_type='udhar')),
                debit=Sum('amount', filter=models.Q(transaction_type='udhar_vapis')),
                nagad=Sum('amount', filter=models.Q(transaction_type='nagad'))
            )
            .order_by('period')
        )

        formatted_chart_data = []
        for entry in chart_data:
            if period == 'weekly':
                # Use ISO week number
                week_num = entry['period'].isocalendar()[1]
                name = f"Week {week_num}"
            else:
                name = entry['period'].strftime(date_format)

            formatted_chart_data.append({
                "name": name,
                "credit": entry['credit'] or 0,
                "debit": entry['debit'] or 0,
                "nagad": entry['nagad'] or 0
            })

        # Fill in missing weeks if needed, but for now let's just send what we have
        
        return Response({
            "total_customers": total_customers,
            "total_credit": total_credit,
            "total_debit": total_debit,
            "total_nagad": total_nagad, # New field
            # Correct Logic: Net Balance = To Receive (Udhar) - Paid (Udhar Vapis).
            # Nagad (Cash Sale) is neutral and does not affect the 'Due' amount.
            "net_balance": total_credit - total_debit,
            "chart_data": formatted_chart_data
        })
