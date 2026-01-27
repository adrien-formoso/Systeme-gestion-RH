from rest_framework import viewsets
from .models import (
    Employee, Department, JobRole,
    Contract, JobAssignment,
    PerformanceReview, SatisfactionSurvey, ExitEvent,
    LeaveRequest, EmployeeDocument,
    JobOffer, JobApplication
)
from .serializers import (
    EmployeeSerializer, DepartmentSerializer, JobRoleSerializer,
    ContractSerializer, JobAssignmentSerializer,
    PerformanceReviewSerializer, SatisfactionSurveySerializer,
    ExitEventSerializer, LeaveRequestSerializer,
    EmployeeDocumentSerializer, JobOfferSerializer,
    JobApplicationSerializer
)


class EmployeeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer


class DepartmentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer


class JobRoleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = JobRole.objects.all()
    serializer_class = JobRoleSerializer


class ContractViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Contract.objects.all()
    serializer_class = ContractSerializer


class JobAssignmentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = JobAssignment.objects.all()
    serializer_class = JobAssignmentSerializer


class PerformanceReviewViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PerformanceReview.objects.all()
    serializer_class = PerformanceReviewSerializer


class SatisfactionSurveyViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SatisfactionSurvey.objects.all()
    serializer_class = SatisfactionSurveySerializer


class ExitEventViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ExitEvent.objects.all()
    serializer_class = ExitEventSerializer


class LeaveRequestViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = LeaveRequest.objects.all()
    serializer_class = LeaveRequestSerializer


class EmployeeDocumentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = EmployeeDocument.objects.all()
    serializer_class = EmployeeDocumentSerializer


class JobOfferViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = JobOffer.objects.all()
    serializer_class = JobOfferSerializer


class JobApplicationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = JobApplication.objects.all()
    serializer_class = JobApplicationSerializer
