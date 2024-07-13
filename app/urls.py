from django.urls import path
from app import views

#url confs for app

urlpatterns = [
path('',views.HomePageView.as_view()),
path('post',views.CreateEmployeeView.as_view()),
path('show',views.EmployeeList.as_view()),
path('delete', views.DeleteEmployeeView.as_view()),
path('updateview',views.UpdateEmployeeView.as_view())
]
