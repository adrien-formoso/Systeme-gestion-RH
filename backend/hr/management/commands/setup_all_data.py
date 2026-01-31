import csv, os, random
from datetime import date, timedelta
from faker import Faker
from django.core.management.base import BaseCommand
from django.conf import settings
from hr.models import (
    Employee, Department, JobRole, JobAssignment, 
    Contract, Payroll, SatisfactionSurvey
)

class Command(BaseCommand):
    help = 'Importation complète et génération de données réalistes'

    def handle(self, *args, **kwargs):
        fake = Faker('fr_FR')
        csv_path = os.path.join(settings.BASE_DIR, '..', 'data', 'HR-Employee-Attrition.csv')
        
        self.stdout.write("🚀 Lancement de la génération globale...")

        with open(csv_path, mode='r', encoding='utf-8-sig') as file:
            reader = csv.DictReader(file)
            for row in reader:
                # 1. Références
                dept, _ = Department.objects.get_or_create(name=row['Department'])
                role, _ = JobRole.objects.get_or_create(name=row['JobRole'])

                # 2. Identité réaliste
                gender = row['Gender']
                fname = fake.first_name_male() if gender == 'Male' else fake.first_name_female()
                lname = fake.last_name()
                
                # 3. Calculs de dates
                years_co = int(row['YearsAtCompany'])
                h_date = date.today() - timedelta(days=(years_co * 365 + random.randint(0, 364)))
                b_date = h_date - timedelta(days=(random.randint(20, 45) * 365)) # Age réaliste

                # 4. Création Employé
                emp, _ = Employee.objects.update_or_create(
                    employee_number=row['EmployeeNumber'],
                    defaults={
                        'firstname': fname,
                        'lastname': lname,
                        'email': f"{fname.lower()}.{lname.lower()}@entreprise.com",
                        'gender': gender,
                        'marital_status': row['MaritalStatus'],
                        'hire_date': h_date,
                        'birth_date': b_date,
                        'nationality': 'Française',
                        'salary_brut': int(row['MonthlyIncome']),
                        'status': 'ACTIVE' if row['Attrition'] == 'No' else 'EXITED'
                    }
                )

                # 5. Poste et Contrat
                JobAssignment.objects.update_or_create(
                    employee=emp,
                    defaults={
                        'department': dept,
                        'job_role': role,
                        'monthly_income': int(row['MonthlyIncome']),
                        'start_date': h_date,
                    }
                )
                
                Contract.objects.get_or_create(
                    employee=emp,
                    defaults={'contract_type': 'CDI', 'start_date': h_date}
                )

                # 6. Générer 3 mois de Paie
                for m, y in [(11, 2025), (12, 2025), (1, 2026)]:
                    Payroll.objects.get_or_create(
                        employee=emp, month=m, year=y,
                        defaults={
                            'gross_salary': emp.salary_brut,
                            'net_salary': int(emp.salary_brut * 0.75),
                            'total_bonuses': 0, 'total_deductions': 0
                        }
                    )

        self.stdout.write(self.style.SUCCESS("✨ Tout est prêt ! Base de données peuplée et propre."))