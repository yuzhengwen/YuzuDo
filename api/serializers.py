from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task # This is the model that we want to serialize
        fields = '__all__' # This will serialize all the fields in the model