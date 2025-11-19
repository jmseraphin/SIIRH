# Import rehetra avy ao amin'ny models.py fotsiny
from .models import (
    Candidature,
    Employee,
    Paie,
    Contrat,
    Utilisateur,
    Convocation
)

# Lisitry ny exports raha manao from app.models import *
__all__ = [
    "Candidature",
    "Employee",
    "Paie",
    "Contrat",
    "Utilisateur",
    "Convocation"
]
