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

urlpatterns = router.urls
