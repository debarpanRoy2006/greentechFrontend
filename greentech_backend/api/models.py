from django.db import models
from django.contrib.auth.models import User

# Feature 1: AQI Logs
class AqiLog(models.Model):
    city = models.CharField(max_length=100)
    aqi_value = models.IntegerField()
    status = models.CharField(max_length=50) 
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.city} - {self.aqi_value}"

# Feature 2: Carbon/Transport Logs
class CarbonLog(models.Model):
    TRANSPORT_CHOICES = [
        ('walking', 'Walking'),
        ('cycling', 'Cycling'),
        ('bus', 'Public Bus'),
        ('car', 'Private Car'),
    ]
    # MUST BE FOREIGN KEY FOR AUTH TO WORK
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    mode = models.CharField(max_length=20, choices=TRANSPORT_CHOICES)
    distance_km = models.FloatField(default=0.0) 
    carbon_saved_kg = models.FloatField(default=0.0)
    timestamp = models.DateTimeField(auto_now_add=True)

# Feature 3: Energy Logs
class EnergyLog(models.Model):
    appliance_name = models.CharField(max_length=100, default="Unknown Device")
    watts = models.FloatField()
    hours_used = models.FloatField()
    cost_inr = models.FloatField() 
    timestamp = models.DateTimeField(auto_now_add=True)

# Gamification Profile
class UserProfile(models.Model):
    # MUST BE ONE-TO-ONE FIELD FOR AUTH TO WORK
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    level = models.IntegerField(default=1)
    current_xp = models.IntegerField(default=0)
    next_level_xp = models.IntegerField(default=500)
    badges = models.JSONField(default=list) 

    def __str__(self):
        return f"{self.user.username} - Lvl {self.level}"

# Impact Logs
class ImpactLog(models.Model):
    action = models.CharField(max_length=100)
    timestamp = models.DateTimeField(auto_now_add=True)