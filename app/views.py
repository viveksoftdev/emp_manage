from django.db.models.query import QuerySet
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404,render
from django.views.generic import ListView,View
from .models import Employee
import mimetypes
import base64
import json
from django.core.exceptions import ValidationError
from django.http import JsonResponse




class HomePageView(View):
    template_name = 'index.html'
    def get(self,request):
        return render(request,self.template_name)
    


#View class for creating an employee
class CreateEmployeeView(View):
    def post(self, request):
        try:
            # using form for validation of fields

            encoded = ''
            max_number = 4
            base64_img_initials = ''
            if request.FILES and request.POST:
                # extracting the type information of the image using mimetypes
                image_type = mimetypes.guess_type(str(request.FILES.get('image')))[0]
                # base64 image
                encoded = base64.b64encode(request.FILES.get('image').read()).decode('utf-8')

                # adding the initials for base64 text
                base64_img_initials = f'data:{image_type};base64,'

                encoded = base64_img_initials + encoded

            # initializing a companies dictionary for holding the values of companies
            # initializing a projects dictionary for holding the values of projects
            # initializing a qualifications dictionary for holding the values for qualifications
            companies = dict()
            projects = dict()
            qualifications = dict()
            address = dict()
            for item in range(1, max_number + 1):
                company = request.POST.get(f'company{item}')
                start_date =  request.POST.get(f'start__date{item}')
                to_date = request.POST.get(f'to__date{item}')
                
                
                title = request.POST.get(f'title{item}')
                projectDescription = request.POST.get(f'project__description{item}')
                qualification = request.POST.get(f'qualification{item}')
                percentage = request.POST.get(f'percentage{item}')

                city = request.POST.get(f'city{item}')
                state = request.POST.get(f'state{item}')
                house = request.POST.get(f'house{item}')
                street = request.POST.get(f'street{item}')

               
                if company:
                    companies[f'company{item}'] = {'company{item}':company,'Start-Date':start_date,'To-Date':to_date}
                    
                if title:
                    projects[f'title{item}'] = {'Title':title,'Description':projectDescription}
                if qualification:
                    qualifications[f'qualification{item}'] = {'Qualification':qualification,'Percentage':percentage}

                if city:
                    address[f'city{item}'] = {'City':city,'State':state,'House no.':house,'Steet':street}
                    
            # employee data for creating from request.POST
            employeeData = {
                'name': request.POST.get('name'),
                'age': request.POST.get('age'),
                'gender': request.POST.get('gender'),
                'phone': request.POST.get('phone'),
                'email': request.POST.get('email'),
                'address': json.dumps(address),
                'workExp': json.dumps(companies),
                'qualifications': json.dumps(qualifications),
                'projects': json.dumps(projects),
                'photo': encoded
            }
            #saving the employee data to the db
            Employee(**employeeData).save()

            return JsonResponse({'message': 'Successfully created.'})

        except ValidationError as error:
            return JsonResponse({'message': 'Validation Error'})

        except ValueError as error:
            
            return JsonResponse({'message': f'Missing data or incorrect data'})

        except Exception as error:
            print(error)
            return JsonResponse({'message': f'error'})


class EmployeeList(View):
    def get(self,request):
        try:
            data = list(Employee.objects.all().values())
            context = [
            {'name':item.get('name'),
             'email':item.get('email'),
             'gender':item.get('gender'),
             'age':item.get('age')
             }
            for item in data
        ]
            print(context)
        
            return JsonResponse({'values':context})
        except Exception as error:
            return JsonResponse({'values':'error'})
    


@method_decorator(csrf_exempt, name='dispatch')
class UpdateEmployeeView(View):
    # View for retrieving an employee by email and updating it
    def post(self, request,*args,**kwargs):
        try:
            dataDict = json.loads(request.body)  # Parse JSON data from request body
            
            email = dataDict.get('email')
            employee = Employee.objects.get(email=email)  # Retrieve the employee object by email
            
            if 'name' in dataDict:
                employee.name = dataDict['name']
            if 'email' in dataDict:
                employee.email = dataDict['email']
            if 'gender' in dataDict:
                gender = dataDict['gender']
                if len(gender) != 1:
                    raise ValueError('Gender should be exactly one character.')
                employee.gender = gender
            if 'age' in dataDict:
                employee.age = dataDict['age']
            
            employee.save()  # Save the updated employee object
            
            
            
            return JsonResponse({'message': f'Employee updated successfully.'})
        
        except json.JSONDecodeError:
            return JsonResponse({'message': 'Malformed JSON data.', 'status': 400})
        
        except Employee.DoesNotExist:
            return JsonResponse({'message': 'No employee with this email address in our database'}, status=404)
        
        except ValueError as error:
            return JsonResponse({'message': str(error)}, status=400)
        
        except Exception as error:
            # Log the error for debugging purposes
            print(f'Error occurred: {error}')
            return JsonResponse({'message': 'Internal server error'}, status=500)
        


@method_decorator(csrf_exempt, name='dispatch')
class DeleteEmployeeView(View):
    def delete(self, request):
        try:
            # Extracting email from JSON body
            data = json.loads(request.body)
            email = data.get('email', '').strip()
            
            # Check if email is provided
            if not email:
                return JsonResponse({'message': 'Email parameter is missing'}, status=400)
            
            # Attempt to delete employee
            try:
                employee = get_object_or_404(Employee,email=email)
                employee.delete()
                return JsonResponse({'message': f'Employee with email {email} deleted successfully'})
            except Employee.DoesNotExist:
                return JsonResponse({'message': f'Employee with email {email} not found'}, status=404)
        
        except json.JSONDecodeError:
            return JsonResponse({'message': 'Invalid JSON format in request body'}, status=400)
        except Employee.DoesNotExist:
                return JsonResponse({'message': f'Employee with email {email} not found'}, status=404)
        
        