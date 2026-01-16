import random
from datetime import date, timedelta
from django.core.management.base import BaseCommand
from hr.models import Employee, JobAssignment, Contract, ExitEvent, PerformanceReview, SatisfactionSurvey

class Command(BaseCommand):
    help = 'Remplit les données manquantes de manière aléatoire'

    def handle(self, *args, **kwargs):
        employees = list(Employee.objects.all())
        # 1. Définir des managers potentiels (ceux avec un haut niveau de poste)
        potential_managers = [e for e in employees if e.assignment.job_level >= 4]

        for emp in employees:
            # --- A. Assigner un Manager ---
            if emp not in potential_managers:
                emp.manager = random.choice(potential_managers)
            
            # --- B. Calculer la date d'embauche ---
            years_at_co = emp.assignment.years_at_company
            emp.hire_date = date.today() - timedelta(days=(years_at_co * 365 + random.randint(0, 364)))
            emp.save()

            # --- C. Créer un Contrat ---
            c_type = random.choices(['CDI', 'CDD', 'STAGE'], weights=[80, 15, 5])[0]
            Contract.objects.get_or_create(
                employee=emp,
                defaults={'contract_type': c_type, 'start_date': emp.hire_date}
            )

            # --- D. Gérer les départs (Attrition) ---
            if emp.attrition == 'Yes':
                ExitEvent.objects.get_or_create(
                    employee=emp,
                    defaults={
                        'exit_date': date.today() - timedelta(days=random.randint(1, 30)),
                        'reason': random.choice(['Career Change', 'Better Offer', 'Retirement'])
                    }
                )

        self.stdout.write(self.style.SUCCESS(f"Base de données enrichie avec succès !"))