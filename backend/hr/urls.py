from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import (
    EmployeeViewSet, DepartmentViewSet, JobRoleViewSet,
    ContractViewSet, JobAssignmentViewSet, JobHistoryViewSet,
    PerformanceReviewViewSet, SatisfactionSurveyViewSet,
    LeaveRequestViewSet, JobOfferViewSet, JobApplicationViewSet,
    PayrollViewSet, TrainingViewSet, EmployeeTrainingViewSet,
    EmployeeDocumentViewSet, ExitEventViewSet, AuditLogViewSet,
    generate_pdf, RegisterView # <--- Assure-toi que RegisterView est bien dans views.py
)

router = DefaultRouter()

# --- Core HR ---
router.register("employees", EmployeeViewSet)
router.register("departments", DepartmentViewSet)
router.register("job-roles", JobRoleViewSet)
router.register("contracts", ContractViewSet)
router.register("assignments", JobAssignmentViewSet)

# --- Carrière & Performance ---
router.register("job-history", JobHistoryViewSet)
router.register("performance-reviews", PerformanceReviewViewSet)
router.register("satisfaction-surveys", SatisfactionSurveyViewSet)

# --- Congés & Flux ---
router.register("leave-requests", LeaveRequestViewSet)
router.register("exit-events", ExitEventViewSet)

# --- Recrutement ---
router.register("job-offers", JobOfferViewSet)
router.register("job-applications", JobApplicationViewSet)

# --- Paie & Formation ---
router.register("payrolls", PayrollViewSet)
router.register("trainings", TrainingViewSet)
router.register("employee-trainings", EmployeeTrainingViewSet)

# --- Documents & Logs ---
router.register("employee-documents", EmployeeDocumentViewSet)
router.register("audit-logs", AuditLogViewSet)

# --- URL PATTERNS ---
urlpatterns = [
    # 1. Routes API CRUD standards
    path('', include(router.urls)),

    # 2. Authentification (JWT)
    path('auth/register/', RegisterView.as_view(), name='auth_register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # 3. Route PDF Paie
    path('payrolls/<int:payslip_id>/pdf/', generate_pdf, name='payslip-pdf'),
]