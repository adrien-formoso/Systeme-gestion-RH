import csv, os, random
from datetime import date, timedelta
from django.core.management.base import BaseCommand
from django.conf import settings
from hr.models import Employee, Department, JobRole, JobAssignment, Contract, SatisfactionSurvey

class Command(BaseCommand):
    help = 'Importe le CSV et génère les données aléatoires (Contrats, Managers)'

    def handle(self, *args, **kwargs):
        csv_path = os.path.join(settings.BASE_DIR, '..', 'data', 'HR-Employee-Attrition.csv')
        
        # 1. Importation CSV
        with open(csv_path, mode='r', encoding='utf-8-sig') as file:
            reader = csv.DictReader(file)
            for row in reader:
                dept, _ = Department.objects.get_or_create(name=row['Department'])
                role, _ = JobRole.objects.get_or_create(name=row['JobRole'])

                # Calcul date embauche théorique
                years = int(row['YearsAtCompany'])
                h_date = date.today() - timedelta(days=(years * 365 + random.randint(0, 364)))

                emp, _ = Employee.objects.update_or_create(
                    employee_number=row['EmployeeNumber'],
                    defaults={
                        'age': row['Age'], 'gender': row['Gender'], 'attrition': row['Attrition'],
                        'marital_status': row['MaritalStatus'], 'hire_date': h_date,
                        'distance_from_home': row['DistanceFromHome'], 'education_field': row['EducationField']
                    }
                )

                JobAssignment.objects.update_or_create(
                    employee=emp,
                    defaults={
                        'department': dept, 'job_role': role, 'job_level': row['JobLevel'],
                        'monthly_income': row['MonthlyIncome'], 'overtime': row['OverTime'],
                        'years_at_company': years, 'years_since_last_promotion': row['YearsSinceLastPromotion']
                    }
                )

        # 2. Enrichissement Aléatoire (Managers et Contrats)
        all_emps = list(Employee.objects.all())
        managers = [e for e in all_emps if e.assignment.job_level >= 4]

        for e in all_emps:
            # Assigner un manager (si ce n'est pas lui-même)
            if e.assignment.job_level < 4:
                e.manager = random.choice(managers)
                e.save()
            
            # Créer un contrat aléatoire
            c_type = random.choices(["CDI", "CDD", "INTERNSHIP"], weights=[85, 10, 5])[0]
            Contract.objects.get_or_create(
                employee=e,
                defaults={'contract_type': c_type, 'start_date': e.hire_date, 'weekly_hours': 35}
            )

        self.stdout.write(self.style.SUCCESS("Base de données initialisée et enrichie !"))