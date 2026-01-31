from rest_framework import viewsets
from .models import (
    Employee, Department, JobRole,
    Contract, JobAssignment, JobHistory,
    PerformanceReview, SatisfactionSurvey, ExitEvent,
    LeaveRequest, EmployeeDocument,
    JobOffer, JobApplication,
    Payroll, Training, EmployeeTraining, AuditLog
)
from .serializers import (
    EmployeeSerializer, DepartmentSerializer, JobRoleSerializer,
    ContractSerializer, JobAssignmentSerializer, JobHistorySerializer,
    PerformanceReviewSerializer, SatisfactionSurveySerializer,
    ExitEventSerializer, LeaveRequestSerializer,
    EmployeeDocumentSerializer, JobOfferSerializer,
    JobApplicationSerializer, PayrollSerializer,
    TrainingSerializer, EmployeeTrainingSerializer, AuditLogSerializer
)

# --- CORE HR ---

class EmployeeViewSet(viewsets.ModelViewSet):
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

# --- HISTORY & PERFORMANCE ---

class JobHistoryViewSet(viewsets.ModelViewSet):
    queryset = JobHistory.objects.all()
    serializer_class = JobHistorySerializer

class PerformanceReviewViewSet(viewsets.ModelViewSet):
    queryset = PerformanceReview.objects.all()
    serializer_class = PerformanceReviewSerializer

class SatisfactionSurveyViewSet(viewsets.ModelViewSet):
    queryset = SatisfactionSurvey.objects.all()
    serializer_class = SatisfactionSurveySerializer

# --- LEAVES & ABSENCES ---

class LeaveRequestViewSet(viewsets.ModelViewSet):
    queryset = LeaveRequest.objects.all()
    serializer_class = LeaveRequestSerializer

# --- RECRUITMENT ---

class JobOfferViewSet(viewsets.ModelViewSet):
    queryset = JobOffer.objects.all()
    serializer_class = JobOfferSerializer

class JobApplicationViewSet(viewsets.ModelViewSet):
    queryset = JobApplication.objects.all()
    serializer_class = JobApplicationSerializer

# --- PAYROLL & TRAINING ---

class PayrollViewSet(viewsets.ModelViewSet):
    queryset = Payroll.objects.all()
    serializer_class = PayrollSerializer

class TrainingViewSet(viewsets.ModelViewSet):
    queryset = Training.objects.all()
    serializer_class = TrainingSerializer

class EmployeeTrainingViewSet(viewsets.ModelViewSet):
    queryset = EmployeeTraining.objects.all()
    serializer_class = EmployeeTrainingSerializer

# --- DOCUMENTS, EXIT & AUDIT ---

class EmployeeDocumentViewSet(viewsets.ModelViewSet):
    queryset = EmployeeDocument.objects.all()
    serializer_class = EmployeeDocumentSerializer

class ExitEventViewSet(viewsets.ModelViewSet):
    queryset = ExitEvent.objects.all()
    serializer_class = ExitEventSerializer

class AuditLogViewSet(viewsets.ModelViewSet):
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer