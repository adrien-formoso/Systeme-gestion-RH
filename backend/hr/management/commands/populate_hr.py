import csv, os, random
from datetime import date, timedelta
from decimal import Decimal
from faker import Faker
from django.core.management.base import BaseCommand
from django.conf import settings
from django.contrib.auth.models import User
from hr.models import (
    Employee, Department, JobRole, JobAssignment, 
    Contract, Payroll, SatisfactionSurvey, PerformanceReview,
    LeaveRequest, ContractType, EmployeeStatus, LeaveType, LeaveStatus
)

class Command(BaseCommand):
    help = 'Population complète de la base RH avec données cohérentes et historiques'

    def handle(self, *args, **kwargs):
        fake = Faker('fr_FR')
        csv_path = os.path.join(settings.BASE_DIR, '..', 'data', 'HR-Employee-Attrition.csv')
        
        self.stdout.write("🚀 Nettoyage et démarrage de la génération totale...")

        all_emps = []

        with open(csv_path, mode='r', encoding='utf-8-sig') as file:
            reader = csv.DictReader(file)
            for row in reader:
                # 1. Services et Rôles
                dept, _ = Department.objects.get_or_create(name=row['Department'])
                role, _ = JobRole.objects.get_or_create(
                    name=row['JobRole'],
                    defaults={'level': random.randint(1, 5)}
                )

                # 2. Identité
                gender = row['Gender']
                fname = fake.first_name_male() if gender == 'Male' else fake.first_name_female()
                lname = fake.last_name()
                
                years_co = int(row['YearsAtCompany'])
                h_date = date.today() - timedelta(days=(years_co * 365 + random.randint(0, 364)))
                b_date = h_date - timedelta(days=(random.randint(20, 45) * 365))

                # 3. Employé
                salary = float(row['MonthlyIncome'])
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
                        'salary_brut': salary,
                        'status': EmployeeStatus.ACTIVE if row['Attrition'] == 'No' else EmployeeStatus.EXITED,
                        'distance_from_home': int(row['DistanceFromHome']),
                        'leave_balance': random.randint(5, 25)
                    }
                )

                # 4. Job Assignment & Contrat
                JobAssignment.objects.update_or_create(
                    employee=emp,
                    defaults={
                        'department': dept,
                        'job_role': role,
                        'monthly_income': salary,
                        'start_date': h_date,
                    }
                )
                
                c_type = random.choices(
                    [ContractType.CDI, ContractType.CDD, ContractType.APPRENTICESHIP, ContractType.INTERNSHIP], 
                    weights=[80, 10, 5, 5]
                )[0]
                Contract.objects.update_or_create(
                    employee=emp,
                    defaults={'contract_type': c_type, 'start_date': h_date, 'is_active': emp.status == EmployeeStatus.ACTIVE}
                )

                # 5. HISTORIQUE : Paies (3 derniers mois)
                for m, y in [(11, 2025), (12, 2025), (1, 2026)]:
                    bonus = Decimal(random.randint(0, 500)) if random.random() > 0.7 else 0
                    Payroll.objects.get_or_create(
                        employee=emp, month=m, year=y,
                        defaults={
                            'gross_salary': salary,
                            'total_bonuses': bonus,
                            'total_deductions': Decimal(salary * 0.22), # Cotisations
                            'net_salary': Decimal((salary + float(bonus)) * 0.78)
                        }
                    )

                # 6. PERFORMANCE & SATISFACTION (Données pour tes graphiques)
                SatisfactionSurvey.objects.get_or_create(
                    employee=emp, survey_date=date.today(),
                    defaults={
                        'job_satisfaction': random.randint(1, 5),
                        'environment_satisfaction': random.randint(1, 5),
                        'relationship_satisfaction': random.randint(1, 5),
                        'work_life_balance': random.randint(1, 5),
                    }
                )

                PerformanceReview.objects.get_or_create(
                    employee=emp, review_date=h_date + timedelta(days=365),
                    defaults={
                        'performance_rating': random.randint(1, 4),
                        'percent_salary_hike': random.randint(0, 15),
                        'training_times_last_year': random.randint(0, 6)
                    }
                )

                all_emps.append(emp)

        # --- HIÉRARCHIE (Organigramme) ---
        self.stdout.write("🌳 Structuration de la hiérarchie...")
        ceo = sorted(all_emps, key=lambda x: x.hire_date)[0]
        ceo.manager = None
        ceo.save()

        for dept in Department.objects.all():
            dept_emps = [e for e in all_emps if e.job_assignments.filter(department=dept).exists() and e.id != ceo.id]
            if not dept_emps: continue
            dept_emps.sort(key=lambda x: x.salary_brut, reverse=True)
            
            dept_head = dept_emps[0]
            dept_head.manager = ceo
            dept_head.save()

            for i in range(1, len(dept_emps)):
                dept_emps[i].manager = random.choice(dept_emps[:i])
                dept_emps[i].save()

        self.stdout.write(self.style.SUCCESS(f"✨ Succès ! Base HR complète avec Paies, Avis et Satisfaction."))