# Structure des Données - Projet Cancer du Sein

Ce document décrit la structure exacte des champs de données utilisés dans l'application.

## Champs de Données

### 1. Informations Personnelles

| Champ | Type | Description | Valeurs possibles |
|-------|------|-------------|-------------------|
| `age` | Numérique | Âge de la femme | 18-120 |
| `imc` | Numérique | Indice de masse corporelle | 10-60 (calculé ou saisi) |

### 2. Antécédents

| Champ | Type | Description | Valeurs possibles |
|-------|------|-------------|-------------------|
| `ant_familiaux` | Booléen | Antécédents familiaux de cancer du sein | 0 = Non, 1 = Oui |
| `ant_personnels` | Booléen | Antécédents personnels de pathologies mammaires | 0 = Non, 1 = Oui |

### 3. Historique Reproductif

| Champ | Type | Description | Valeurs possibles |
|-------|------|-------------|-------------------|
| `age_premieres_regles` | Numérique | Âge des premières menstruations | 8-20 |
| `age_premier_enfant` | Numérique | Âge à la naissance du premier enfant | 0-60 (0 si aucun enfant) |
| `nb_enfants` | Numérique | Nombre total d'enfants | 0-20 |

### 4. Mode de Vie

| Champ | Type | Description | Valeurs possibles |
|-------|------|-------------|-------------------|
| `mode_vie` | Catégoriel | Mode de vie général | "sain" / "modéré" / "à risque" |
| `tabac` | Booléen | Fume ou non | 0 = Non, 1 = Oui |
| `alcool` | Booléen | Consomme régulièrement de l'alcool ou non | 0 = Non, 1 = Oui |
| `activite_physique` | Catégoriel | Niveau d'activité physique | "faible" / "moyen" / "élevé" |

## Algorithme de Calcul du Score de Risque

Le score de risque est calculé selon les critères suivants :

### Facteurs Augmentant le Risque

1. **Âge** (0-20 points)
   - < 40 ans : +3 points
   - 40-49 ans : +8 points
   - 50-59 ans : +15 points
   - ≥ 60 ans : +20 points

2. **IMC** (0-10 points)
   - < 25 : +2 points
   - 25-29.9 : +5 points
   - ≥ 30 : +10 points

3. **Antécédents familiaux** (+15 points si oui)

4. **Antécédents personnels** (+15 points si oui)

5. **Âge premières règles** (+8 points si ≤ 11 ans)

6. **Âge premier enfant**
   - Nullipare (0 enfant) et âge ≥ 30 : +10 points
   - Premier enfant ≥ 35 ans : +7 points

7. **Mode de vie**
   - Sain : +2 points
   - Modéré : +6 points
   - À risque : +10 points

8. **Tabac** (+7 points si oui)

9. **Alcool** (+6 points si oui)

10. **Activité physique faible** (+5 points)

### Facteurs Protecteurs (réduisant le risque)

1. **Nombre d'enfants** (-3 points si ≥ 3 enfants)

2. **Activité physique élevée** (-5 points)

## Interprétation du Score

- **Score < 30** : Risque Faible
- **30 ≤ Score < 50** : Risque Modéré
- **Score ≥ 50** : Risque Élevé

## Fichiers Modifiés

- **src/views/Diagnostic.vue** : Formulaire complet d'évaluation diagnostique
- **src/views/Analyse.vue** : Formulaire de risque avant analyse de mammographie

## Utilisation pour l'API/Backend

Lorsque vous enverrez ces données à votre API backend ou modèle d'IA, utilisez exactement ces noms de champs et ces valeurs :

```javascript
// Exemple de données à envoyer
{
  "age": 45,
  "imc": 24.5,
  "ant_familiaux": 1,
  "ant_personnels": 0,
  "age_premieres_regles": 12,
  "age_premier_enfant": 28,
  "nb_enfants": 2,
  "mode_vie": "sain",
  "tabac": 0,
  "alcool": 0,
  "activite_physique": "moyen"
}
```

## Notes Importantes

1. Les valeurs booléennes sont représentées par **0** ou **1** (pas `true`/`false`)
2. Les valeurs catégorielles sont des chaînes de caractères en français
3. Le calcul de l'IMC peut être fait côté frontend : `IMC = poids (kg) / (taille (m))²`
4. Le score de risque est automatiquement calculé et peut être inclus dans les données envoyées au backend
