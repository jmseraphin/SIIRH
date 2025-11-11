# # app/models/__init__.py

# from .employee import Employee
# from .contrat import Contrat
# from .paie import Paie
# from .utilisateur import Utilisateur
# from .offre import Offre
# from .candidature import Candidature
# from .convocation import Convocation

# __all__ = [
#     "Employee",
#     "Contrat",
#     "Paie",
#     "Utilisateur",
#     "Offre",
#     "Candidature",
#     "Convocation",
# ]











# from .contrat import Contrat
# from .paie import Paie
# from .utilisateur import Utilisateur
# from .models import Offre, Candidature
# from .convocation import Convocation

# __all__ = [
#     "Employee",
#     "Contrat",
#     "Paie",
#     "Utilisateur",
#     "Offre",
#     "Candidature",
#     "Convocation",
# ]








# backend/app/models/__init__.py

# Import rehetra avy ao amin'ny models.py fotsiny
from .models import (
    Offre,
    Candidature,
    Employee,
    Paie,
    Contrat,
    Utilisateur,
    Convocation
)

# Lisitry ny exports raha manao from app.models import *
__all__ = [
    "Offre",
    "Candidature",
    "Employee",
    "Paie",
    "Contrat",
    "Utilisateur",
    "Convocation"
]
