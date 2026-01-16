import csv, os, random
from datetime import date, timedelta
from faker import Faker # Import de Faker
from django.core.management.base import BaseCommand
from django.conf import settings
from hr.models import Employee, Department, JobRole, JobAssignment, Contract

class Command(BaseCommand):
    help = 'Importe le CSV et génère des noms/données aléatoires'

    def handle(self, *args, **kwargs):
        fake = Faker('fr_FR') # Utilisation de noms à consonance française
        csv_path = os.path.join(settings.BASE_DIR, '..', 'data', 'HR-Employee-Attrition.csv')
        
        self.stdout.write("Début de l'importation...")

        with open(csv_path, mode='r', encoding='utf-8-sig') as file:
            reader = csv.DictReader(file)
            for row in reader:
                dept, _ = Department.objects.get_or_create(name=row['Department'])
                role, _ = JobRole.objects.get_or_create(name=row['JobRole'])

                # --- Génération du nom selon le genre ---
                gender = row['Gender'] # 'Male' ou 'Female'
                if gender == 'Male':
                    fname = fake.first_name_male()
                else:
                    fname = fake.first_name_female()
                
                lname = fake.last_name()

                # Calcul date embauche
                years = int(row['YearsAtCompany'])
                h_date = date.today() - timedelta(days=(years * 365 + random.randint(0, 364)))

                # --- Création / Mise à jour de l'employé ---
                emp, _ = Employee.objects.update_or_create(
                    employee_number=row['EmployeeNumber'],
                    defaults={
                        'firstname': fname,
                        'lastname': lname,
                        'age': row['Age'],
                        'gender': gender,
                        'attrition': row['Attrition'],
                        'marital_status': row['MaritalStatus'],
                        'hire_date': h_date,
                        'distance_from_home': row['DistanceFromHome'],
                        'education_field': row['EducationField']
                    }
                )

                JobAssignment.objects.update_or_create(
                    employee=emp,
                    defaults={
                        'department': dept,
                        'job_role': role,
                        'job_level': row['JobLevel'],
                        'monthly_income': row['MonthlyIncome'],
                        'overtime': row['OverTime'],
                        'years_at_company': years,
                        'years_since_last_promotion': row['YearsSinceLastPromotion']
                    }
                )

        self.stdout.write(self.style.SUCCESS("Importation et génération des noms terminée !"))