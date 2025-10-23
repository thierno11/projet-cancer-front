<template>
  <div class="diagnostic-medical-page">
    <!-- Header -->
    <div class="page-header">
      <RouterLink to="/" class="back-link">
        <span class="back-icon">←</span>
        Retour à l'accueil
      </RouterLink>
      <h1 class="page-title">Diagnostic Médical Complet</h1>
      <p class="page-subtitle">Formulaire clinique d'évaluation du risque de cancer du sein</p>
    </div>

    <!-- Info Box -->
    <div class="info-box">
      <div class="info-icon">👨‍⚕️</div>
      <div class="info-content">
        <h3 class="info-title">Interface Médicale</h3>
        <p class="info-text">
          Ce formulaire est destiné aux professionnels de santé pour l'évaluation complète du
          risque de cancer du sein basée sur les données cliniques et paracliniques.
        </p>
      </div>
    </div>

    <!-- Formulaire -->
    <form @submit.prevent="handleSubmit" class="diagnostic-form">
      <!-- Section 1: Identification du Patient -->
      <div class="form-section">
        <div class="section-header">
          <span class="section-number">1</span>
          <h2 class="section-title">Identification du Patient</h2>
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">
              ID Patient <span class="required">*</span>
            </label>
            <input
              v-model="formData.patient_id"
              type="text"
              class="form-input"
              placeholder="Ex: P00125"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">
              Âge <span class="required">*</span>
            </label>
            <input
              v-model.number="formData.age"
              type="number"
              class="form-input"
              placeholder="Ex: 52"
              min="18"
              max="100"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">
              IMC (kg/m²) <span class="required">*</span>
            </label>
            <input
              v-model.number="formData.imc"
              type="number"
              class="form-input"
              placeholder="Ex: 26.5"
              step="0.1"
              min="10"
              max="60"
              required
            />
          </div>
        </div>
      </div>

      <!-- Section 2: Antécédents -->
      <div class="form-section">
        <div class="section-header">
          <span class="section-number">2</span>
          <h2 class="section-title">Antécédents Médicaux</h2>
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">
              Antécédents familiaux de cancer du sein <span class="required">*</span>
            </label>
            <select v-model="formData.antecedents_familiaux" required class="form-select">
              <option value="" disabled>Sélectionnez</option>
              <option value="Oui">Oui</option>
              <option value="Non">Non</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">
              Antécédents personnels de pathologies mammaires <span class="required">*</span>
            </label>
            <select v-model="formData.antecedents_personnels" required class="form-select">
              <option value="" disabled>Sélectionnez</option>
              <option value="Oui">Oui</option>
              <option value="Non">Non</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">
              Nombre de biopsies effectuées <span class="required">*</span>
            </label>
            <input
              v-model.number="formData.nombre_biopsies"
              type="number"
              class="form-input"
              placeholder="Ex: 2"
              min="0"
              max="20"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">
              Mutation génétique identifiée <span class="required">*</span>
            </label>
            <select v-model="formData.mutation_genetique" required class="form-select">
              <option value="" disabled>Sélectionnez</option>
              <option value="Aucune">Aucune mutation détectée</option>
              <option value="BRCA1">BRCA1</option>
              <option value="BRCA2">BRCA2</option>
              <option value="TP53">TP53</option>
              <option value="PALB2">PALB2</option>
              <option value="Autre">Autre mutation</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Section 3: Historique Reproductif -->
      <div class="form-section">
        <div class="section-header">
          <span class="section-number">3</span>
          <h2 class="section-title">Historique Reproductif</h2>
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">
              Âge des premières menstruations <span class="required">*</span>
            </label>
            <input
              v-model.number="formData.age_premieres_menstruations"
              type="number"
              class="form-input"
              placeholder="Ex: 13"
              min="8"
              max="20"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">
              Âge au premier enfant <span class="required">*</span>
            </label>
            <input
              v-model.number="formData.age_premier_enfant"
              type="number"
              class="form-input"
              placeholder="Ex: 28 (0 si aucun)"
              min="0"
              max="60"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">
              Nombre d'enfants biologiques <span class="required">*</span>
            </label>
            <input
              v-model.number="formData.nombre_enfants"
              type="number"
              class="form-input"
              placeholder="Ex: 3"
              min="0"
              max="20"
              required
            />
          </div>
        </div>
      </div>

      <!-- Section 4: Résultats Biologiques et Moléculaires -->
      <div class="form-section">
        <div class="section-header">
          <span class="section-number">4</span>
          <h2 class="section-title">Résultats Biologiques et Moléculaires</h2>
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">
              Statut ER (Récepteurs d'œstrogènes) <span class="required">*</span>
            </label>
            <select v-model="formData.statut_er" required class="form-select">
              <option value="" disabled>Sélectionnez</option>
              <option value="Positif">Positif</option>
              <option value="Négatif">Négatif</option>
              <option value="Inconnu">Inconnu</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">
              Statut PR (Récepteurs de progestérone) <span class="required">*</span>
            </label>
            <select v-model="formData.statut_pr" required class="form-select">
              <option value="" disabled>Sélectionnez</option>
              <option value="Positif">Positif</option>
              <option value="Négatif">Négatif</option>
              <option value="Inconnu">Inconnu</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">
              Expression HER2 <span class="required">*</span>
            </label>
            <select v-model="formData.expression_her2" required class="form-select">
              <option value="" disabled>Sélectionnez</option>
              <option value="Positif">Positif</option>
              <option value="Négatif">Négatif</option>
              <option value="Équivoque">Équivoque</option>
              <option value="Inconnu">Inconnu</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Section 5: Résultats d'Imagerie -->
      <div class="form-section">
        <div class="section-header">
          <span class="section-number">5</span>
          <h2 class="section-title">Résultats d'Imagerie</h2>
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">
              Résultat de la mammographie (BI-RADS) <span class="required">*</span>
            </label>
            <select v-model="formData.resultat_mammographie" required class="form-select">
              <option value="" disabled>Sélectionnez</option>
              <option value="BI-RADS 0">BI-RADS 0 - Incomplet</option>
              <option value="BI-RADS 1">BI-RADS 1 - Négatif</option>
              <option value="BI-RADS 2">BI-RADS 2 - Bénin</option>
              <option value="BI-RADS 3">BI-RADS 3 - Probablement bénin</option>
              <option value="BI-RADS 4">BI-RADS 4 - Suspect</option>
              <option value="BI-RADS 5">BI-RADS 5 - Hautement suspect</option>
              <option value="BI-RADS 6">BI-RADS 6 - Cancer prouvé</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">
              Densité mammaire <span class="required">*</span>
            </label>
            <select v-model="formData.densite_mammaire" required class="form-select">
              <option value="" disabled>Sélectionnez</option>
              <option value="A - Quasi entièrement graisseuse">
                A - Quasi entièrement graisseuse
              </option>
              <option value="B - Densités fibroglandulaires dispersées">
                B - Densités fibroglandulaires dispersées
              </option>
              <option value="C - Hétérogène dense">C - Hétérogène dense</option>
              <option value="D - Extrêmement dense">D - Extrêmement dense</option>
            </select>
          </div>

          <div class="form-group full-width">
            <label class="form-label">
              Résultat échographique <span class="required">*</span>
            </label>
            <textarea
              v-model="formData.resultat_echographie"
              class="form-textarea"
              placeholder="Ex: Masse solide irrégulière avec marges spiculées, hypoéchogène..."
              rows="3"
              required
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Section 6: Mode de Vie et Facteurs de Risque -->
      <div class="form-section">
        <div class="section-header">
          <span class="section-number">6</span>
          <h2 class="section-title">Mode de Vie et Facteurs de Risque</h2>
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">
              Tabagisme <span class="required">*</span>
            </label>
            <select v-model="formData.tabagisme" required class="form-select">
              <option value="" disabled>Sélectionnez</option>
              <option value="Non-fumeuse">Non-fumeuse</option>
              <option value="Ancienne fumeuse">Ancienne fumeuse</option>
              <option value="Fumeuse active">Fumeuse active</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">
              Consommation d'alcool <span class="required">*</span>
            </label>
            <select v-model="formData.consommation_alcool" required class="form-select">
              <option value="" disabled>Sélectionnez</option>
              <option value="Aucune">Aucune</option>
              <option value="Légère">Légère (< 1 verre/semaine)</option>
              <option value="Modérée">Modérée (1-7 verres/semaine)</option>
              <option value="Élevée">Élevée (> 7 verres/semaine)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">
              Activité physique <span class="required">*</span>
            </label>
            <select v-model="formData.activite_physique" required class="form-select">
              <option value="" disabled>Sélectionnez</option>
              <option value="Faible">Faible (< 30 min/semaine)</option>
              <option value="Modérée">Modérée (30-150 min/semaine)</option>
              <option value="Élevée">Élevée (> 150 min/semaine)</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Section 7: Évaluation du Risque et Diagnostic -->
      <div class="form-section">
        <div class="section-header">
          <span class="section-number">7</span>
          <h2 class="section-title">Évaluation du Risque et Diagnostic</h2>
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">
              Risque estimé sur 5-10 ans (%) <span class="required">*</span>
            </label>
            <input
              v-model.number="formData.risque_5_10_ans_pourcent"
              type="number"
              class="form-input"
              placeholder="Ex: 12.3"
              step="0.1"
              min="0"
              max="100"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">
              Catégorie de risque <span class="required">*</span>
            </label>
            <select v-model="formData.categorie_risque" required class="form-select">
              <option value="" disabled>Sélectionnez</option>
              <option value="Faible">Faible (< 5%)</option>
              <option value="Modéré">Modéré (5-15%)</option>
              <option value="Élevé">Élevé (> 15%)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">
              Diagnostic final <span class="required">*</span>
            </label>
            <select v-model.number="formData.diagnostic" required class="form-select">
              <option value="" disabled>Sélectionnez</option>
              <option :value="0">0 - Bénin</option>
              <option :value="1">1 - Malin</option>
            </select>
          </div>

          <div class="form-group full-width">
            <label class="form-label">
              Recommandation clinique <span class="required">*</span>
            </label>
            <textarea
              v-model="formData.recommandation_clinique"
              class="form-textarea"
              placeholder="Ex: Suivi annuel par mammographie et échographie, surveillance rapprochée..."
              rows="3"
              required
            ></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">
              Fréquence de surveillance <span class="required">*</span>
            </label>
            <select v-model="formData.frequence_surveillance" required class="form-select">
              <option value="" disabled>Sélectionnez</option>
              <option value="Tous les 3 mois">Tous les 3 mois</option>
              <option value="Tous les 6 mois">Tous les 6 mois</option>
              <option value="Tous les 12 mois">Tous les 12 mois</option>
              <option value="Tous les 18 mois">Tous les 18 mois</option>
              <option value="Tous les 24 mois">Tous les 24 mois</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Message d'erreur API -->
      <div v-if="apiError" class="error-message">
        <span class="error-icon">⚠️</span>
        <div class="error-content">
          <strong>Erreur:</strong> {{ apiError }}
        </div>
      </div>

      <!-- Boutons d'action -->
      <div class="form-actions">
        <button type="button" @click="resetForm" class="btn btn-secondary">
          Réinitialiser
        </button>
        <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
          <span v-if="!isSubmitting">Enregistrer le diagnostic</span>
          <span v-else class="loading">
            <span class="spinner"></span>
            Enregistrement en cours...
          </span>
        </button>
      </div>
    </form>

    <!-- Modal de confirmation -->
    <transition name="modal">
      <div v-if="showConfirmation" class="modal-overlay" @click.self="closeConfirmation">
        <div class="modal-content confirmation-modal">
          <button class="close-btn" @click="closeConfirmation">✕</button>

          <div class="confirmation-container">
            <div class="confirmation-icon">✅</div>
            <h2 class="confirmation-title">Diagnostic Enregistré</h2>
            <p class="confirmation-text">
              Le diagnostic pour le patient <strong>{{ formData.patient_id }}</strong> a été
              enregistré avec succès.
            </p>

            <div class="summary-box">
              <h3 class="summary-title">Résumé</h3>
              <div class="summary-grid">
                <div class="summary-item">
                  <span class="summary-label">Catégorie de risque :</span>
                  <span
                    class="summary-value"
                    :class="{
                      'risk-low': formData.categorie_risque === 'Faible',
                      'risk-moderate': formData.categorie_risque === 'Modéré',
                      'risk-high': formData.categorie_risque === 'Élevé',
                    }"
                  >
                    {{ formData.categorie_risque }}
                  </span>
                </div>
                <div class="summary-item">
                  <span class="summary-label">Diagnostic :</span>
                  <span
                    class="summary-value"
                    :class="{ 'status-benign': formData.diagnostic === 0, 'status-malign': formData.diagnostic === 1 }"
                  >
                    {{ formData.diagnostic === 0 ? 'Bénin' : 'Malin' }}
                  </span>
                </div>
                <div class="summary-item">
                  <span class="summary-label">Risque 5-10 ans :</span>
                  <span class="summary-value">{{ formData.risque_5_10_ans_pourcent }}%</span>
                </div>
                <div class="summary-item">
                  <span class="summary-label">Surveillance :</span>
                  <span class="summary-value">{{ formData.frequence_surveillance }}</span>
                </div>
              </div>
            </div>

            <div class="modal-actions">
              <button @click="downloadReport" class="btn btn-outline">
                <span class="btn-icon">📥</span>
                Télécharger le rapport
              </button>
              <button @click="resetAndClose" class="btn btn-secondary">Nouveau diagnostic</button>
              <RouterLink to="/" class="btn btn-primary">Retour à l'accueil</RouterLink>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import diagnosticMedicalService from '@/services/diagnosticMedical-service'

