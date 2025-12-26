from django.db import models

class AqiLog(models.Model):
    city = models.CharField(max_length=100)
    aqi_value = models.IntegerField()
    status = models.CharField(max_length=50) # Good, Moderate, Hazardous
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.city} - {self.aqi_value}"

class CarbonLog(models.Model):
    # This powers the Distance Tracker
    TRANSPORT_CHOICES = [
        ('walking', 'Walking'),
        ('cycling', 'Cycling'),
        ('bus', 'Public Bus'),
        ('car', 'Private Car'),
    ]
    user_id = models.IntegerField(default=1) # Placeholder for auth
    mode = models.CharField(max_length=20, choices=TRANSPORT_CHOICES)
    distance_km = models.FloatField(default=0.0) # Added distance field
    carbon_saved_kg = models.FloatField(default=0.0)
    timestamp = models.DateTimeField(auto_now_add=True)

class EnergyLog(models.Model):
    # This powers the Appliance Bill Tracker
    appliance_name = models.CharField(max_length=100, default="Unknown Device")
    watts = models.FloatField()
    hours_used = models.FloatField()
    cost_inr = models.FloatField() # The calculated bill amount
    timestamp = models.DateTimeField(auto_now_add=True)


# ... (Keep AqiLog, CarbonLog, EnergyLog as they are) ...

class UserProfile(models.Model):
    # Since we don't have a login system yet, we use a single profile for ID=1
    username = models.CharField(max_length=100, default="PLAYER ONE")
    level = models.IntegerField(default=1)
    current_xp = models.IntegerField(default=0)
    next_level_xp = models.IntegerField(default=500)
    # Stores badges as a list of strings, e.g., ["Starter", "Recycler"]
    badges = models.JSONField(default=list) 

    def __str__(self):
        return f"{self.username} - Lvl {self.level}"

class ImpactLog(models.Model):
    action = models.CharField(max_length=100)
    timestamp = models.DateTimeField(auto_now_add=True)