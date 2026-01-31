from django.db import models
from django.contrib.auth.models import User

# --- ENUMS (Choices) ---

class ContractType(models.TextChoices):
    CDI = 'CDI', 'CDI'
    CDD = 'CDD', 'CDD'
    INTERNSHIP = 'INTERNSHIP', 'Stage'
    APPRENTICESHIP = 'APPRENTICESHIP', 'Apprentissage'

class LeaveType(models.TextChoices):
    ANNUAL = 'ANNUAL', 'Congés Annuels'
    SICK = 'SICK', 'Maladie'
    MATERNITY = 'MATERNITY', 'Maternité'
    UNPAID = 'UNPAID', 'Sans Solde'
    RTT = 'RTT', 'RTT'
    REMOTE = 'REMOTE', 'Télétravail'

class LeaveStatus(models.TextChoices):
    PENDING = 'PENDING', 'En attente'
    APPROVED = 'APPROVED', 'Approuvé'
    REJECTED = 'REJECTED', 'Refusé'

class ApplicationStatus(models.TextChoices):
    RECEIVED = 'RECEIVED', 'Reçu'
    IN_PROGRESS = 'IN_PROGRESS', 'En cours'
    INTERVIEW = 'INTERVIEW', 'Entretien'
    REJECTED = 'REJECTED', 'Refusé'
    HIRED = 'HIRED', 'Engagé'

class EmployeeStatus(models.TextChoices):
    ACTIVE = 'ACTIVE', 'Actif'
    ON_LEAVE = 'ON_LEAVE', 'En congé'
    EXITED = 'EXITED', 'Parti'

# --- CORE HR ---

class Department(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name

class JobRole(models.Model):
    name = models.CharField(max_length=100)
    level = models.IntegerField(default=1)
    salary_min = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    salary_max = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return f"{self.name} (Lvl {self.level})"

class Employee(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    employee_number = models.IntegerField(unique=True)
    firstname = models.CharField(max_length=100)
    lastname = models.CharField(max_length=100)
    gender = models.CharField(max_length=10)
    birth_date = models.DateField(null=True, blank=True)
    nationality = models.CharField(max_length=100, null=True, blank=True)
    marital_status = models.CharField(max_length=50, null=True, blank=True)
    social_security_number = models.CharField(max_length=50, null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    email = models.EmailField()
    address = models.TextField(null=True, blank=True)
    distance_from_home = models.IntegerField(default=0)
    hire_date = models.DateField()
    salary_brut = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    leave_balance = models.IntegerField(default=25)
    status = models.CharField(max_length=20, choices=EmployeeStatus.choices, default=EmployeeStatus.ACTIVE)
    manager = models.ForeignKey("self", on_delete=models.SET_NULL, null=True, blank=True, related_name="subordinates")

    def __str__(self):
        return f"{self.firstname} {self.lastname} ({self.employee_number})"

class Contract(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="contracts")
    contract_type = models.CharField(max_length=20, choices=ContractType.choices)
    weekly_hours = models.IntegerField(default=35)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

class JobAssignment(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="job_assignments")
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    job_role = models.ForeignKey(JobRole, on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    monthly_income = models.DecimalField(max_digits=10, decimal_places=2)
    business_travel = models.CharField(max_length=100, null=True, blank=True)
    overtime = models.BooleanField(default=False)

# --- HISTORY & PERFORMANCE ---

class JobHistory(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="job_histories")
    job_role = models.ForeignKey(JobRole, on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    salary = models.DecimalField(max_digits=10, decimal_places=2)

class PerformanceReview(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="performance_reviews")
    review_date = models.DateField()
    performance_rating = models.IntegerField()
    percent_salary_hike = models.IntegerField(default=0)
    training_times_last_year = models.IntegerField(default=0)
    comments = models.TextField(null=True, blank=True)

class SatisfactionSurvey(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="satisfaction_surveys")
    survey_date = models.DateField()
    job_satisfaction = models.IntegerField()
    environment_satisfaction = models.IntegerField()
    relationship_satisfaction = models.IntegerField()
    work_life_balance = models.IntegerField()

# --- LEAVES & ABSENCES ---

class LeaveRequest(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="leave_requests")
    leave_type = models.CharField(max_length=20, choices=LeaveType.choices)
    start_date = models.DateField()
    end_date = models.DateField()
    days_requested = models.IntegerField()
    reason = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=LeaveStatus.choices, default=LeaveStatus.PENDING)
    attachment_path = models.CharField(max_length=255, null=True, blank=True)

# --- RECRUITMENT ---

class JobOffer(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    contract_type = models.CharField(max_length=20, choices=ContractType.choices)
    salary_proposed = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    experience_level = models.CharField(max_length=100, null=True, blank=True)
    application_deadline = models.DateField()
    is_internal = models.BooleanField(default=False)

class JobApplication(models.Model):
    job_offer = models.ForeignKey(JobOffer, on_delete=models.CASCADE, related_name="applications")
    firstname = models.CharField(max_length=100)
    lastname = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20, null=True, blank=True)
    cv_path = models.CharField(max_length=255)
    cover_letter_path = models.CharField(max_length=255, null=True, blank=True)
    application_date = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=ApplicationStatus.choices, default=ApplicationStatus.RECEIVED)
    notes_hr = models.TextField(null=True, blank=True)

# --- PAYROLL ---

class Payroll(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="payrolls")
    month = models.IntegerField()
    year = models.IntegerField()
    gross_salary = models.DecimalField(max_digits=10, decimal_places=2)
    total_bonuses = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_deductions = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    net_salary = models.DecimalField(max_digits=10, decimal_places=2)
    generated_date = models.DateField(auto_now_add=True)

# --- TRAINING ---

class Training(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField()
    cost = models.DecimalField(max_digits=10, decimal_places=2)
    employees = models.ManyToManyField(Employee, through='EmployeeTraining', related_name='trainings')

class EmployeeTraining(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    training = models.ForeignKey(Training, on_delete=models.CASCADE)
    status = models.CharField(max_length=50) # Ex: Inscribed, Completed, Failed
    registration_date = models.DateField()

# --- DOCUMENTS ---

class EmployeeDocument(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="documents")
    document_type = models.CharField(max_length=100)
    file_path = models.CharField(max_length=255)
    upload_date = models.DateField(auto_now_add=True)
    description = models.TextField(null=True, blank=True)

# --- EXIT & LOGGING ---

class ExitEvent(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="exit_events")
    exit_date = models.DateField()
    reason = models.TextField()

class AuditLog(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True)
    action = models.CharField(max_length=255)
    action_date = models.DateTimeField(auto_now_add=True)
    target_table = models.CharField(max_length=100)
    target_id = models.BigIntegerField()
    details = models.TextField()