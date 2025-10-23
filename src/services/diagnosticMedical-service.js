// Service de diagnostic médical pour les professionnels de santé
import authService from './authService'

// const API_BASE_URL = 'http://localhost:8000'
const API_BASE_URL = import.meta.env.VITE_API_URL

class DiagnosticMedicalService {
  /**
   * Soumettre un diagnostic médical complet (24 champs) - Authentification requise
   * @param {Object} diagnosticData - Données du diagnostic médical
   * @returns {Promise<Object>} Résultat du diagnostic
   */
  async submitDiagnosticMedical(diagnosticData) {
    try {
      const response = await authService.authenticatedFetch(`${API_BASE_URL}/medecin/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(diagnosticData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || 'Erreur lors de la soumission du diagnostic médical')
      }

      const result = await response.json()
      return {
        success: true,
        data: result,
      }
    } catch (error) {
      console.error('Erreur de soumission du diagnostic médical:', error)
      throw error
    }
  }

  /**
   * Récupérer l'historique des diagnostics médicaux - Authentification requise
   * @param {string} patientId - ID du patient
   * @returns {Promise<Array>} Liste des diagnostics
   */
  async getDiagnosticHistory(patientId) {
    try {
      const response = await authService.authenticatedFetch(
        `${API_BASE_URL}/medecin/history/${patientId}`,
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || "Erreur lors de la récupération de l'historique")
      }

      const history = await response.json()
      return history
    } catch (error) {
      console.error("Erreur de récupération de l'historique:", error)
      throw error
    }
  }

  /**
   * Récupérer un diagnostic médical spécifique par ID
   * @param {string} diagnosticId - ID du diagnostic
   * @returns {Promise<Object>} Détails du diagnostic
   */
  async getDiagnosticById(diagnosticId) {
    try {
      const response = await authService.authenticatedFetch(
        `${API_BASE_URL}/medecin/${diagnosticId}`,
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || 'Erreur lors de la récupération du diagnostic')
      }

      const diagnostic = await response.json()
      return diagnostic
    } catch (error) {
      console.error('Erreur de récupération du diagnostic:', error)
      throw error
    }
  }

  /**
   * Récupérer la liste de tous les patients - Authentification requise
   * @returns {Promise<Array>} Liste des patients
   */
  async getPatients() {
    try {
      const response = await authService.authenticatedFetch(`${API_BASE_URL}/medecin/patients`)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || 'Erreur lors de la récupération des patients')
      }

      const patients = await response.json()
      return patients
    } catch (error) {
      console.error('Erreur de récupération des patients:', error)
      throw error
    }
  }

  /**
   * Formater les données du formulaire médical pour l'API
   * @param {Object} formData - Données brutes du formulaire
   * @returns {Object} Données formatées pour l'API
   */
  formatMedicalData(formData) {
    return {
      // Identification du patient
      patient_id: formData.patient_id,
      age: formData.age,
      imc: formData.imc,

      // Antécédents médicaux
      antecedents_familiaux: formData.antecedents_familiaux,
      antecedents_personnels: formData.antecedents_personnels,
      nombre_biopsies: formData.nombre_biopsies,
      mutation_genetique: formData.mutation_genetique,

      // Historique reproductif
      age_premieres_menstruations: formData.age_premieres_menstruations,
      age_premier_enfant: formData.age_premier_enfant,
      nombre_enfants: formData.nombre_enfants,

      // Résultats biologiques et moléculaires
      statut_er: formData.statut_er,
      statut_pr: formData.statut_pr,
      expression_her2: formData.expression_her2,

      // Résultats d'imagerie
      resultat_mammographie: formData.resultat_mammographie,
      densite_mammaire: formData.densite_mammaire,
      resultat_echographie: formData.resultat_echographie,

      // Mode de vie et facteurs de risque
      tabagisme: formData.tabagisme,
      consommation_alcool: formData.consommation_alcool,
      activite_physique: formData.activite_physique,

      // Évaluation du risque et diagnostic
      risque_5_10_ans_pourcent: formData.risque_5_10_ans_pourcent,
      categorie_risque: formData.categorie_risque,
      diagnostic: formData.diagnostic,
      recommandation_clinique: formData.recommandation_clinique,
      frequence_surveillance: formData.frequence_surveillance,
    }
  }

  /**
   * Calculer l'IMC (Indice de Masse Corporelle)
   * @param {number} poids - Poids en kg
   * @param {number} taille - Taille en cm
   * @returns {number} IMC arrondi à 2 décimales
   */
  calculateIMC(poids, taille) {
    if (!poids || !taille || taille === 0) return null
    const tailleMetres = taille / 100
    return parseFloat((poids / (tailleMetres * tailleMetres)).toFixed(2))
  }

  /**
   * Valider les données du diagnostic médical
   * @param {Object} data - Données à valider
   * @returns {Object} { isValid: boolean, errors: Array }
   */
  validateMedicalData(data) {
    const errors = []

    // Validation identification
    if (!data.patient_id || data.patient_id.trim() === '') {
      errors.push("L'identifiant du patient est requis")
    }

    if (!data.age || data.age < 18 || data.age > 100) {
      errors.push("L'âge doit être entre 18 et 100 ans")
    }

    if (!data.imc || data.imc < 10 || data.imc > 60) {
      errors.push("L'IMC doit être entre 10 et 60")
    }

    // Validation antécédents
    if (!data.antecedents_familiaux) {
      errors.push('Les antécédents familiaux sont requis')
    }

    if (!data.antecedents_personnels) {
      errors.push('Les antécédents personnels sont requis')
    }

    if (data.nombre_biopsies === null || data.nombre_biopsies === undefined) {
      errors.push('Le nombre de biopsies est requis')
    }

    // Validation historique reproductif
    if (
      !data.age_premieres_menstruations ||
      data.age_premieres_menstruations < 8 ||
      data.age_premieres_menstruations > 20
    ) {
      errors.push("L'âge des premières menstruations doit être entre 8 et 20 ans")
    }

    // Validation résultats biologiques
    if (!data.statut_er) {
      errors.push('Le statut ER est requis')
    }

    if (!data.statut_pr) {
      errors.push('Le statut PR est requis')
    }

    if (!data.expression_her2) {
      errors.push("L'expression HER2 est requise")
    }

    // Validation résultats d'imagerie
    if (!data.resultat_mammographie) {
      errors.push('Le résultat de la mammographie est requis')
    }

    if (!data.densite_mammaire) {
      errors.push('La densité mammaire est requise')
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  /**
   * Calculer la catégorie de risque basée sur le pourcentage
   * @param {number} risquePourcent - Pourcentage de risque (0-100)
   * @returns {string} Catégorie de risque
   */
  calculateRiskCategory(risquePourcent) {
    if (risquePourcent < 5) {
      return 'Faible'
    } else if (risquePourcent <= 15) {
      return 'Modéré'
    } else {
      return 'Élevé'
    }
  }

  /**
   * Générer une recommandation de surveillance basée sur le risque
   * @param {string} categorieRisque - Catégorie de risque
   * @returns {string} Fréquence de surveillance recommandée
   */
  generateSurveillanceFrequency(categorieRisque) {
    switch (categorieRisque) {
      case 'Faible':
        return 'Tous les 24 mois'
      case 'Modéré':
        return 'Tous les 12 mois'
      case 'Élevé':
        return 'Tous les 6 mois'
      default:
        return 'Tous les 12 mois'
    }
  }
}

// Exporter une instance unique (singleton)
export default new DiagnosticMedicalService()