const isSubmitting = ref(false)
const showConfirmation = ref(false)
const apiError = ref('')
const apiResponse = ref(null)

const formData = reactive({
  // Identification
  patient_id: '',
  age: null,
  imc: null,

  // Antécédents
  antecedents_familiaux: '',
  antecedents_personnels: '',
  nombre_biopsies: 0,
  mutation_genetique: '',

  // Historique reproductif
  age_premieres_menstruations: null,
  age_premier_enfant: null,
  nombre_enfants: 0,

  // Résultats biologiques
  statut_er: '',
  statut_pr: '',
  expression_her2: '',

  // Imagerie
  resultat_mammographie: '',
  densite_mammaire: '',
  resultat_echographie: '',

  // Mode de vie
  tabagisme: '',
  consommation_alcool: '',
  activite_physique: '',

  // Diagnostic et recommandations
  risque_5_10_ans_pourcent: null,
  categorie_risque: '',
  diagnostic: null,
  recommandation_clinique: '',
  frequence_surveillance: '',
})

const handleSubmit = async () => {
  isSubmitting.value = true
  apiError.value = ''

  try {
    // Formater les données pour l'API
    const diagnosticData = diagnosticMedicalService.formatMedicalData(formData)

    // Valider les données
    const validation = diagnosticMedicalService.validateMedicalData(diagnosticData)
    if (!validation.isValid) {
      apiError.value = validation.errors.join(', ')
      isSubmitting.value = false
      alert(`Erreurs de validation:\n${validation.errors.join('\n')}`)
      return
    }

    console.log('Envoi des données du diagnostic médical à l\'API:', diagnosticData)

    // Envoyer les données à l'API
    const response = await diagnosticMedicalService.submitDiagnosticMedical(diagnosticData)

    console.log('Réponse de l\'API:', response)
    apiResponse.value = response.data

    // Afficher le message de confirmation
    showConfirmation.value = true
  } catch (error) {
    console.error('Erreur lors de la soumission du diagnostic médical:', error)
    apiError.value = error.message || 'Erreur lors de la soumission du diagnostic médical'
    alert(`Erreur: ${apiError.value}`)
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  formData.patient_id = ''
  formData.age = null
  formData.imc = null
  formData.antecedents_familiaux = ''
  formData.antecedents_personnels = ''
  formData.nombre_biopsies = 0
  formData.mutation_genetique = ''
  formData.age_premieres_menstruations = null
  formData.age_premier_enfant = null
  formData.nombre_enfants = 0
  formData.statut_er = ''
  formData.statut_pr = ''
  formData.expression_her2 = ''
  formData.resultat_mammographie = ''
  formData.densite_mammaire = ''
  formData.resultat_echographie = ''
  formData.tabagisme = ''
  formData.consommation_alcool = ''
  formData.activite_physique = ''
  formData.risque_5_10_ans_pourcent = null
  formData.categorie_risque = ''
  formData.diagnostic = null
  formData.recommandation_clinique = ''
  formData.frequence_surveillance = ''
}

const closeConfirmation = () => {
  showConfirmation.value = false
}

const resetAndClose = () => {
  resetForm()
  closeConfirmation()
}

const downloadReport = () => {
  alert('Fonctionnalité de téléchargement du rapport à implémenter')
  console.log('Génération du rapport pour:', formData.patient_id)
}
</script>

<style scoped>
.diagnostic-medical-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
  background: #f8f9fa;
}

