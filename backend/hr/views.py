from rest_framework import viewsets
from .models import (
    Employee, Department, JobRole,
    Contract, JobAssignment,
    PerformanceReview, SatisfactionSurvey, ExitEvent
)
from .serializers import (
    EmployeeSerializer, DepartmentSerializer, JobRoleSerializer,
    ContractSerializer, JobAssignmentSerializer,
    PerformanceReviewSerializer, SatisfactionSurveySerializer, ExitEventSerializer
)


class EmployeeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer


class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer


class JobRoleViewSet(viewsets.ModelViewSet):
    queryset = JobRole.objects.all()
    serializer_class = JobRoleSerializer


class ContractViewSet(viewsets.ModelViewSet):
    queryset = Contract.objects.all()
    serializer_class = ContractSerializer


class JobAssignmentViewSet(viewsets.ModelViewSet):
    queryset = JobAssignment.objects.all()
    serializer_class = JobAssignmentSerializer


class PerformanceReviewViewSet(viewsets.ModelViewSet):
    queryset = PerformanceReview.objects.all()
    serializer_class = PerformanceReviewSerializer


class SatisfactionSurveyViewSet(viewsets.ModelViewSet):
    queryset = SatisfactionSurvey.objects.all()
    serializer_class = SatisfactionSurveySerializer


class ExitEventViewSet(viewsets.ModelViewSet):
    queryset = ExitEvent.objects.all()
    serializer_class = ExitEventSerializer
