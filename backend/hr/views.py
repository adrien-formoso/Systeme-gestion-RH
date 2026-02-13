from rest_framework import viewsets
from django.http import HttpResponse
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors

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

# --- PDF GENERATION (MODULE PAIE) ---

def generate_pdf(request, payslip_id):
    """
    Génère un PDF simple pour un bulletin de paie spécifique.
    Accessible via URL: /api/hr/payrolls/<id>/pdf/
    """
    try:
        slip = Payroll.objects.get(id=payslip_id)
    except Payroll.DoesNotExist:
        return HttpResponse("Bulletin introuvable", status=404)

    # Configuration de la réponse HTTP pour le PDF
    response = HttpResponse(content_type='application/pdf')
    filename = f"Bulletin_{slip.employee.lastname}_{slip.month}_{slip.year}.pdf"
    response['Content-Disposition'] = f'attachment; filename="{filename}"'

    # Création du canvas ReportLab
    p = canvas.Canvas(response, pagesize=A4)
    w, h = A4

    # 1. En-tête "Smart & Mauve"
    p.setFont("Helvetica-Bold", 18)
    p.setFillColorRGB(0.12, 0.16, 0.23) # Anthracite
    p.drawString(50, h - 50, "BULLETIN DE PAIE")
    
    p.setFont("Helvetica", 10)
    p.drawString(50, h - 70, f"Période : {slip.month}/{slip.year}")
    p.drawString(50, h - 85, f"Date d'émission : {slip.generated_date}")

    # 2. Infos Employé (Encadré)
    p.setStrokeColorRGB(0.54, 0.36, 0.96) # Mauve Smart
    p.setLineWidth(1)
    p.rect(50, h - 160, 500, 60, fill=0)
    
    p.setFont("Helvetica-Bold", 12)
    p.drawString(60, h - 120, f"{slip.employee.firstname} {slip.employee.lastname}")
    p.setFont("Helvetica", 10)
    p.drawString(60, h - 135, f"Matricule: {slip.employee.employee_number}")
    p.drawString(300, h - 135, f"Email: {slip.employee.email}")

    # 3. Tableau des montants
    y = h - 200
    p.line(50, y, 550, y)
    p.setFont("Helvetica-Bold", 10)
    p.drawString(50, y - 15, "RUBRIQUE")
    p.drawString(450, y - 15, "MONTANT (EUR)")
    y -= 30
    p.line(50, y, 550, y)
    
    # Données basées sur ton modèle Payroll actuel
    data = [
        ("Total Brut", f"{slip.gross_salary}"),
        ("Primes / Bonus", f"{slip.total_bonuses}"),
        ("Déductions / Cotisations", f"- {slip.total_deductions}"),
        ("NET À PAYER", f"{slip.net_salary}"),
    ]

    y -= 20
    for label, value in data:
        if label == "NET À PAYER":
            p.setFont("Helvetica-Bold", 12)
            p.setFillColorRGB(0.54, 0.36, 0.96) # Mauve
            p.drawString(50, y, label)
            p.drawString(450, y, f"{value} €")
        else:
            p.setFont("Helvetica", 10)
            p.setFillColorRGB(0, 0, 0)
            p.drawString(50, y, label)
            p.drawString(450, y, f"{value} €")
        
        y -= 25

    # 4. Footer
    p.setFont("Helvetica-Oblique", 8)
    p.setFillColorRGB(0.5, 0.5, 0.5)
    p.drawString(50, 50, "Document généré automatiquement par HR Smart System.")
    p.drawString(50, 40, "Ce bulletin est une simulation simplifiée et n'a pas de valeur légale fiscale.")

    p.showPage()
    p.save()
    return response