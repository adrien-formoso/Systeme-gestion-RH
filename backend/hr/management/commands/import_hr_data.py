import csv
import os
from django.core.management.base import BaseCommand
from django.conf import settings
from hr.models import Employee, Department, JobRole, JobAssignment, SatisfactionSurvey

class Command(BaseCommand):
    help = 'Importe les données RH depuis le CSV vers les tables normalisées'

    def handle(self, *args, **kwargs):
        # Chemin vers le CSV basé sur ton image
        csv_path = os.path.join(settings.BASE_DIR, '..', 'data', 'HR-Employee-Attrition.csv')
        
        if not os.path.exists(csv_path):
            self.stdout.write(self.style.ERROR(f"Fichier introuvable : {csv_path}"))
            return

        with open(csv_path, mode='r', encoding='utf-8-sig') as file:
            reader = csv.DictReader(file)
            count = 0
            for row in reader:
                # 1. Récupérer ou créer les références
                dept, _ = Department.objects.get_or_create(name=row['Department'])
                role, _ = JobRole.objects.get_or_create(name=row['JobRole'])

                # 2. Créer l'employé (ou le mettre à jour)
                emp, created = Employee.objects.update_or_create(
                    employee_number=row['EmployeeNumber'],
                    defaults={
                        'age': row['Age'],
                        'gender': row['Gender'],
                        'marital_status': row['MaritalStatus'],
                        'distance_from_home': row['DistanceFromHome'],
                        'education_field': row['EducationField'],
                        'attrition': row['Attrition'],
                    }
                )

                # 3. Créer l'assignation de poste (OneToOne)
                JobAssignment.objects.update_or_create(
                    employee=emp,
                    defaults={
                        'department': dept,
                        'job_role': role,
                        'job_level': row['JobLevel'],
                        'monthly_income': row['MonthlyIncome'],
                        'business_travel': row['BusinessTravel'],
                        'overtime': row['OverTime'],
                        'years_at_company': row['YearsAtCompany'],
                        'years_since_last_promotion': row['YearsSinceLastPromotion'],
                    }
                )

                # 4. Créer la satisfaction
                SatisfactionSurvey.objects.update_or_create(
                    employee=emp,
                    defaults={
                        'job_satisfaction': row['JobSatisfaction'],
                        'environment_satisfaction': row['EnvironmentSatisfaction'],
                        'relationship_satisfaction': row['RelationshipSatisfaction'],
                        'work_life_balance': row['WorkLifeBalance'],
                    }
                )
                count += 1

        self.stdout.write(self.style.SUCCESS(f"Succès : {count} employés synchronisés."))