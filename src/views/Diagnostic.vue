<template>
  <div class="diagnostic-page">
    <!-- Header -->
    <div class="page-header">
      <RouterLink to="/" class="back-link">
        <span class="back-icon">←</span>
        Retour à l'accueil
      </RouterLink>
      <h1 class="page-title">Évaluation du Risque de Cancer du Sein</h1>
      <p class="page-subtitle">
        Cet outil vous aide à estimer votre risque de développer un cancer du sein
      </p>
    </div>

    <!-- Disclaimer -->
    <div class="disclaimer-box">
      <div class="disclaimer-icon">⚠️</div>
      <div class="disclaimer-content">
        <h3 class="disclaimer-title">Information Importante</h3>
        <p class="disclaimer-text">
          Cet outil ne remplace pas une consultation médicale. Les résultats sont des estimations
          basées sur des modèles statistiques et ne constituent pas un diagnostic médical.
        </p>
      </div>
    </div>

    <!-- Formulaire -->
    <form @submit.prevent="handleSubmit" class="diagnostic-form">
      <!-- Section 1: Informations Démographiques -->
      <div class="form-section">
        <div class="section-header">
          <span class="section-number">1</span>
          <h2 class="section-title">Informations Démographiques</h2>
        </div>

        <div class="question-group">
          <label class="question-label">
            Quel est votre âge ? <span class="required">*</span>
          </label>
          <select v-model.number="formData.age" required class="form-select">
            <option value="" disabled>Sélectionnez votre âge</option>
            <option v-for="age in ageOptions" :key="age" :value="age">{{ age }} ans</option>
          </select>
        </div>

        <div class="question-group">
          <label class="question-label">Quel est votre poids et taille ?</label>
          <div class="inline-inputs">
            <div class="input-wrapper">
              <label class="sub-label">Poids (kg)</label>
              <input
                v-model.number="formData.poids"
                type="number"
                class="form-input"
                placeholder="Ex: 65"
                step="0.1"
                min="30"
                max="300"
              />
            </div>
            <div class="input-wrapper">
              <label class="sub-label">Taille (cm)</label>
              <input
                v-model.number="formData.taille"
                type="number"
                class="form-input"
                placeholder="Ex: 165"
                min="100"
                max="250"
              />
            </div>
          </div>
          <div v-if="formData.poids && formData.taille" class="imc-display">
            <span class="imc-label">IMC calculé :</span>
            <span class="imc-value">{{ calculerIMC() }} kg/m²</span>
          </div>
        </div>
      </div>

      <!-- Section 2: Antécédents Personnels et Familiaux -->
      <div class="form-section">
        <div class="section-header">
          <span class="section-number">2</span>
          <h2 class="section-title">Antécédents Personnels et Familiaux</h2>
        </div>

        <div class="question-group">
          <label class="question-label">
            Avez-vous des antécédents familiaux de cancer du sein ? <span class="required">*</span>
          </label>
          <p class="question-help">
            (Mère, sœur, fille ou autres parentes du premier degré)
          </p>
          <div class="radio-group-vertical">
            <label class="radio-option-card">
              <input type="radio" v-model.number="formData.ant_familiaux" :value="0" required />
              <span class="radio-custom"></span>
              <div class="radio-text">
                <span class="radio-label">Non</span>
                <span class="radio-description">Aucun antécédent familial connu</span>
              </div>
            </label>
            <label class="radio-option-card">
              <input type="radio" v-model.number="formData.ant_familiaux" :value="1" required />
              <span class="radio-custom"></span>
              <div class="radio-text">
                <span class="radio-label">Oui</span>
                <span class="radio-description">
                  Un ou plusieurs membres de ma famille ont eu un cancer du sein
                </span>
              </div>
            </label>
          </div>
        </div>

        <div class="question-group">
          <label class="question-label">
            Avez-vous des antécédents personnels de pathologies mammaires ?
            <span class="required">*</span>
          </label>
          <p class="question-help">
            (Biopsies, lésions bénignes, hyperplasie atypique, etc.)
          </p>
          <div class="radio-group-vertical">
            <label class="radio-option-card">
              <input type="radio" v-model.number="formData.ant_personnels" :value="0" required />
              <span class="radio-custom"></span>
              <div class="radio-text">
                <span class="radio-label">Non</span>
                <span class="radio-description">Aucune pathologie mammaire diagnostiquée</span>
              </div>
            </label>
            <label class="radio-option-card">
              <input type="radio" v-model.number="formData.ant_personnels" :value="1" required />
              <span class="radio-custom"></span>
              <div class="radio-text">
                <span class="radio-label">Oui</span>
                <span class="radio-description">
                  J'ai eu des biopsies ou pathologies mammaires
                </span>
              </div>
            </label>
          </div>
        </div>
      </div>

      <!-- Section 3: Historique Reproductif -->
      <div class="form-section">
        <div class="section-header">
          <span class="section-number">3</span>
          <h2 class="section-title">Historique Reproductif</h2>
        </div>

        <div class="question-group">
          <label class="question-label">
            À quel âge avez-vous eu vos premières menstruations ?
            <span class="required">*</span>
          </label>
          <div class="radio-group-horizontal">
            <label class="radio-option-inline">
              <input
                type="radio"
                v-model.number="formData.age_premieres_regles"
                :value="10"
                required
              />
              <span class="radio-custom"></span>
              <span class="radio-label">≤ 11 ans</span>
            </label>
            <label class="radio-option-inline">
              <input
                type="radio"
                v-model.number="formData.age_premieres_regles"
                :value="12"
                required
              />
              <span class="radio-custom"></span>
              <span class="radio-label">12-13 ans</span>
            </label>
            <label class="radio-option-inline">
              <input
                type="radio"
                v-model.number="formData.age_premieres_regles"
                :value="14"
                required
              />
              <span class="radio-custom"></span>
              <span class="radio-label">14-15 ans</span>
            </label>
            <label class="radio-option-inline">
              <input
                type="radio"
                v-model.number="formData.age_premieres_regles"
                :value="16"
                required
              />
              <span class="radio-custom"></span>
              <span class="radio-label">≥ 16 ans</span>
            </label>
          </div>
        </div>

        <div class="question-group">
          <label class="question-label">
            À quel âge avez-vous eu votre premier enfant (né vivant) ?
            <span class="required">*</span>
          </label>
          <select v-model.number="formData.age_premier_enfant" required class="form-select">
            <option value="" disabled>Sélectionnez une option</option>
            <option :value="0">Je n'ai pas eu d'enfant</option>
            <option :value="20">Moins de 20 ans</option>
            <option :value="22">20-24 ans</option>
            <option :value="27">25-29 ans</option>
            <option :value="32">30 ans ou plus</option>
          </select>
        </div>

        <div class="question-group">
          <label class="question-label">
            Combien d'enfants avez-vous eu au total ? <span class="required">*</span>
          </label>
          <div class="radio-group-horizontal">
            <label
              class="radio-option-inline"
              v-for="n in [0, 1, 2, 3, 4, 5]"
              :key="n"
            >
              <input
                type="radio"
                v-model.number="formData.nb_enfants"
                :value="n"
                required
              />
              <span class="radio-custom"></span>
              <span class="radio-label">{{ n }}</span>
            </label>
            <label class="radio-option-inline">
              <input
                type="radio"
                v-model.number="formData.nb_enfants"
                :value="6"
                required
              />
              <span class="radio-custom"></span>
              <span class="radio-label">6+</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Section 4: Mode de Vie -->
      <div class="form-section">
        <div class="section-header">
          <span class="section-number">4</span>
          <h2 class="section-title">Mode de Vie</h2>
        </div>

        <div class="question-group">
          <label class="question-label">
            Comment décririez-vous votre mode de vie général ? <span class="required">*</span>
          </label>
          <div class="radio-group-vertical">
            <label class="radio-option-card">
              <input type="radio" v-model="formData.mode_vie" value="sain" required />
              <span class="radio-custom"></span>
              <div class="radio-text">
                <span class="radio-label">Sain</span>
                <span class="radio-description">
                  Alimentation équilibrée, activité physique régulière, pas de tabac ni d'alcool
                </span>
              </div>
            </label>
            <label class="radio-option-card">
              <input type="radio" v-model="formData.mode_vie" value="modéré" required />
              <span class="radio-custom"></span>
              <div class="radio-text">
                <span class="radio-label">Modéré</span>
                <span class="radio-description">
                  Quelques facteurs de risque présents, effort pour maintenir un mode de vie sain
                </span>
              </div>
            </label>
            <label class="radio-option-card">
              <input type="radio" v-model="formData.mode_vie" value="à risque" required />
              <span class="radio-custom"></span>
              <div class="radio-text">
                <span class="radio-label">À risque</span>
                <span class="radio-description">
                  Plusieurs facteurs de risque présents (sédentarité, tabac, alcool, etc.)
                </span>
              </div>
            </label>
          </div>
        </div>

        <div class="question-group">
          <label class="question-label">
            Fumez-vous ou avez-vous fumé régulièrement ? <span class="required">*</span>
          </label>
          <div class="radio-group-horizontal">
            <label class="radio-option-inline">
              <input type="radio" v-model.number="formData.tabac" :value="0" required />
              <span class="radio-custom"></span>
              <span class="radio-label">Non</span>
            </label>
            <label class="radio-option-inline">
              <input type="radio" v-model.number="formData.tabac" :value="1" required />
              <span class="radio-custom"></span>
              <span class="radio-label">Oui</span>
            </label>
          </div>
        </div>

        <div class="question-group">
          <label class="question-label">
            Consommez-vous de l'alcool régulièrement ? <span class="required">*</span>
          </label>
          <p class="question-help">(Plus de 3 verres par semaine)</p>
          <div class="radio-group-horizontal">
            <label class="radio-option-inline">
              <input type="radio" v-model.number="formData.alcool" :value="0" required />
              <span class="radio-custom"></span>
              <span class="radio-label">Non</span>
            </label>
            <label class="radio-option-inline">
              <input type="radio" v-model.number="formData.alcool" :value="1" required />
              <span class="radio-custom"></span>
              <span class="radio-label">Oui</span>
            </label>
          </div>
        </div>

        <div class="question-group">
          <label class="question-label">
            Quel est votre niveau d'activité physique ? <span class="required">*</span>
          </label>
          <div class="radio-group-vertical">
            <label class="radio-option-card">
              <input
                type="radio"
                v-model="formData.activite_physique"
                value="faible"
                required
              />
              <span class="radio-custom"></span>
              <div class="radio-text">
                <span class="radio-label">Faible</span>
                <span class="radio-description">Moins de 30 minutes d'exercice par semaine</span>
              </div>
            </label>
            <label class="radio-option-card">
              <input
                type="radio"
                v-model="formData.activite_physique"
                value="moyen"
                required
              />
              <span class="radio-custom"></span>
              <div class="radio-text">
                <span class="radio-label">Moyen</span>
                <span class="radio-description">30 minutes à 2 heures d'exercice par semaine</span>
              </div>
            </label>
            <label class="radio-option-card">
              <input
                type="radio"
                v-model="formData.activite_physique"
                value="élevé"
                required
              />
              <span class="radio-custom"></span>
              <div class="radio-text">
                <span class="radio-label">Élevé</span>
                <span class="radio-description">Plus de 2 heures d'exercice par semaine</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      <!-- Message d'erreur API -->
      <div v-if="apiError" class="error-message">
        <span class="error-icon">⚠️</span>
        <span>{{ apiError }}</span>
      </div>

      <!-- Boutons d'action -->
      <div class="form-actions">
        <button type="button" @click="resetForm" class="btn btn-secondary">
          Réinitialiser
        </button>
        <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
          <span v-if="!isSubmitting">Calculer mon risque</span>
          <span v-else class="loading">
            <span class="spinner"></span>
            Calcul en cours...
          </span>
        </button>
      </div>
    </form>

    <!-- Modal des résultats -->
    <transition name="modal">
      <div v-if="showResults" class="modal-overlay" @click.self="closeResults">
        <div class="modal-content results-modal">
          <button class="close-btn" @click="closeResults">✕</button>

          <div class="result-container">
            <!-- Icône de risque -->
            <div
              class="result-icon"
              :class="{
                'high-risk': riskLevel === 'high',
                'moderate-risk': riskLevel === 'moderate',
                'low-risk': riskLevel === 'low',
              }"
            >
              {{ riskLevel === 'high' ? '⚠️' : riskLevel === 'moderate' ? '⚡' : '✓' }}
            </div>

            <h2 class="result-title">
              {{
                riskLevel === 'high'
                  ? 'Risque Élevé Détecté'
                  : riskLevel === 'moderate'
                    ? 'Risque Modéré'
                    : 'Risque Faible'
              }}
            </h2>

            <!-- Score de risque -->
            <div class="risk-score">
              <div class="score-label">Score de risque global</div>
              <div
                class="score-value"
                :class="{
                  high: riskLevel === 'high',
                  moderate: riskLevel === 'moderate',
                  low: riskLevel === 'low',
                }"
              >
                {{ riskScore }}%
              </div>
              <div class="score-bar">
                <div
                  class="score-fill"
                  :class="{
                    high: riskLevel === 'high',
                    moderate: riskLevel === 'moderate',
                    low: riskLevel === 'low',
                  }"
                  :style="{ width: `${riskScore}%` }"
                ></div>
              </div>
            </div>

            <!-- Détails des facteurs de risque -->
            <div class="risk-factors" v-if="identifiedFactors.length > 0">
              <h3 class="factors-title">
                <span class="icon">📊</span>
                Facteurs de risque identifiés
              </h3>
              <div class="factors-list">
                <div
                  v-for="(factor, index) in identifiedFactors"
                  :key="index"
                  class="factor-item"
                >
                  <span class="factor-icon">{{ factor.icon }}</span>
                  <div class="factor-info">
                    <div class="factor-name">{{ factor.name }}</div>
                    <div class="factor-impact">Impact: {{ factor.impact }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Recommandations d'examens -->
            <div class="recommendations">
              <h3 class="recommendations-title">
                <span class="icon">🏥</span>
                Examens recommandés
              </h3>
              <div class="recommendations-grid">
                <div
                  class="recommendation-card"
                  :class="{ recommended: recommendation.recommended }"
                  v-for="(recommendation, index) in recommendations"
                  :key="index"
                >
                  <div class="recommendation-header">
                    <span class="recommendation-icon">{{ recommendation.icon }}</span>
                    <span class="recommendation-name">{{ recommendation.name }}</span>
                  </div>
                  <div class="recommendation-probability">
                    Pertinence: {{ recommendation.probability }}%
                  </div>
                  <div class="recommendation-urgency">{{ recommendation.urgency }}</div>
                </div>
              </div>
            </div>

            <!-- Conseils -->
            <div class="advice-box">
              <h3 class="advice-title">
                <span class="icon">💡</span>
                Recommandations médicales
              </h3>
              <p class="advice-text">{{ adviceText }}</p>
            </div>

            <!-- Actions -->
            <div class="modal-actions">
              <RouterLink
                v-if="riskLevel !== 'low'"
                to="/analyse"
                class="btn btn-primary btn-large"
              >
                <span class="btn-icon">📊</span>
                Téléverser une mammographie
                <span class="btn-arrow">→</span>
              </RouterLink>
              <button @click="downloadReport" class="btn btn-outline">
                <span class="btn-icon">📥</span>
                Télécharger le rapport
              </button>
              <button @click="closeResults" class="btn btn-secondary">Fermer</button>
            </div>

            <!-- Disclaimer -->
            <div class="disclaimer">
              <p>
                <strong>Avertissement :</strong> Cette évaluation est fournie à titre informatif
                uniquement. Elle ne constitue pas un diagnostic médical et ne remplace pas la
                consultation d'un professionnel de santé. Consultez toujours votre médecin pour
                toute question concernant votre santé.
              </p>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import diagnosticService from '@/services/diagnostic-service'

const isSubmitting = ref(false)
const showResults = ref(false)
const riskLevel = ref('') // 'low', 'moderate', 'high'
const riskScore = ref(0)
const apiError = ref('')
const apiResponse = ref(null)
const identifiedFactors = ref([])
const recommendations = ref([])
const adviceText = ref('')

// Options d'âge (18-85 ans)
const ageOptions = computed(() => {
  const ages = []
  for (let i = 18; i <= 85; i++) {
    ages.push(i)
  }
  return ages
})

const formData = reactive({
  // Informations personnelles
  age: null,
  poids: null,
  taille: null,

  // Antécédents
  ant_familiaux: null, // 0 ou 1
  ant_personnels: null, // 0 ou 1

  // Historique reproductif
  age_premieres_regles: null,
  age_premier_enfant: null,
  nb_enfants: 0,

  // Mode de vie
  mode_vie: '', // "sain", "modéré", "à risque"
  tabac: null, // 0 ou 1
  alcool: null, // 0 ou 1
  activite_physique: '', // "faible", "moyen", "élevé"
})

const calculerIMC = () => {
  if (formData.poids && formData.taille) {
    const tailleM = formData.taille / 100
    const imc = formData.poids / (tailleM * tailleM)
    return imc.toFixed(1)
  }
  return 0
}

const handleSubmit = async () => {
  isSubmitting.value = true
  apiError.value = ''

  try {
    // Formater les données pour l'API
    const diagnosticData = diagnosticService.formatPatientData(formData)

    // Valider les données
    const validation = diagnosticService.validatePatientData(diagnosticData)
    if (!validation.isValid) {
      apiError.value = validation.errors.join(', ')
      isSubmitting.value = false
      return
    }

    console.log('Envoi des données à l\'API:', diagnosticData)

    // Envoyer les données à l'API
    const response = await diagnosticService.submitDiagnosticPatient(diagnosticData)

    console.log('Réponse de l\'API:', response)
    apiResponse.value = response.data

    // Utiliser les résultats de l'API si disponibles
    if (response.data && response.data.risque !== undefined) {
      riskScore.value = Math.round(response.data.risque * 100) // Supposant que l'API retourne entre 0 et 1

      // Déterminer le niveau de risque
      if (riskScore.value < 30) {
        riskLevel.value = 'low'
      } else if (riskScore.value < 60) {
        riskLevel.value = 'moderate'
      } else {
        riskLevel.value = 'high'
      }
    } else {
      // Fallback: calculer le risque localement si l'API ne retourne pas de score
      calculateRisk()
    }

    showResults.value = true
  } catch (error) {
    console.error('Erreur lors de la soumission:', error)
    apiError.value = error.message || 'Erreur lors de la soumission du diagnostic'

    // En cas d'erreur API, calculer le risque localement
    calculateRisk()
    showResults.value = true
  } finally {
    isSubmitting.value = false
  }
}

const calculateRisk = () => {
  let score = 0
  const factors = []

  // 1. Âge (0-20 points)
  if (formData.age) {
    if (formData.age < 40) {
      score += 3
    } else if (formData.age < 50) {
      score += 8
      factors.push({ name: 'Âge entre 40 et 49 ans', impact: 'Modéré', icon: '📅' })
    } else if (formData.age < 60) {
      score += 15
      factors.push({ name: 'Âge entre 50 et 59 ans', impact: 'Élevé', icon: '📅' })
    } else {
      score += 20
      factors.push({ name: 'Âge supérieur à 60 ans', impact: 'Très élevé', icon: '📅' })
    }
  }

  // 2. IMC (0-10 points)
  const imc = calculerIMC()
  if (imc) {
    if (imc < 25) {
      score += 2
    } else if (imc < 30) {
      score += 5
      factors.push({ name: 'Surpoids (IMC 25-30)', impact: 'Modéré', icon: '⚖️' })
    } else {
      score += 10
      factors.push({ name: 'Obésité (IMC ≥ 30)', impact: 'Élevé', icon: '⚖️' })
    }
  }

  // 3. Antécédents familiaux (0-15 points)
  if (formData.ant_familiaux === 1) {
    score += 15
    factors.push({ name: 'Antécédents familiaux de cancer du sein', impact: 'Élevé', icon: '👨‍👩‍👧' })
  }

  // 4. Antécédents personnels (0-15 points)
  if (formData.ant_personnels === 1) {
    score += 15
    factors.push({ name: 'Antécédents personnels de pathologies mammaires', impact: 'Élevé', icon: '🏥' })
  }

  // 5. Âge premières règles (0-8 points)
  if (formData.age_premieres_regles && formData.age_premieres_regles <= 11) {
    score += 8
    factors.push({ name: 'Menstruation précoce (≤ 11 ans)', impact: 'Modéré', icon: '📆' })
  }

  // 6. Âge premier enfant (0-10 points)
  if (formData.age_premier_enfant === 0 && formData.age >= 30) {
    score += 10
    factors.push({ name: 'Nullipare (aucun enfant)', impact: 'Modéré', icon: '👶' })
  } else if (formData.age_premier_enfant >= 30) {
    score += 7
    factors.push({ name: 'Premier enfant après 30 ans', impact: 'Modéré', icon: '👶' })
  }

  // 7. Nombre d'enfants (bonus si élevé)
  if (formData.nb_enfants >= 3) {
    score -= 3
    factors.push({ name: 'Plusieurs enfants (facteur protecteur)', impact: 'Protecteur', icon: '👨‍👩‍👧‍👦' })
  }

  // 8. Mode de vie (0-10 points)
  if (formData.mode_vie === 'sain') {
    score += 2
  } else if (formData.mode_vie === 'modéré') {
    score += 6
    factors.push({ name: 'Mode de vie modéré', impact: 'Modéré', icon: '🏃‍♀️' })
  } else if (formData.mode_vie === 'à risque') {
    score += 10
    factors.push({ name: 'Mode de vie à risque', impact: 'Élevé', icon: '⚠️' })
  }

  // 9. Tabac (0-7 points)
  if (formData.tabac === 1) {
    score += 7
    factors.push({ name: 'Consommation de tabac', impact: 'Modéré', icon: '🚬' })
  }

  // 10. Alcool (0-6 points)
  if (formData.alcool === 1) {
    score += 6
    factors.push({ name: 'Consommation régulière d\'alcool', impact: 'Modéré', icon: '🍷' })
  }

  // 11. Activité physique (bonus si élevée)
  if (formData.activite_physique === 'élevé') {
    score -= 5
    factors.push({ name: 'Activité physique élevée', impact: 'Protecteur', icon: '🏃' })
  } else if (formData.activite_physique === 'faible') {
    score += 5
    factors.push({ name: 'Activité physique faible', impact: 'Modéré', icon: '🛋️' })
  }

  // Limiter le score entre 0 et 100
  riskScore.value = Math.max(0, Math.min(100, score))

  // Déterminer le niveau de risque
  if (riskScore.value >= 50) {
    riskLevel.value = 'high'
    adviceText.value =
      'Votre évaluation indique un risque élevé. Il est FORTEMENT recommandé de consulter un médecin spécialiste dans les plus brefs délais. Des examens complémentaires (mammographie, échographie) sont nécessaires pour une évaluation approfondie.'
  } else if (riskScore.value >= 30) {
    riskLevel.value = 'moderate'
    adviceText.value =
      'Votre évaluation indique un risque modéré. Nous vous recommandons de consulter votre médecin pour discuter d\'un suivi régulier et d\'examens de dépistage adaptés à votre profil de risque.'
  } else {
    riskLevel.value = 'low'
    adviceText.value =
      'Votre évaluation indique un risque faible. Continuez à maintenir un mode de vie sain et suivez les recommandations de dépistage standard selon votre âge. Un suivi régulier reste important.'
  }

  identifiedFactors.value = factors

  // Générer les recommandations d'examens
  generateRecommendations()
}

const generateRecommendations = () => {
  const recs = []

  // Mammographie
  let mammographyProb = 50
  if (formData.age >= 40) mammographyProb += 20
  if (formData.ant_familiaux === 1) mammographyProb += 15
  if (formData.ant_personnels === 1) mammographyProb += 10
  mammographyProb = Math.min(100, mammographyProb)

  recs.push({
    name: 'Mammographie',
    icon: '🔬',
    probability: mammographyProb,
    recommended: mammographyProb >= 70,
    urgency:
      mammographyProb >= 85
        ? 'Urgent - Dans les 2 semaines'
        : mammographyProb >= 70
          ? 'Recommandé - Sous 1 mois'
          : 'Suivi de routine',
  })

  // Échographie
  let echoProb = 40
  if (formData.age < 40) echoProb += 15
  if (formData.ant_personnels === 1) echoProb += 20
  echoProb = Math.min(100, echoProb)

  recs.push({
    name: 'Échographie mammaire',
    icon: '📡',
    probability: echoProb,
    recommended: echoProb >= 70,
    urgency:
      echoProb >= 85
        ? 'Urgent - Dans les 2 semaines'
        : echoProb >= 70
          ? 'Recommandé - Sous 1 mois'
          : 'Si nécessaire',
  })

  // IRM
  let irmProb = 20
  if (formData.ant_familiaux === 1) irmProb += 25
  if (riskScore.value >= 60) irmProb += 20
  irmProb = Math.min(100, irmProb)

  recs.push({
    name: 'IRM mammaire',
    icon: '🧲',
    probability: irmProb,
    recommended: irmProb >= 65,
    urgency:
      irmProb >= 80
        ? 'Recommandé - Sous 1 mois'
        : irmProb >= 65
          ? 'À considérer'
          : 'Non nécessaire actuellement',
  })

  // Consultation spécialisée
  let consultProb = 40
  if (riskScore.value >= 50) consultProb += 40
  if (formData.ant_familiaux === 1) consultProb += 15
  consultProb = Math.min(100, consultProb)

  recs.push({
    name: 'Consultation spécialisée',
    icon: '👨‍⚕️',
    probability: consultProb,
    recommended: consultProb >= 70,
    urgency:
      consultProb >= 85
        ? 'Urgent - Consulter rapidement'
        : consultProb >= 70
          ? 'Recommandé - Sous 2 mois'
          : 'Suivi de routine',
  })

  recommendations.value = recs
}

const resetForm = () => {
  formData.age = null
  formData.poids = null
  formData.taille = null
  formData.ant_familiaux = null
  formData.ant_personnels = null
  formData.age_premieres_regles = null
  formData.age_premier_enfant = null
  formData.nb_enfants = 0
  formData.mode_vie = ''
  formData.tabac = null
  formData.alcool = null
  formData.activite_physique = ''
}

const closeResults = () => {
  showResults.value = false
}

const downloadReport = () => {
  alert('La fonctionnalité de téléchargement du rapport sera bientôt disponible.')
  console.log('Génération du rapport pour:', {
    age: formData.age,
    risk: riskLevel.value,
    score: riskScore.value,
    factors: identifiedFactors.value,
    recommendations: recommendations.value,
  })
}
</script>

<style scoped>
.diagnostic-page {
  max-width: 900px;
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
  color: #2563eb;
  text-decoration: none;
  font-weight: 600;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
}

.back-link:hover {
  gap: 0.75rem;
  color: #1d4ed8;
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

/* Disclaimer Box */
.disclaimer-box {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: #fef3c7;
  border-left: 4px solid #f59e0b;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.disclaimer-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.disclaimer-content {
  flex: 1;
}

.disclaimer-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #92400e;
  margin-bottom: 0.5rem;
}

.disclaimer-text {
  color: #78350f;
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
  background: #2563eb;
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

/* Question Groups */
.question-group {
  margin-bottom: 2rem;
}

.question-group:last-child {
  margin-bottom: 0;
}

.question-label {
  display: block;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.75rem;
  font-size: 1rem;
}

.question-help {
  color: #64748b;
  font-size: 0.875rem;
  margin-top: -0.5rem;
  margin-bottom: 1rem;
  font-style: italic;
}

.required {
  color: #dc2626;
  font-weight: 700;
}

/* Form Inputs */
.form-input,
.form-select {
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
.form-select:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.form-select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2364748b' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  padding-right: 3rem;
}

/* Inline Inputs */
.inline-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.sub-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
}

.imc-display {
  margin-top: 1rem;
  padding: 1rem;
  background: #f1f5f9;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.imc-label {
  font-weight: 600;
  color: #475569;
}

.imc-value {
  font-weight: 800;
  color: #2563eb;
  font-size: 1.1rem;
}

/* Radio Groups - Vertical (Card Style) */
.radio-group-vertical {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.radio-option-card {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.25rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;
}

.radio-option-card:hover {
  border-color: #2563eb;
  background: #f8fafc;
}

.radio-option-card input[type='radio'] {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.radio-option-card input[type='radio']:checked ~ .radio-custom {
  border-color: #2563eb;
  background: #2563eb;
}

.radio-option-card input[type='radio']:checked ~ .radio-custom::after {
  opacity: 1;
}

.radio-option-card input[type='radio']:checked ~ .radio-text .radio-label {
  color: #2563eb;
}

.radio-custom {
  position: relative;
  width: 24px;
  height: 24px;
  border: 2px solid #cbd5e1;
  border-radius: 50%;
  transition: all 0.2s ease;
  flex-shrink: 0;
  margin-top: 2px;
}

.radio-custom::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  background: white;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.radio-text {
  flex: 1;
}

.radio-label {
  display: block;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.radio-description {
  display: block;
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.5;
}

/* Radio Groups - Horizontal (Inline Style) */
.radio-group-horizontal {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.radio-option-inline {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;
}

.radio-option-inline:hover {
  border-color: #2563eb;
  background: #f8fafc;
}

.radio-option-inline input[type='radio'] {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.radio-option-inline input[type='radio']:checked ~ .radio-custom {
  border-color: #2563eb;
  background: #2563eb;
}

.radio-option-inline input[type='radio']:checked ~ .radio-custom::after {
  opacity: 1;
}

.radio-option-inline input[type='radio']:checked ~ .radio-label {
  color: #2563eb;
  font-weight: 700;
}

.radio-option-inline .radio-custom {
  width: 20px;
  height: 20px;
  border: 2px solid #cbd5e1;
  border-radius: 50%;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.radio-option-inline .radio-custom::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.radio-option-inline .radio-label {
  font-weight: 600;
  color: #1e293b;
  font-size: 0.95rem;
}

/* Form Actions */
/* Message d'erreur */
.error-message {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: #fff5f5;
  border: 1px solid #feb2b2;
  border-radius: 8px;
  color: #c53030;
  font-weight: 600;
  margin-top: 1rem;
}

.error-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 2rem;
  border-top: 2px solid #e2e8f0;
  margin-top: 2rem;
  background: white;
  padding: 2rem;
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
  background: #2563eb;
  color: white;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
}

.btn-primary:hover:not(:disabled) {
  background: #1d4ed8;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
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
  color: #2563eb;
  border: 2px solid #2563eb;
}

.btn-outline:hover {
  background: #2563eb;
  color: white;
}

.btn-large {
  padding: 1.25rem 2.5rem;
  font-size: 1.1rem;
}

.btn-icon {
  font-size: 1.25rem;
}

.btn-arrow {
  font-size: 1.25rem;
  transition: transform 0.3s ease;
}

.btn:hover .btn-arrow {
  transform: translateX(5px);
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
  max-width: 800px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
}

.results-modal {
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

.result-container {
  text-align: center;
}

.result-icon {
  width: 120px;
  height: 120px;
  margin: 0 auto 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 4rem;
}

.result-icon.high-risk {
  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
  color: white;
}

.result-icon.moderate-risk {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

.result-icon.low-risk {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.result-title {
  font-size: 2rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 2rem;
}

/* Risk Score */
.risk-score {
  padding: 2rem;
  background: #f8fafc;
  border-radius: 12px;
  margin-bottom: 2rem;
}

.score-label {
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.5rem;
}

.score-value {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
}

.score-value.high {
  color: #dc2626;
}

.score-value.moderate {
  color: #f59e0b;
}

.score-value.low {
  color: #10b981;
}

.score-bar {
  width: 100%;
  height: 12px;
  background: #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
}

.score-fill {
  height: 100%;
  border-radius: 12px;
  transition: width 1s ease;
}

.score-fill.high {
  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
}

.score-fill.moderate {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.score-fill.low {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

/* Risk Factors */
.risk-factors {
  text-align: left;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 12px;
  margin-bottom: 2rem;
}

.factors-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
}

.icon {
  font-size: 1.5rem;
}

.factors-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.factor-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  border: 2px solid #e2e8f0;
}

.factor-icon {
  font-size: 1.75rem;
}

.factor-info {
  flex: 1;
}

.factor-name {
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.factor-impact {
  color: #64748b;
  font-size: 0.9rem;
}

/* Recommendations */
.recommendations {
  text-align: left;
  padding: 1.5rem;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border-radius: 12px;
  border-left: 4px solid #2563eb;
  margin-bottom: 2rem;
}

.recommendations-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1.5rem;
}

.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.recommendation-card {
  padding: 1rem;
  background: white;
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
}

.recommendation-card.recommended {
  border-color: #2563eb;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
}

.recommendation-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.recommendation-icon {
  font-size: 1.5rem;
}

.recommendation-name {
  font-weight: 700;
  color: #1e293b;
  font-size: 0.95rem;
}

.recommendation-probability {
  font-size: 1.25rem;
  font-weight: 800;
  color: #2563eb;
  margin-bottom: 0.5rem;
}

.recommendation-urgency {
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 600;
}

/* Advice Box */
.advice-box {
  text-align: left;
  padding: 1.5rem;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 12px;
  border-left: 4px solid #f59e0b;
  margin-bottom: 2rem;
}

.advice-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.75rem;
}

.advice-text {
  color: #78350f;
  line-height: 1.8;
}

/* Modal Actions */
.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

/* Disclaimer */
.disclaimer {
  padding: 1.5rem;
  background: #fef2f2;
  border-radius: 8px;
  border: 1px solid #fecaca;
  color: #7f1d1d;
  font-size: 0.9rem;
  line-height: 1.6;
  text-align: center;
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
  .diagnostic-page {
    padding: 1rem;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .form-section {
    padding: 1.5rem;
  }

  .inline-inputs {
    grid-template-columns: 1fr;
  }

  .radio-group-horizontal {
    flex-direction: column;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }

  .results-modal {
    padding: 2rem 1.5rem;
  }

  .result-icon {
    width: 100px;
    height: 100px;
    font-size: 3rem;
  }

  .result-title {
    font-size: 1.5rem;
  }

  .score-value {
    font-size: 2.5rem;
  }

  .recommendations-grid {
    grid-template-columns: 1fr;
  }

  .modal-actions {
    flex-direction: column;
  }
}
</style>
