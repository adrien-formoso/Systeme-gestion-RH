from django.contrib import admin
from .models import (
    Employee, Department, JobRole,
    JobAssignment, Contract, ExitEvent,
    PerformanceReview, SatisfactionSurvey,
    LeaveRequest, EmployeeDocument,
    JobOffer, JobApplication
)

# --- Configuration de l'affichage des Employés ---
@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = (
        'employee_number',
        'firstname',
        'lastname',
        'status',
        'leave_balance',
        'hire_date',
        'manager'
    )

    list_display_links = ('employee_number', 'firstname', 'lastname')

    search_fields = ('employee_number', 'firstname', 'lastname', 'education_field')

    list_filter = ('status', 'gender', 'attrition', 'marital_status')

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


# --- Configuration des Congés ---
@admin.register(LeaveRequest)
class LeaveRequestAdmin(admin.ModelAdmin):
    list_display = (
        'employee',
        'leave_type',
        'start_date',
        'end_date',
        'days_requested',
        'status'
    )
    list_filter = ('leave_type', 'status')


# --- Configuration des Documents Employés ---
@admin.register(EmployeeDocument)
class EmployeeDocumentAdmin(admin.ModelAdmin):
    list_display = ('employee', 'document_type', 'uploaded_at')
    list_filter = ('document_type',)


# --- Configuration du Recrutement ---
@admin.register(JobOffer)
class JobOfferAdmin(admin.ModelAdmin):
    list_display = ('title', 'department', 'contract_type', 'application_deadline', 'is_internal')
    list_filter = ('department', 'is_internal')


@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = ('firstname', 'lastname', 'email', 'job_offer', 'status')
    list_filter = ('status',)


# --- Enregistrements simples pour le reste ---
admin.site.register(Department)
admin.site.register(JobRole)
admin.site.register(PerformanceReview)
admin.site.register(SatisfactionSurvey)
