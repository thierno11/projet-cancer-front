# Structure des Données - Diagnostic Médical

Ce document décrit la structure complète des champs pour le diagnostic médical professionnel.

## Vue d'ensemble

Le diagnostic médical comprend **24 champs** répartis en 7 catégories :
1. Identification du patient (3 champs)
2. Antécédents médicaux (4 champs)
3. Historique reproductif (3 champs)
4. Résultats biologiques et moléculaires (3 champs)
5. Résultats d'imagerie (3 champs)
6. Mode de vie et facteurs de risque (3 champs)
7. Évaluation du risque et diagnostic (5 champs)

---

## 1. Identification du Patient

| Champ | Type | Description | Exemple | Validation |
|-------|------|-------------|---------|------------|
| `patient_id` | string/int | Identifiant unique du patient | P00125 | Required |
| `age` | int | Âge du patient en années | 52 | 18-100 |
| `imc` | float | Indice de masse corporelle (poids / taille²) | 26.5 | 10-60 |

---

## 2. Antécédents Médicaux

| Champ | Type | Description | Valeurs possibles |
|-------|------|-------------|-------------------|
| `antecedents_familiaux` | bool/string | Présence d'antécédents familiaux de cancer du sein | Oui / Non |
| `antecedents_personnels` | bool/string | Antécédents personnels de tumeurs bénignes ou autres cancers | Oui / Non |
| `nombre_biopsies` | int | Nombre total de biopsies effectuées sur la patiente | 0-20 |
| `mutation_genetique` | string | Mutation génétique identifiée | Aucune / BRCA1 / BRCA2 / TP53 / PALB2 / Autre |

---

## 3. Historique Reproductif

| Champ | Type | Description | Exemple | Validation |
|-------|------|-------------|---------|------------|
| `age_premieres_menstruations` | int | Âge lors des premières menstruations (ménarche) | 13 | 8-20 |
| `age_premier_enfant` | int | Âge de la patiente à la naissance de son premier enfant | 28 | 0-60 (0 si aucun enfant) |
| `nombre_enfants` | int | Nombre d'enfants biologiques | 3 | 0-20 |

---

## 4. Résultats Biologiques et Moléculaires

| Champ | Type | Description | Valeurs possibles |
|-------|------|-------------|-------------------|
| `statut_er` | string | Statut des récepteurs d'œstrogènes (ER = Estrogen Receptor) | Positif / Négatif / Inconnu |
| `statut_pr` | string | Statut des récepteurs de progestérone (PR = Progesterone Receptor) | Positif / Négatif / Inconnu |
| `expression_her2` | string | Expression du gène HER2 (Human Epidermal growth factor Receptor 2) | Positif / Négatif / Équivoque / Inconnu |

### Notes sur les récepteurs hormonaux

- **ER+ et PR+** : Cancer hormono-dépendant, bon pronostic avec hormonothérapie
- **HER2+** : Peut bénéficier de thérapies ciblées (Trastuzumab)
- **Triple négatif** (ER-, PR-, HER2-) : Pronostic moins favorable

---

## 5. Résultats d'Imagerie

| Champ | Type | Description | Valeurs possibles |
|-------|------|-------------|-------------------|
| `resultat_mammographie` | string/int | Résultat de la mammographie (classification BI-RADS) | BI-RADS 0 à BI-RADS 6 |
| `densite_mammaire` | string | Densité du tissu mammaire observée à la mammographie | A / B / C / D |
| `resultat_echographie` | string | Observation échographique du sein | Texte libre (description) |

### Classification BI-RADS

- **BI-RADS 0** : Incomplet - Examens complémentaires nécessaires
- **BI-RADS 1** : Négatif - Aucune anomalie
- **BI-RADS 2** : Bénin - Lésion bénigne identifiée
- **BI-RADS 3** : Probablement bénin - Surveillance recommandée (< 2% de malignité)
- **BI-RADS 4** : Suspect - Biopsie recommandée (2-95% de malignité)
- **BI-RADS 5** : Hautement suspect - Forte probabilité de cancer (> 95%)
- **BI-RADS 6** : Cancer prouvé par biopsie

### Densité mammaire

- **A** : Quasi entièrement graisseuse (< 25% dense)
- **B** : Densités fibroglandulaires dispersées (25-50% dense)
- **C** : Hétérogène dense (51-75% dense)
- **D** : Extrêmement dense (> 75% dense)

---

## 6. Mode de Vie et Facteurs de Risque

| Champ | Type | Description | Valeurs possibles |
|-------|------|-------------|-------------------|
| `tabagisme` | bool/string | Habitude tabagique actuelle ou passée | Non-fumeuse / Ancienne fumeuse / Fumeuse active |
| `consommation_alcool` | string | Niveau de consommation d'alcool | Aucune / Légère / Modérée / Élevée |
| `activite_physique` | string | Niveau d'activité physique hebdomadaire | Faible / Modérée / Élevée |

