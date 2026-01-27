import random
from datetime import timedelta
from django.utils.timezone import now
from django.core.management.base import BaseCommand

from hr.models import (
    Employee,
    ExitEvent,
    PerformanceReview,
    SatisfactionSurvey
)

class Command(BaseCommand):
    help = "Populate HR analytics data (exit events, performance reviews, satisfaction surveys)"

    def handle(self, *args, **kwargs):
        EXIT_PROBABILITY = 0.15
        MAX_PERFORMANCE_REVIEWS = 3
        MAX_SATISFACTION_SURVEYS = 2

        EXIT_REASONS = [
            "Career Change",
            "Better Offer",
            "Personal Reasons",
            "Retirement",
        ]

        employees = list(Employee.objects.all())

        if not employees:
            self.stdout.write(self.style.ERROR("No employees found."))
            return

        created_exits = 0
        created_reviews = 0
        created_surveys = 0

        # Exit events
        for emp in employees:
            if random.random() < EXIT_PROBABILITY:
                if not hasattr(emp, "exit_info"):
                    exit_date = now().date() - timedelta(days=random.randint(30, 900))
                    ExitEvent.objects.create(
                        employee=emp,
                        exit_date=exit_date,
                        reason=random.choice(EXIT_REASONS),
                    )
                    emp.status = "EXITED"
                    emp.save(update_fields=["status"])
                    created_exits += 1

        # Performance reviews
        for emp in employees:
            for i in range(random.randint(1, MAX_PERFORMANCE_REVIEWS)):
                review_date = now().date() - timedelta(days=365 * (i + 1))
                PerformanceReview.objects.create(
                    employee=emp,
                    performance_rating=random.randint(2, 5),
                    percent_salary_hike=random.choice([0, 5, 10, 15]),
                    training_times_last_year=random.randint(0, 5),
                    review_date=review_date,
                )
                created_reviews += 1

        # Satisfaction surveys
        for emp in employees:
            for i in range(random.randint(1, MAX_SATISFACTION_SURVEYS)):
                survey_date = now().date() - timedelta(days=180 * (i + 1))
                SatisfactionSurvey.objects.create(
                    employee=emp,
                    job_satisfaction=random.randint(2, 5),
                    environment_satisfaction=random.randint(2, 5),
                    relationship_satisfaction=random.randint(2, 5),
                    work_life_balance=random.randint(2, 5),
                    survey_date=survey_date,
                )
                created_surveys += 1

        self.stdout.write(self.style.SUCCESS(
            f"Done. ExitEvents: {created_exits}, "
            f"PerformanceReviews: {created_reviews}, "
            f"SatisfactionSurveys: {created_surveys}"
        ))
