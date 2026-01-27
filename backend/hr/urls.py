from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register("employees", EmployeeViewSet)
router.register("departments", DepartmentViewSet)
router.register("job-roles", JobRoleViewSet)
router.register("contracts", ContractViewSet)
router.register("assignments", JobAssignmentViewSet)
router.register("performance-reviews", PerformanceReviewViewSet)
router.register("satisfaction-surveys", SatisfactionSurveyViewSet)
router.register("exit-events", ExitEventViewSet)
router.register("leave-requests", LeaveRequestViewSet)
router.register("employee-documents", EmployeeDocumentViewSet)
router.register("job-offers", JobOfferViewSet)
router.register("job-applications", JobApplicationViewSet)

urlpatterns = router.urls