---

## 7. Évaluation du Risque et Diagnostic

| Champ | Type | Description | Exemple | Validation |
|-------|------|-------------|---------|------------|
| `risque_5_10_ans_pourcent` | float | Risque estimé (%) de développer un cancer du sein dans 5 à 10 ans | 12.3 | 0-100 |
| `categorie_risque` | string | Catégorie globale du risque | Faible / Modéré / Élevé | - |
| `diagnostic` | int | Résultat final du diagnostic | 0 = bénin, 1 = malin | 0 ou 1 |
| `recommandation_clinique` | string | Recommandation médicale basée sur le profil du patient | Texte libre | - |
| `frequence_surveillance` | string | Fréquence de surveillance recommandée | Tous les 3/6/12/18/24 mois | - |

### Catégories de risque

- **Faible** : Risque < 5%
- **Modéré** : Risque 5-15%
- **Élevé** : Risque > 15%

---

## Exemple de Données Complètes

```json
{
  "patient_id": "P00125",
  "age": 52,
  "imc": 26.5,
  "antecedents_familiaux": "Oui",
  "antecedents_personnels": "Non",
  "nombre_biopsies": 2,
  "mutation_genetique": "BRCA1",
  "age_premieres_menstruations": 13,
  "age_premier_enfant": 28,
  "nombre_enfants": 3,
  "statut_er": "Positif",
  "statut_pr": "Négatif",
  "expression_her2": "Positif",
  "resultat_mammographie": "BI-RADS 4",
  "densite_mammaire": "C - Hétérogène dense",
  "resultat_echographie": "Masse solide irrégulière de 12mm, hypoéchogène, avec marges spiculées et ombre acoustique postérieure",
  "tabagisme": "Non-fumeuse",
  "consommation_alcool": "Modérée",
  "activite_physique": "Faible",
  "risque_5_10_ans_pourcent": 12.3,
  "categorie_risque": "Élevé",
  "diagnostic": 1,
  "recommandation_clinique": "Suivi annuel par mammographie et échographie. IRM mammaire recommandée en raison de la mutation BRCA1. Consultation oncogénétique pour discussion sur prophylaxie.",
  "frequence_surveillance": "Tous les 12 mois"
}
```

---

## Utilisation dans l'Application

### Route d'accès
- **URL** : `/diagnostic-medical`
- **Authentification** : Requise (réservé aux médecins)
- **Composant** : `DiagnosticMedical.vue`

### API Backend (à implémenter)

```javascript
// POST /api/diagnostic-medical
fetch('/api/diagnostic-medical', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(formData)
})
```

---

## Différences avec le Diagnostic Patient

| Aspect | Diagnostic Patient | Diagnostic Médical |
|--------|-------------------|-------------------|
| Utilisateur | Grand public | Professionnels de santé |
| Nombre de champs | 11 champs | 24 champs |
| Authentification | Non requise | Requise |
| Niveau de détail | Basique | Complet (clinique + paraclinique) |
| Résultats biologiques | Non inclus | ER, PR, HER2 |
| Imagerie | Non inclus | BI-RADS, densité, échographie |
| Mutations génétiques | Non inclus | BRCA1, BRCA2, TP53, etc. |

---

## Notes Importantes

1. **Confidentialité** : Ces données sont sensibles et doivent être protégées selon les normes RGPD/HIPAA
2. **Validation** : Tous les champs marqués comme "Required" doivent être renseignés
3. **Format des données** : Respecter strictement les types et valeurs possibles
4. **Calculs automatiques** : L'IMC peut être calculé automatiquement si poids et taille sont fournis
5. **Interopérabilité** : Les formats (BI-RADS, densité) respectent les standards internationaux

---

## Algorithme de Calcul du Risque (Suggestions)

Pour calculer `risque_5_10_ans_pourcent`, considérer :

1. **Âge** : Risque augmente avec l'âge
2. **Antécédents familiaux** : Facteur de risque majeur
3. **Mutations génétiques** : BRCA1/2 = risque très élevé (40-70%)
4. **Densité mammaire** : D > C > B > A
5. **BI-RADS** : Score 4-5 = risque élevé
6. **Statut hormonal** : Triple négatif = pronostic moins favorable
7. **Biopsies** : Nombre élevé = risque accru
8. **IMC** : Surpoids/obésité = facteur de risque
9. **Mode de vie** : Tabac, alcool, sédentarité augmentent le risque

---

## Support et Documentation

Pour toute question sur l'implémentation ou l'utilisation des données :
- Consulter la documentation médicale de référence
- Valider avec un oncologue pour les calculs de risque
- Respecter les protocoles de sécurité des données de santé
