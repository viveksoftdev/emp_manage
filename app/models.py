from django.db import models

# models for Employee

class Employee(models.Model):

    GENDER_CHOICES = (('m','Male'),
                      ('f','Female'),
                      ('o','Others'))

    name = models.CharField(max_length=255)
    email = models.EmailField(max_length=255,unique=True)
    age = models.PositiveIntegerField()
    gender = models.CharField(max_length=1,choices=GENDER_CHOICES)
    phone = models.CharField(max_length=15)
    address = models.TextField()
    workExp = models.TextField()
    qualifications = models.TextField()
    projects = models.TextField()
    photo = models.TextField()
    


    def __str__(self):
        return f'{self.name}'