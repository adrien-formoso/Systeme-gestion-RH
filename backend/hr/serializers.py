from rest_framework import serializers
from .models import (
    Employee, Department, JobRole,
    Contract, JobAssignment, ExitEvent,
    PerformanceReview, SatisfactionSurvey,
    LeaveRequest, EmployeeDocument,
    JobOffer, JobApplication, JobHistory,
    Payroll, Training, EmployeeTraining, AuditLog
)

# --- Références ---

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = "__all__"

class JobRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobRole
        fields = "__all__"

# --- Carrière & Mouvements ---

class JobAssignmentSerializer(serializers.ModelSerializer):
    # On garde l'affichage complet pour le GET, mais l'écriture se fait par ID
    department_detail = DepartmentSerializer(source='department', read_only=True)
    job_role_detail = JobRoleSerializer(source='job_role', read_only=True)

    class Meta:
        model = JobAssignment
        fields = "__all__"

class JobHistorySerializer(serializers.ModelSerializer):
    job_role_name = serializers.ReadOnlyField(source='job_role.name')

    class Meta:
        model = JobHistory
        fields = "__all__"

# --- Administratif ---

class ContractSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contract
        fields = "__all__"

class PerformanceReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = PerformanceReview
        fields = "__all__"

class SatisfactionSurveySerializer(serializers.ModelSerializer):
    class Meta:
        model = SatisfactionSurvey
        fields = "__all__"

class LeaveRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaveRequest
        fields = "__all__"

class EmployeeDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeDocument
        fields = "__all__"

# --- Paie & Formation ---

class PayrollSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payroll
        fields = "__all__"

class EmployeeTrainingSerializer(serializers.ModelSerializer):
    training_name = serializers.ReadOnlyField(source='training.name')
    
    class Meta:
        model = EmployeeTraining
        fields = "__all__"

class TrainingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Training
        fields = "__all__"

# --- Recrutement ---

class JobApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplication
        fields = "__all__"

class JobOfferSerializer(serializers.ModelSerializer):
    applications = JobApplicationSerializer(many=True, read_only=True)

    class Meta:
        model = JobOffer
        fields = "__all__"

# --- Sortie & Audit ---

class ExitEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExitEvent
        fields = "__all__"

class AuditLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditLog
        fields = "__all__"

# --- L'Employé (Global) ---

class EmployeeSerializer(serializers.ModelSerializer):
    # Relations One-to-Many ou Many-to-Many (Lecture seule ici pour éviter la complexité au POST)
    contracts = ContractSerializer(many=True, read_only=True)
    job_assignments = JobAssignmentSerializer(many=True, read_only=True)
    job_histories = JobHistorySerializer(many=True, read_only=True)
    performance_reviews = PerformanceReviewSerializer(many=True, read_only=True)
    satisfaction_surveys = SatisfactionSurveySerializer(many=True, read_only=True)
    leave_requests = LeaveRequestSerializer(many=True, read_only=True)
    documents = EmployeeDocumentSerializer(many=True, read_only=True)
    payrolls = PayrollSerializer(many=True, read_only=True)
    trainings = EmployeeTrainingSerializer(source='employeetraining_set', many=True, read_only=True)
    exit_events = ExitEventSerializer(many=True, read_only=True)
    
    # Pour afficher le nom du manager dans la liste
    manager_name = serializers.SerializerMethodField()

    class Meta:
        model = Employee
        fields = "__all__"

    def get_manager_name(self, obj):
        if obj.manager:
            return f"{obj.manager.firstname} {obj.manager.lastname}"
        return None