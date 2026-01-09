from rest_framework import serializers
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    # This ensures the password is write-only (hidden in responses)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        # These are the fields we require from the Frontend
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        # This securely creates the user with a hashed password
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user