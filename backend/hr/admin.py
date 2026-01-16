from django.contrib import admin
from .models import (
    Employee, Department, JobRole, 
    JobAssignment, SatisfactionSurvey, PerformanceReview
)

# Configuration pour afficher plus de détails dans la liste des employés
@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('employee_number', 'age', 'gender', 'marital_status', 'attrition')
    search_fields = ('employee_number',)
    list_filter = ('gender', 'marital_status', 'attrition')

@admin.register(JobAssignment)
class JobAssignmentAdmin(admin.ModelAdmin):
    list_display = ('employee', 'department', 'job_role', 'monthly_income')
    list_filter = ('department', 'job_role')

# Enregistrement simple pour les autres
admin.site.register(Department)
admin.site.register(JobRole)
admin.site.register(SatisfactionSurvey)
admin.site.register(PerformanceReview)