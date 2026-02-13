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
    generate_pdf, RegisterView, OrgChartViewSet
)

router = DefaultRouter()

# --- Core HR ---
# Basename obligatoire car get_queryset est personnalisé
router.register("employees", EmployeeViewSet, basename="employee")
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
# Basename obligatoire ici aussi
router.register("payrolls", PayrollViewSet, basename="payroll")
router.register("trainings", TrainingViewSet)
router.register("employee-trainings", EmployeeTrainingViewSet)

# --- Documents & Logs ---
router.register("employee-documents", EmployeeDocumentViewSet)
router.register("audit-logs", AuditLogViewSet)

# --- Organigramme Sécurisé ---
router.register("org-chart-data", OrgChartViewSet, basename="org-chart-data")

# --- URL PATTERNS ---
urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', RegisterView.as_view(), name='auth_register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('payrolls/<int:payslip_id>/pdf/', generate_pdf, name='payroll_pdf'),
]