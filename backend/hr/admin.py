from django.contrib import admin
from .models import (
    Employee, Department, JobRole,
    JobAssignment, Contract, ExitEvent,
    PerformanceReview, SatisfactionSurvey,
    LeaveRequest, EmployeeDocument,
    JobOffer, JobApplication, JobHistory,
    Payroll, Training, EmployeeTraining, AuditLog
)

# --- INLINES (Pour voir les détails directement dans la fiche employé) ---

class ContractInline(admin.TabularInline):
    model = Contract
    extra = 0

class JobAssignmentInline(admin.StackedInline):
    model = JobAssignment
    extra = 0

class PayrollInline(admin.TabularInline):
    model = Payroll
    extra = 0

# --- CONFIGURATION PRINCIPALE : EMPLOYE ---

@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = (
        'employee_number',
        'firstname',
        'lastname',
        'status',
        'email',
        'hire_date',
        'salary_brut',
        'manager'
    )
    list_display_links = ('employee_number', 'firstname', 'lastname')
    search_fields = ('employee_number', 'firstname', 'lastname', 'email')
    list_filter = ('status', 'gender', 'nationality', 'marital_status')
    date_hierarchy = 'hire_date'
    
    # Intégration des relations directes dans la fiche
    inlines = [JobAssignmentInline, ContractInline, PayrollInline]
    
    fieldsets = (
        ('Identité', {
            'fields': ('user', 'employee_number', ('firstname', 'lastname'), 'gender', 'birth_date', 'nationality')
        }),
        ('Coordonnées', {
            'fields': (('email', 'phone'), 'address', 'distance_from_home')
        }),
        ('Situation Professionnelle', {
            'fields': ('status', 'hire_date', 'salary_brut', 'leave_balance', 'manager')
        }),
        ('Documents Légaux', {
            'fields': ('social_security_number', 'marital_status')
        }),
    )

# --- CARRIÈRE & PERFORMANCE ---

@admin.register(JobHistory)
class JobHistoryAdmin(admin.ModelAdmin):
    list_display = ('employee', 'job_role', 'start_date', 'end_date', 'salary')
    list_filter = ('job_role',)

@admin.register(PerformanceReview)
class PerformanceReviewAdmin(admin.ModelAdmin):
    list_display = ('employee', 'review_date', 'performance_rating', 'percent_salary_hike')
    list_filter = ('performance_rating',)

# --- PAIE & FORMATION ---

@admin.register(Payroll)
class PayrollAdmin(admin.ModelAdmin):
    list_display = ('employee', 'month', 'year', 'net_salary', 'generated_date')
    list_filter = ('year', 'month')

class EmployeeTrainingInline(admin.TabularInline):
    model = EmployeeTraining
    extra = 1

@admin.register(Training)
class TrainingAdmin(admin.ModelAdmin):
    list_display = ('name', 'start_date', 'end_date', 'cost')
    inlines = [EmployeeTrainingInline]

# --- RECRUTEMENT ---

@admin.register(JobOffer)
class JobOfferAdmin(admin.ModelAdmin):
    list_display = ('title', 'department', 'contract_type', 'application_deadline', 'is_internal')
    list_filter = ('department', 'contract_type', 'is_internal')

@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = ('firstname', 'lastname', 'job_offer', 'status', 'application_date')
    list_filter = ('status', 'job_offer')

# --- LOGS & AUDIT ---

@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ('action_date', 'employee', 'action', 'target_table')
    readonly_fields = ('action_date',) # On ne modifie pas un log d'audit
    list_filter = ('target_table', 'action')

# --- AUTRES ENREGISTREMENTS ---

@admin.register(LeaveRequest)
class LeaveRequestAdmin(admin.ModelAdmin):
    list_display = ('employee', 'leave_type', 'start_date', 'end_date', 'status')
    list_filter = ('status', 'leave_type')

admin.site.register(Department)
admin.site.register(JobRole)
admin.site.register(JobAssignment)
admin.site.register(Contract)
admin.site.register(ExitEvent)
admin.site.register(SatisfactionSurvey)
admin.site.register(EmployeeDocument)