/* Header */
.page-header {
  text-align: center;
  margin-bottom: 2rem;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #16a34a;
  text-decoration: none;
  font-weight: 600;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
}

.back-link:hover {
  gap: 0.75rem;
  color: #15803d;
}

.back-icon {
  font-size: 1.25rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  font-size: 1rem;
  color: #64748b;
  line-height: 1.6;
}

/* Info Box */
.info-box {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  border-left: 4px solid #16a34a;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.info-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.info-content {
  flex: 1;
}

.info-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #14532d;
  margin-bottom: 0.5rem;
}

.info-text {
  color: #166534;
  font-size: 0.95rem;
  line-height: 1.6;
}

/* Form Sections */
.diagnostic-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e2e8f0;
}

.section-number {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #16a34a;
  color: white;
  border-radius: 50%;
  font-weight: 800;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.section-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

/* Form Grid */
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-label {
  font-weight: 600;
  color: #1e293b;
  font-size: 0.95rem;
}

.required {
  color: #dc2626;
  font-weight: 700;
}

/* Form Inputs */
.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  color: #1e293b;
  transition: all 0.2s ease;
  background: white;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #16a34a;
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
}

.form-select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2364748b' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  padding-right: 3rem;
}

.form-textarea {
  resize: vertical;
  line-height: 1.6;
}

