from django.db import models


class Employee(models.Model):
    employee_number = models.IntegerField(unique=True)

    gender = models.CharField(max_length=10)
    birth_date = models.DateField()
    marital_status = models.CharField(max_length=20)
    distance_from_home = models.PositiveIntegerField()

    # Hierarchical relationship (manager is also an employee)
    manager = models.ForeignKey(
        "self",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="subordinates"
    )

    def __str__(self):
        return f"Employee {self.employee_number}"


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

    def __str__(self):
        return self.name


class JobRole(models.Model):
    name = models.CharField(max_length=100)
    level = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.name} (Level {self.level})"


class JobAssignment(models.Model):
    employee = models.ForeignKey(
        Employee,
        on_delete=models.CASCADE,
        related_name="job_assignments"
    )

    department = models.ForeignKey(
        Department,
        on_delete=models.SET_NULL,
        null=True,
        related_name="job_assignments"
    )

    job_role = models.ForeignKey(
        JobRole,
        on_delete=models.SET_NULL,
        null=True,
        related_name="job_assignments"
    )

    monthly_income = models.PositiveIntegerField()
    business_travel = models.CharField(max_length=30)
    overtime = models.BooleanField()

    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.employee} - {self.job_role}"


class PerformanceReview(models.Model):
    employee = models.ForeignKey(
        Employee,
        on_delete=models.CASCADE,
        related_name="performance_reviews"
    )

    review_date = models.DateField()
    performance_rating = models.PositiveIntegerField()
    percent_salary_hike = models.PositiveIntegerField()
    training_times_last_year = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.employee} - Review {self.review_date}"


class SatisfactionSurvey(models.Model):
    employee = models.ForeignKey(
        Employee,
        on_delete=models.CASCADE,
        related_name="satisfaction_surveys"
    )

    survey_date = models.DateField()
    job_satisfaction = models.PositiveIntegerField()
    environment_satisfaction = models.PositiveIntegerField()
    relationship_satisfaction = models.PositiveIntegerField()
    work_life_balance = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.employee} - Survey {self.survey_date}"


class ExitEvent(models.Model):
    employee = models.OneToOneField(
        Employee,
        on_delete=models.CASCADE,
        related_name="exit_event"
    )

    exit_date = models.DateField()
    reason = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.employee} - Exit"
