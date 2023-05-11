from django.db import models
from django.contrib.auth.models import User
import json

class Project(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(max_length=100)
    delievery_service = models.CharField(max_length=100, null=True)
    uploaded = models.FileField(upload_to='projects/files/', null=True)
    status = models.CharField(max_length=1,default='0')
    project_owner = models.ForeignKey(
        User, on_delete=models.CASCADE, null=True)
    created_at = models.DateTimeField(auto_now_add=True) 
    criteria = models.TextField(null=True)

    def save(self, *args, **kwargs):
        if self.criteria is not None and not isinstance(self.criteria, str):
            self.criteria = json.dumps(self.criteria)
        super(Project, self).save(*args, **kwargs)

    def get_criteria(self):
        if self.criteria is not None:
            return json.loads(self.criteria)
        return {}
    





class Project_Members(models.Model):
    # id_project = models.ForeignKey(Project , on_delete = models.CASCADE, null = True )
    # id_user = models.ForeignKey(User, on_delete = models.CASCADE, null = True)
    id_project = models.CharField(max_length = 20,null=True) 
    id_user = models.CharField(max_length = 20, null=True) 
    user_role = models.CharField(max_length = 20) 


    