/* Message d'erreur */
.error-message {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  background: #fff5f5;
  border: 2px solid #fc8181;
  border-radius: 12px;
  color: #c53030;
  font-weight: 500;
  margin-top: 1.5rem;
  box-shadow: 0 2px 8px rgba(252, 129, 129, 0.2);
}

.error-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.error-content {
  flex: 1;
  line-height: 1.6;
}

.error-content strong {
  font-weight: 700;
}

/* Form Actions */
.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.btn {
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: #16a34a;
  color: white;
  box-shadow: 0 2px 8px rgba(22, 163, 74, 0.3);
}

.btn-primary:hover:not(:disabled) {
  background: #15803d;
  box-shadow: 0 4px 12px rgba(22, 163, 74, 0.4);
}

.btn-secondary {
  background: white;
  color: #64748b;
  border: 2px solid #e2e8f0;
}

.btn-secondary:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.btn-outline {
  background: transparent;
  color: #16a34a;
  border: 2px solid #16a34a;
}

.btn-outline:hover {
  background: #16a34a;
  color: white;
}

.btn-icon {
  font-size: 1.25rem;
}

.loading {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
  overflow-y: auto;
}

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 700px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
}

.confirmation-modal {
  padding: 3rem;
}

.close-btn {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: #f1f5f9;
  color: #1e293b;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.close-btn:hover {
  background: #e2e8f0;
  transform: scale(1.1);
}

.confirmation-container {
  text-align: center;
}

.confirmation-icon {
  width: 100px;
  height: 100px;
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 3.5rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.confirmation-title {
  font-size: 1.8rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 1rem;
}

.confirmation-text {
  color: #64748b;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
}

/* Summary Box */
.summary-box {
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  text-align: left;
}

.summary-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.summary-label {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 600;
}

.summary-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
}

.summary-value.risk-low {
  color: #10b981;
}

.summary-value.risk-moderate {
  color: #f59e0b;
}

.summary-value.risk-high {
  color: #dc2626;
}

.summary-value.status-benign {
  color: #10b981;
}

.summary-value.status-malign {
  color: #dc2626;
}

/* Modal Actions */
.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9) translateY(20px);
}

/* Responsive */
@media (max-width: 768px) {
  .diagnostic-medical-page {
    padding: 1rem;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .form-section {
    padding: 1.5rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }

  .confirmation-modal {
    padding: 2rem 1.5rem;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }

  .modal-actions {
    flex-direction: column;
  }
}
</style>
