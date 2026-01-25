from django.db import models
from django.contrib.auth.models import User

# --- Tables de Référence (Lookups) ---

class Department(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class JobRole(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


# --- Table Principale ---

class Employee(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    employee_number = models.IntegerField(unique=True)
    age = models.PositiveIntegerField(null=True, blank=True)
    gender = models.CharField(max_length=10, default='Unknown')
    firstname = models.CharField(max_length=20, default='Unknown')
    lastname = models.CharField(max_length=20, default='Unknown')
    marital_status = models.CharField(max_length=20, default='Unknown')
    education_field = models.CharField(max_length=100, null=True, blank=True)
    distance_from_home = models.PositiveIntegerField(default=0)
    attrition = models.CharField(max_length=5, default='No')

    hire_date = models.DateField(null=True, blank=True)

    status = models.CharField(
        max_length=20,
        choices=[
            ('ACTIVE', 'Active'),
            ('ON_LEAVE', 'On leave'),
            ('EXITED', 'Exited')
        ],
        default='ACTIVE'
    )

    leave_balance = models.PositiveIntegerField(default=25)

    manager = models.ForeignKey(
        "self",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="subordinates"
    )

    def __str__(self):
        return f"Emp {self.employee_number} ({self.gender})"


# --- Tables de Détails et Historique ---

class Contract(models.Model):
    CONTRACT_TYPES = [
        ("CDI", "Permanent"),
        ("CDD", "Fixed-term"),
        ("INTERNSHIP", "Internship"),
        ("APPRENTICESHIP", "Apprenticeship"),
    ]

    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="contracts")
    contract_type = models.CharField(max_length=20, choices=CONTRACT_TYPES, default="CDI")
    weekly_hours = models.PositiveIntegerField(default=35)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.contract_type} - {self.employee}"


class JobAssignment(models.Model):
    employee = models.OneToOneField(Employee, on_delete=models.CASCADE, related_name="assignment")
    department = models.ForeignKey(Department, on_delete=models.PROTECT)
    job_role = models.ForeignKey(JobRole, on_delete=models.PROTECT)

    job_level = models.PositiveIntegerField(default=1)
    monthly_income = models.PositiveIntegerField(default=0)
    business_travel = models.CharField(max_length=50, default='Non-Travel')
    overtime = models.CharField(max_length=5, default='No')

    years_at_company = models.PositiveIntegerField(default=0)
    years_since_last_promotion = models.PositiveIntegerField(default=0)

    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.employee} - {self.job_role}"


class ExitEvent(models.Model):
    REASONS = [
        ('Career Change', 'Changement de carrière'),
        ('Better Offer', 'Meilleure opportunité'),
        ('Personal Reasons', 'Raisons personnelles'),
        ('Retirement', 'Retraite'),
    ]

    employee = models.OneToOneField(Employee, on_delete=models.CASCADE, related_name="exit_info")
    exit_date = models.DateField()
    reason = models.CharField(max_length=100, choices=REASONS)

    def __str__(self):
        return f"Sortie: {self.employee}"


# --- Tables de Suivi ---

class PerformanceReview(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="performance_reviews")
    performance_rating = models.PositiveIntegerField(default=3)
    percent_salary_hike = models.PositiveIntegerField(default=0)
    training_times_last_year = models.PositiveIntegerField(default=0)
    review_date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"Rating {self.performance_rating} for {self.employee}"


class SatisfactionSurvey(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="satisfaction_surveys")
    job_satisfaction = models.PositiveIntegerField(default=3)
    environment_satisfaction = models.PositiveIntegerField(default=3)
    relationship_satisfaction = models.PositiveIntegerField(default=3)
    work_life_balance = models.PositiveIntegerField(default=3)
    survey_date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"Survey - {self.employee}"


# --- Congés & Absences ---

class LeaveRequest(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="leave_requests")

    leave_type = models.CharField(
        max_length=20,
        choices=[
            ('ANNUAL', 'Annual'),
            ('SICK', 'Sick'),
            ('RTT', 'RTT'),
            ('UNPAID', 'Unpaid'),
            ('REMOTE', 'Remote'),
        ]
    )

    start_date = models.DateField()
    end_date = models.DateField()
    days_requested = models.PositiveIntegerField()
    reason = models.TextField(blank=True)

    status = models.CharField(
        max_length=20,
        choices=[
            ('PENDING', 'Pending'),
            ('APPROVED', 'Approved'),
            ('REJECTED', 'Rejected'),
        ],
        default='PENDING'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.leave_type} - {self.employee}"


# --- Documents Employés ---

class EmployeeDocument(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="documents")
    document_type = models.CharField(max_length=50)
    file_path = models.CharField(max_length=255)
    uploaded_at = models.DateField(auto_now_add=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.document_type} - {self.employee}"


# --- Recrutement ---

class JobOffer(models.Model):
    title = models.CharField(max_length=100)
    department = models.ForeignKey(Department, on_delete=models.PROTECT)
    contract_type = models.CharField(max_length=20)
    salary_proposed = models.PositiveIntegerField(null=True, blank=True)
    application_deadline = models.DateField()
    is_internal = models.BooleanField(default=False)

    def __str__(self):
        return self.title


class JobApplication(models.Model):
    job_offer = models.ForeignKey(JobOffer, on_delete=models.CASCADE, related_name="applications")
    firstname = models.CharField(max_length=50)
    lastname = models.CharField(max_length=50)
    email = models.EmailField()
    cv_path = models.CharField(max_length=255)

    status = models.CharField(
        max_length=20,
        choices=[
            ('RECEIVED', 'Received'),
            ('IN_PROGRESS', 'In progress'),
            ('INTERVIEW', 'Interview'),
            ('REJECTED', 'Rejected'),
            ('HIRED', 'Hired'),
        ],
        default='RECEIVED'
    )

    def __str__(self):
        return f"{self.firstname} {self.lastname} - {self.job_offer}"
