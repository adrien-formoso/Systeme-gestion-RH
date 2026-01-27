from rest_framework import serializers
from .models import (
    Employee, Department, JobRole,
    Contract, JobAssignment, ExitEvent,
    PerformanceReview, SatisfactionSurvey,
    LeaveRequest, EmployeeDocument,
    JobOffer, JobApplication
)


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = "__all__"


class JobRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobRole
        fields = "__all__"


class ContractSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contract
        fields = "__all__"


class JobAssignmentSerializer(serializers.ModelSerializer):
    department = DepartmentSerializer(read_only=True)
    job_role = JobRoleSerializer(read_only=True)

    class Meta:
        model = JobAssignment
        fields = "__all__"


class PerformanceReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = PerformanceReview
        fields = "__all__"


class SatisfactionSurveySerializer(serializers.ModelSerializer):
    class Meta:
        model = SatisfactionSurvey
        fields = "__all__"


class ExitEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExitEvent
        fields = "__all__"


class LeaveRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaveRequest
        fields = "__all__"


class EmployeeDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeDocument
        fields = "__all__"


class JobOfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobOffer
        fields = "__all__"


class JobApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplication
        fields = "__all__"


class EmployeeSerializer(serializers.ModelSerializer):
    contracts = ContractSerializer(many=True, read_only=True)
    assignment = JobAssignmentSerializer(read_only=True)
    performance_reviews = PerformanceReviewSerializer(many=True, read_only=True)
    satisfaction_surveys = SatisfactionSurveySerializer(many=True, read_only=True)
    exit_info = ExitEventSerializer(read_only=True)
    leave_requests = LeaveRequestSerializer(many=True, read_only=True)
    documents = EmployeeDocumentSerializer(many=True, read_only=True)

    class Meta:
        model = Employee
        fields = "__all__"
