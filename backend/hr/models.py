from django.db import models


class Employee(models.Model):
    employee_number = models.IntegerField(unique=True)
    age = models.PositiveIntegerField(null=True, blank=True)
    gender = models.CharField(max_length=10, default='Unknown')
    marital_status = models.CharField(max_length=20, default='Unknown')
    education_field = models.CharField(max_length=100, null=True, blank=True)
    distance_from_home = models.PositiveIntegerField()
    attrition = models.CharField(max_length=5, default='No')

    # Relation hiérarchique
    manager = models.ForeignKey(
        "self",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="subordinates"
    )

    def __str__(self):
        return f"Emp {self.employee_number} ({self.gender})"

class Contract(models.Model):
    CONTRACT_TYPES = [
        ("CDI", "Permanent"),
        ("CDD", "Fixed-term"),
        ("INTERNSHIP", "Internship"),
        ("APPRENTICESHIP", "Apprenticeship"),
    ]

    employee = models.ForeignKey(
        Employee,
        on_delete=models.CASCADE,
        related_name="contracts"
    )

    contract_type = models.CharField(max_length=20, choices=CONTRACT_TYPES)
    weekly_hours = models.PositiveIntegerField()
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.contract_type} - {self.employee}"



class Department(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self): return self.name


class JobRole(models.Model):
    name = models.CharField(max_length=100, unique=True)
    
    def __str__(self): return self.name


class JobAssignment(models.Model):
    employee = models.OneToOneField(
        Employee, 
        on_delete=models.CASCADE, 
        related_name="assignment")
    
    department = models.ForeignKey(Department, on_delete=models.PROTECT)
    job_role = models.ForeignKey(JobRole, on_delete=models.PROTECT)
    
    job_level = models.PositiveIntegerField(default=1)
    monthly_income = models.PositiveIntegerField(default=0)
    business_travel = models.CharField(max_length=50, default='Non-Travel')
    overtime = models.CharField(max_length=5, default='No')
    
    years_at_company = models.PositiveIntegerField(default=0)
    years_since_last_promotion = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.employee} - {self.job_role}"


class PerformanceReview(models.Model):
    employee = models.ForeignKey(
        Employee, 
        on_delete=models.CASCADE, 
        related_name="performance_reviews")
    
    performance_rating = models.PositiveIntegerField(default=3)
    percent_salary_hike = models.PositiveIntegerField(default=0)
    training_times_last_year = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"Rating {self.performance_rating} for {self.employee}"


class SatisfactionSurvey(models.Model):
    employee = models.ForeignKey(
        Employee, 
        on_delete=models.CASCADE, 
        related_name="satisfaction_surveys")
    
    job_satisfaction = models.PositiveIntegerField(default=3)
    environment_satisfaction = models.PositiveIntegerField(default=3)
    relationship_satisfaction = models.PositiveIntegerField(default=3)
    work_life_balance = models.PositiveIntegerField(default=3)

    def __str__(self):
        return f"Survey - {self.employee}"