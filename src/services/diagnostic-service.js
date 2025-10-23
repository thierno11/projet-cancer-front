// Service de diagnostic centralisé
import authService from './authService'

// const API_BASE_URL = 'http://localhost:8000'
const API_BASE_URL = import.meta.env.VITE_API_URL

class DiagnosticService {
  /**
   * Soumettre un diagnostic patient (11 champs)
   * @param {Object} diagnosticData - Données du diagnostic patient
   * @returns {Promise<Object>} Résultat du diagnostic
   */
  async submitDiagnosticPatient(diagnosticData) {
    try {
      const response = await fetch(`${API_BASE_URL}/diagnostic/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(diagnosticData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || 'Erreur lors de la soumission du diagnostic')
      }

      const result = await response.json()
      return {
        success: true,
        data: result,
      }
    } catch (error) {
      console.error('Erreur de soumission du diagnostic:', error)
      throw error
    }
  }

  /**
   * Soumettre un diagnostic médical (24 champs) - Authentification requise
   * @param {Object} diagnosticData - Données du diagnostic médical
   * @returns {Promise<Object>} Résultat du diagnostic
   */
  async submitDiagnosticMedical(diagnosticData) {
    try {
      const response = await authService.authenticatedFetch(`${API_BASE_URL}/diagnostic/`, {
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
   * Récupérer l'historique des diagnostics d'un patient - Authentification requise
   * @param {string} patientId - ID du patient
   * @returns {Promise<Array>} Liste des diagnostics
   */
  async getDiagnosticHistory(patientId) {
    try {
      const response = await authService.authenticatedFetch(
        `${API_BASE_URL}/diagnostic/history/${patientId}`,
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
   * Récupérer un diagnostic spécifique par ID - Authentification requise
   * @param {string} diagnosticId - ID du diagnostic
   * @returns {Promise<Object>} Détails du diagnostic
   */
  async getDiagnosticById(diagnosticId) {
    try {
      const response = await authService.authenticatedFetch(
        `${API_BASE_URL}/diagnostic/${diagnosticId}`,
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
   * Formater les données du formulaire patient pour l'API
   * @param {Object} formData - Données brutes du formulaire
   * @returns {Object} Données formatées pour l'API
   */
  formatPatientData(formData) {
    return {
      age: formData.age,
      imc: formData.imc || this.calculateIMC(formData.poids, formData.taille),
      ant_familiaux: formData.ant_familiaux,
      ant_personnels: formData.ant_personnels,
      age_premieres_regles: formData.age_premieres_regles,
      age_premier_enfant: formData.age_premier_enfant,
      nb_enfants: formData.nb_enfants,
      mode_vie: formData.mode_vie,
      tabac: formData.tabac,
      alcool: formData.alcool,
      activite_physique: formData.activite_physique,
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
   * Valider les données du diagnostic patient
   * @param {Object} data - Données à valider
   * @returns {Object} { isValid: boolean, errors: Array }
   */
  validatePatientData(data) {
    const errors = []

    if (!data.age || data.age < 18 || data.age > 100) {
      errors.push("L'âge doit être entre 18 et 100 ans")
    }

    if (!data.imc || data.imc < 10 || data.imc > 60) {
      errors.push("L'IMC doit être entre 10 et 60")
    }

    if (data.ant_familiaux === null || data.ant_familiaux === undefined) {
      errors.push('Les antécédents familiaux sont requis')
    }

    if (data.ant_personnels === null || data.ant_personnels === undefined) {
      errors.push('Les antécédents personnels sont requis')
    }

    if (
      !data.age_premieres_regles ||
      data.age_premieres_regles < 8 ||
      data.age_premieres_regles > 20
    ) {
      errors.push("L'âge des premières règles doit être entre 8 et 20 ans")
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }
}

// Exporter une instance unique (singleton)
export default new DiagnosticService()
