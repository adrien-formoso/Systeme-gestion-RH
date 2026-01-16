from django.contrib import admin
from .models import (
    Employee, Department, JobRole, 
    JobAssignment, Contract, ExitEvent, 
    PerformanceReview, SatisfactionSurvey
)

# --- Configuration de l'affichage des Employés ---
@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    # Champs affichés dans la liste
    list_display = ('employee_number', 'age', 'gender', 'hire_date', 'attrition', 'manager')
    # Barre de recherche
    search_fields = ('employee_number', 'education_field')
    # Filtres sur le côté droit
    list_filter = ('gender', 'attrition', 'marital_status')
    # Organisation par date
    date_hierarchy = 'hire_date'

# --- Configuration des Contrats ---
@admin.register(Contract)
class ContractAdmin(admin.ModelAdmin):
    list_display = ('employee', 'contract_type', 'start_date', 'is_active')
    list_filter = ('contract_type', 'is_active')

# --- Configuration des Postes ---
@admin.register(JobAssignment)
class JobAssignmentAdmin(admin.ModelAdmin):
    list_display = ('employee', 'department', 'job_role', 'monthly_income', 'job_level')
    list_filter = ('department', 'job_role', 'business_travel')

# --- Configuration des Départs ---
@admin.register(ExitEvent)
class ExitEventAdmin(admin.ModelAdmin):
    list_display = ('employee', 'exit_date', 'reason')
    list_filter = ('reason',)

# --- Enregistrements simples pour le reste ---
admin.site.register(Department)
admin.site.register(JobRole)
admin.site.register(PerformanceReview)
admin.site.register(SatisfactionSurvey)