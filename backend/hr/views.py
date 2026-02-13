from rest_framework import viewsets, generics, status
from rest_framework.response import Response
from django.http import HttpResponse
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from .models import (
    Employee, Department, JobRole, Contract, JobAssignment, JobHistory,
    PerformanceReview, SatisfactionSurvey, ExitEvent, LeaveRequest,
    EmployeeDocument, JobOffer, JobApplication, Payroll, Training,
    EmployeeTraining, AuditLog, Role
)
from .serializers import (
    EmployeeSerializer, DepartmentSerializer, JobRoleSerializer,
    ContractSerializer, JobAssignmentSerializer, JobHistorySerializer,
    PerformanceReviewSerializer, SatisfactionSurveySerializer,
    ExitEventSerializer, LeaveRequestSerializer, EmployeeDocumentSerializer,
    JobOfferSerializer, JobApplicationSerializer, PayrollSerializer,
    TrainingSerializer, EmployeeTrainingSerializer, AuditLogSerializer,
    RegisterSerializer, OrgChartSerializer
)

# --- CORE HR : Sécurité Renforcée ---

class EmployeeViewSet(viewsets.ModelViewSet):
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # 1. RH ou SuperAdmin : Voit TOUT
        if user.is_staff or (hasattr(user, 'employee_profile') and user.employee_profile.role == Role.HR_ADMIN):
            return Employee.objects.all()
        
        # 2. Les autres (Employés/Managers) : Ne voient qu'EUX-MÊMES
        if hasattr(user, 'employee_profile'):
            return Employee.objects.filter(id=user.employee_profile.id)
            
        return Employee.objects.none()

class PayrollViewSet(viewsets.ModelViewSet):
    serializer_class = PayrollSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # 1. RH : Voit toutes les paies
        if user.is_staff or (hasattr(user, 'employee_profile') and user.employee_profile.role == Role.HR_ADMIN):
            return Payroll.objects.all()
        
        # 2. Employé : Ne voit que SES paies
        if hasattr(user, 'employee_profile'):
            return Payroll.objects.filter(employee=user.employee_profile)
            
        return Payroll.objects.none()

# --- VUE ORGANIGRAMME SPÉCIALE (Accès public mais données limitées) ---
class OrgChartViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Employee.objects.all() # On renvoie tout le monde
    serializer_class = OrgChartSerializer # MAIS avec le serializer qui cache les infos privées
    permission_classes = [IsAuthenticated]

# --- AUTRES VIEWSETS (Standard) ---
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

class JobHistoryViewSet(viewsets.ModelViewSet):
    queryset = JobHistory.objects.all()
    serializer_class = JobHistorySerializer

class PerformanceReviewViewSet(viewsets.ModelViewSet):
    queryset = PerformanceReview.objects.all()
    serializer_class = PerformanceReviewSerializer

class SatisfactionSurveyViewSet(viewsets.ModelViewSet):
    queryset = SatisfactionSurvey.objects.all()
    serializer_class = SatisfactionSurveySerializer

class LeaveRequestViewSet(viewsets.ModelViewSet):
    queryset = LeaveRequest.objects.all()
    serializer_class = LeaveRequestSerializer

class JobOfferViewSet(viewsets.ModelViewSet):
    queryset = JobOffer.objects.all()
    serializer_class = JobOfferSerializer

class JobApplicationViewSet(viewsets.ModelViewSet):
    queryset = JobApplication.objects.all()
    serializer_class = JobApplicationSerializer

class TrainingViewSet(viewsets.ModelViewSet):
    queryset = Training.objects.all()
    serializer_class = TrainingSerializer

class EmployeeTrainingViewSet(viewsets.ModelViewSet):
    queryset = EmployeeTraining.objects.all()
    serializer_class = EmployeeTrainingSerializer

class EmployeeDocumentViewSet(viewsets.ModelViewSet):
    queryset = EmployeeDocument.objects.all()
    serializer_class = EmployeeDocumentSerializer

class ExitEventViewSet(viewsets.ModelViewSet):
    queryset = ExitEvent.objects.all()
    serializer_class = ExitEventSerializer

class AuditLogViewSet(viewsets.ModelViewSet):
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        # Seul le RH peut créer un compte
        if not request.user.is_staff and (not hasattr(request.user, 'employee_profile') or request.user.employee_profile.role != Role.HR_ADMIN):
            return Response({"detail": "Seul un RH peut créer un compte."}, status=status.HTTP_403_FORBIDDEN)
        return super().post(request, *args, **kwargs)

def generate_pdf(request, payslip_id):
    try:
        slip = Payroll.objects.get(id=payslip_id)
        # Sécurité PDF : chacun le sien
        if not request.user.is_staff and slip.employee.user != request.user:
            return HttpResponse("Accès refusé", status=403)
    except Payroll.DoesNotExist:
        return HttpResponse("Bulletin introuvable", status=404)

    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="Bulletin_{slip.employee.lastname}.pdf"'
    p = canvas.Canvas(response, pagesize=A4)
    w, h = A4
    p.setFont("Helvetica-Bold", 18)
    p.drawString(50, h - 50, "BULLETIN DE PAIE")
    p.setFont("Helvetica", 10)
    p.drawString(50, h - 70, f"Période : {slip.month}/{slip.year}")
    p.drawString(60, h - 120, f"{slip.employee.firstname} {slip.employee.lastname}")
    p.drawString(60, h - 135, f"Matricule: {slip.employee.employee_number}")
    y = h - 200
    p.line(50, y, 550, y)
    
    # C'EST ICI QUE TU AVAIS L'ERREUR DE SYNTAXE
    data = [
        ("Total Brut", f"{slip.gross_salary}"), 
        ("NET À PAYER", f"{slip.net_salary}")
    ]
    
    for label, value in data:
        y -= 25
        p.drawString(50, y, label)
        p.drawString(450, y, f"{value} €")
    p.showPage()
    p.save()
    return response