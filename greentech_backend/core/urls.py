from django.contrib import admin
from django.urls import path
from api import views

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Feature 1: AQI
    path('api/aqi/', views.get_latest_aqi),
    
    # Feature 2: Distance/Carbon
    path('api/log-transport/', views.log_transport),
    
    # Feature 3: Appliance Bill
    path('api/calc-energy/', views.calculate_energy),
    path('api/profile/', views.get_user_profile),
    path('api/log-impact/', views.log_impact),
]