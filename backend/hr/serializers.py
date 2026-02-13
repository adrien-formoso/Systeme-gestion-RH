from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Employee, Department, JobRole, Contract, JobAssignment, 
    ExitEvent, PerformanceReview, SatisfactionSurvey,
    LeaveRequest, EmployeeDocument, JobOffer, JobApplication, 
    JobHistory, Payroll, Training, EmployeeTraining, AuditLog, Role
)

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = "__all__"

class JobRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobRole
        fields = "__all__"

class JobAssignmentSerializer(serializers.ModelSerializer):
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

class PayrollSerializer(serializers.ModelSerializer):
    employee_lastname = serializers.ReadOnlyField(source='employee.lastname')
    employee_firstname = serializers.ReadOnlyField(source='employee.firstname')
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

class JobApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplication
        fields = "__all__"

class JobOfferSerializer(serializers.ModelSerializer):
    applications = JobApplicationSerializer(many=True, read_only=True)
    class Meta:
        model = JobOffer
        fields = "__all__"

class ExitEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExitEvent
        fields = "__all__"

class AuditLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditLog
        fields = "__all__"

class EmployeeSerializer(serializers.ModelSerializer):
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
    
    manager_name = serializers.SerializerMethodField()

    class Meta:
        model = Employee
        fields = "__all__"

    def get_manager_name(self, obj):
        if obj.manager:
            return f"{obj.manager.firstname} {obj.manager.lastname}"
        return None

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password', 'email', 'first_name', 'last_name')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user

class UserSerializer(serializers.ModelSerializer):
    role = serializers.ReadOnlyField(source='employee_profile.role')
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'role')

# --- SERIALIZER POUR ORGANIGRAMME (Public mais sécurisé) ---
class OrgChartSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = Employee
        fields = ['id', 'name', 'manager', 'role']

    def get_name(self, obj):
        return f"{obj.firstname} {obj.lastname}"