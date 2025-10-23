<template>
  <div class="analyse-page">
    <!-- Header -->
    <div class="page-header">
      <RouterLink to="/diagnostic" class="back-link">
        <span class="back-icon">←</span>
        Retour au diagnostic
      </RouterLink>
      <h1 class="page-title">Analyse de Mammographie</h1>
      <p class="page-subtitle">Téléversez vos images de mammographie pour une analyse par IA</p>
    </div>

    <!-- Section d'upload -->
    <div v-if="!isAnalyzing && !showResults && !showRiskForm" class="upload-section">
      <div class="upload-container">
        <div class="upload-info">
          <div class="info-icon">📋</div>
          <h2 class="info-title">Consignes importantes</h2>
          <ul class="info-list">
            <li>✓ Images de mammographie uniquement (format DICOM, JPG, PNG)</li>
            <li>✓ Images claires et de bonne qualité</li>
            <li>✓ Vous pouvez téléverser plusieurs vues (CC et MLO)</li>
            <li>✓ Taille maximale par fichier : 10 MB</li>
          </ul>
        </div>

        <div
          class="drop-zone"
          :class="{ 'is-dragging': isDragging, 'has-files': uploadedImages.length > 0 }"
          @drop.prevent="handleDrop"
          @dragover.prevent="isDragging = true"
          @dragleave="isDragging = false"
        >
          <input
            type="file"
            ref="fileInput"
            @change="handleFileSelect"
            multiple
            accept="image/*,.dcm"
            class="file-input"
            id="imageUpload"
          />

          <div v-if="uploadedImages.length === 0" class="drop-zone-content">
            <div class="upload-icon-large">📤</div>
            <h3 class="upload-title">Glissez vos images ici</h3>
            <p class="upload-text">ou</p>
            <label for="imageUpload" class="upload-btn"> Parcourir les fichiers </label>
            <p class="upload-hint">Formats acceptés: JPG, PNG, DICOM</p>
          </div>

          <div v-else class="uploaded-images">
            <div v-for="(image, index) in uploadedImages" :key="index" class="image-preview">
              <img
                v-if="image.preview"
                :src="image.preview"
                :alt="image.name"
                class="preview-img"
              />
              <div v-else class="preview-placeholder">
                <span class="file-icon">📄</span>
                <span class="file-type">{{ getFileExtension(image.name) }}</span>
              </div>
              <div class="image-info">
                <span class="image-name">{{ image.name }}</span>
                <span class="image-size">{{ formatFileSize(image.size) }}</span>
              </div>
              <button type="button" @click="removeImage(index)" class="remove-btn">✕</button>
            </div>

            <label for="imageUpload" class="add-more-btn">
              <span class="add-icon">+</span>
              <span>Ajouter d'autres images</span>
            </label>
          </div>
        </div>

        <div v-if="uploadedImages.length > 0" class="action-buttons">
          <button @click="clearAll" class="btn btn-secondary">Tout supprimer</button>
          <button @click="showRiskFormStep" class="btn btn-primary btn-large">
            <span class="btn-icon">📝</span>
            Suivant: Informations de santé
            <span class="btn-arrow">→</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Section du formulaire de risque -->
    <div v-if="showRiskForm && !isAnalyzing && !showResults" class="risk-form-section">
      <div class="form-container">
        <div class="form-header">
          <button @click="backToUpload" class="back-link">
            <span class="back-icon">←</span>
            Retour aux images
          </button>
          <h2 class="form-title">Informations de Santé</h2>
          <p class="form-subtitle">
            Ces informations nous aident à évaluer votre risque de cancer du sein
          </p>
        </div>

        <form @submit.prevent="submitForm" class="risk-form">
          <!-- Age -->
          <div class="form-group">
            <label for="age" class="form-label">
              <span class="label-icon">🎂</span>
              Âge
              <span class="required">*</span>
            </label>
            <input
              type="number"
              id="age"
              v-model.number="formData.age"
              min="18"
              max="120"
              required
              class="form-input"
              placeholder="Ex: 45"
            />
          </div>

          <!-- IMC -->
          <div class="form-group">
            <label for="imc" class="form-label">
              <span class="label-icon">⚖️</span>
              Indice de Masse Corporelle (IMC)
              <span class="required">*</span>
            </label>
            <input
              type="number"
              id="imc"
              v-model.number="formData.imc"
              min="10"
              max="60"
              step="0.1"
              required
              class="form-input"
              placeholder="Ex: 24.5"
            />
            <small class="form-hint">Calculé à partir de votre poids et taille</small>
          </div>

          <!-- Antécédents familiaux -->
          <div class="form-group">
            <label for="ant_familiaux" class="form-label">
              <span class="label-icon">👨‍👩‍👧‍👦</span>
              Antécédents familiaux de cancer du sein
              <span class="required">*</span>
            </label>
            <select id="ant_familiaux" v-model="formData.ant_familiaux" required class="form-select">
              <option value="" disabled>Sélectionnez une option</option>
              <option value="0">Non, aucun antécédent</option>
              <option value="1">Oui, dans ma famille</option>
            </select>
          </div>

          <!-- Mutations génétiques -->
          <div class="form-group">
            <label for="mutations_genetiques" class="form-label">
              <span class="label-icon">🧬</span>
              Statut génétique / Mutations (BRCA1, BRCA2)
              <span class="required">*</span>
            </label>
            <select
              id="mutations_genetiques"
              v-model="formData.mutations_genetiques"
              required
              class="form-select"
            >
              <option value="" disabled>Sélectionnez une option</option>
              <option value="0">Sain (aucune mutation détectée)</option>
              <option value="1">Mutations détectées (BRCA1/BRCA2)</option>
            </select>
          </div>

          <!-- Mode de vie -->
          <div class="form-group">
            <label for="mode_vie" class="form-label">
              <span class="label-icon">🏃‍♀️</span>
              Mode de vie / Niveau de risque
              <span class="required">*</span>
            </label>
            <select id="mode_vie" v-model="formData.mode_vie" required class="form-select">
              <option value="" disabled>Sélectionnez une option</option>
              <option value="sain">Sain (mode de vie équilibré)</option>
              <option value="modéré">Modéré (quelques facteurs de risque)</option>
              <option value="à risque">À risque (plusieurs facteurs de risque)</option>
            </select>
          </div>

          <!-- Densité mammaire -->
          <div class="form-group">
            <label for="densite_mammaire" class="form-label">
              <span class="label-icon">🔬</span>
              Densité mammaire (Classification BI-RADS)
              <span class="required">*</span>
            </label>
            <select
              id="densite_mammaire"
              v-model="formData.densite_mammaire"
              required
              class="form-select"
            >
              <option value="" disabled>Sélectionnez une option</option>
              <option value="A">A - Presque entièrement graisseuse</option>
              <option value="B">B - Densités fibroglandulaires dispersées</option>
              <option value="C">C - Densité hétérogène</option>
              <option value="D">D - Extrêmement dense</option>
            </select>
          </div>

          <!-- Tabac -->
          <div class="form-group">
            <label for="tabac" class="form-label">
              <span class="label-icon">🚬</span>
              Consommation de tabac
              <span class="required">*</span>
            </label>
            <select id="tabac" v-model="formData.tabac" required class="form-select">
              <option value="" disabled>Sélectionnez une option</option>
              <option value="0">Non-fumeur</option>
              <option value="1">Fumeur occasionnel</option>
              <option value="2">Fumeur régulier</option>
            </select>
          </div>

          <!-- Alcool -->
          <div class="form-group">
            <label for="alcool" class="form-label">
              <span class="label-icon">🍷</span>
              Consommation d'alcool
              <span class="required">*</span>
            </label>
            <select id="alcool" v-model="formData.alcool" required class="form-select">
              <option value="" disabled>Sélectionnez une option</option>
              <option value="0">Jamais ou rarement</option>
              <option value="1">Occasionnellement (1-3 verres/semaine)</option>
              <option value="2">Régulièrement (4-7 verres/semaine)</option>
              <option value="3">Fréquemment (>7 verres/semaine)</option>
            </select>
          </div>

          <!-- Score de risque (affiché après calcul) -->
          <div v-if="formData.score_risque !== null" class="form-group score-display">
            <div class="risk-score-card">
              <div class="score-header">
                <span class="label-icon">📊</span>
                <span class="score-label">Score de risque calculé</span>
              </div>
              <div class="score-value-large">{{ formData.score_risque.toFixed(2) }}%</div>
              <div class="score-bar-container">
                <div
                  class="score-bar-fill"
                  :style="{ width: `${Math.min(formData.score_risque, 100)}%` }"
                  :class="getRiskClass(formData.score_risque)"
                ></div>
              </div>
              <small class="form-hint">Ce score sera utilisé dans l'analyse complète</small>
            </div>
          </div>

          <!-- Boutons d'action -->
          <div class="form-actions">
            <button type="button" @click="backToUpload" class="btn btn-secondary">Annuler</button>
            <button
              v-if="formData.score_risque === null"
              type="button"
              @click="formData.score_risque = calculateRiskScore()"
              class="btn btn-outline"
            >
              <span class="btn-icon">📊</span>
              Calculer le score de risque
            </button>
            <button type="submit" class="btn btn-primary btn-large">
              <span class="btn-icon">🔬</span>
              Lancer l'analyse
              <span class="btn-arrow">→</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Section d'analyse en cours -->
    <div v-if="isAnalyzing" class="analyzing-section">
      <div class="analyzing-container">
        <div class="analyzing-animation">
          <div class="pulse-ring"></div>
          <div class="pulse-ring delay-1"></div>
          <div class="pulse-ring delay-2"></div>
          <div class="analyzing-icon">🔬</div>
        </div>
        <h2 class="analyzing-title">Analyse en cours...</h2>
        <p class="analyzing-text">
          Notre intelligence artificielle analyse vos images de mammographie
        </p>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${analysisProgress}%` }"></div>
        </div>
        <div class="progress-text">{{ analysisProgress }}%</div>
      </div>
    </div>

    <!-- Section des résultats -->
    <div v-if="showResults" class="results-section">
      <div class="results-container">
        <!-- Résultat: Cancer Détecté -->
        <div v-if="predictionResult === 'cancer'" class="result-card cancer-detected">
          <div class="result-header">
            <div class="result-icon danger">⚠️</div>
            <h2 class="result-title">Anomalie Détectée</h2>
          </div>

          <div class="result-body">
            <div class="confidence-score">
              <div class="score-label">Confiance du modèle</div>
              <div class="score-value danger">{{ confidence }}%</div>
              <div class="score-bar">
                <div class="score-fill danger" :style="{ width: `${confidence}%` }"></div>
              </div>
            </div>

            <div class="result-description">
              <p>
                Notre modèle d'intelligence artificielle a détecté des anomalies suspectes dans vos
                images de mammographie. La confiance du modèle est de
                <strong>{{ confidence }}%</strong>.
              </p>
            </div>

            <div class="alert-box danger">
              <div class="alert-icon">🏥</div>
              <div class="alert-content">
                <h3 class="alert-title">Action Urgente Requise</h3>
                <p class="alert-text">
                  Nous vous recommandons fortement de consulter un médecin spécialiste dans les plus
                  brefs délais pour une évaluation approfondie et des examens complémentaires.
                </p>
              </div>
            </div>

            <div class="detected-regions">
              <h3 class="regions-title">
                <span class="icon">📍</span>
                Régions suspectes identifiées
              </h3>
              <div class="regions-list">
                <div v-for="(region, index) in detectedRegions" :key="index" class="region-item">
                  <span class="region-number">{{ index + 1 }}</span>
                  <div class="region-info">
                    <div class="region-name">{{ region.name }}</div>
                    <div class="region-confidence">Confiance: {{ region.confidence }}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Résultat: Pas de Cancer -->
        <div v-else class="result-card no-cancer">
          <div class="result-header">
            <div class="result-icon success">✓</div>
            <h2 class="result-title">Aucune Anomalie Détectée</h2>
          </div>

          <div class="result-body">
            <div class="confidence-score">
              <div class="score-label">Confiance du modèle</div>
              <div class="score-value success">{{ confidence }}%</div>
              <div class="score-bar">
                <div class="score-fill success" :style="{ width: `${confidence}%` }"></div>
              </div>
            </div>

            <div class="result-description">
              <p>
                Notre modèle d'intelligence artificielle n'a détecté aucune anomalie significative
                dans vos images de mammographie. La confiance du modèle est de
                <strong>{{ confidence }}%</strong>.
              </p>
            </div>

            <div class="alert-box success">
              <div class="alert-icon">✓</div>
              <div class="alert-content">
                <h3 class="alert-title">Résultat Rassurant</h3>
                <p class="alert-text">
                  Les images analysées ne présentent pas de signes évidents de cancer. Cependant,
                  nous vous recommandons de continuer vos examens de dépistage réguliers selon les
                  recommandations de votre médecin.
                </p>
              </div>
            </div>

            <div class="reminder-box">
              <h3 class="reminder-title">
                <span class="icon">💡</span>
                Rappel Important
              </h3>
              <p class="reminder-text">
                Cette analyse par IA est un outil d'aide au diagnostic. Elle ne remplace pas l'avis
                d'un professionnel de santé qualifié. Consultez toujours votre médecin pour
                interpréter ces résultats.
              </p>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="result-actions">
          <button @click="downloadReport" class="btn btn-outline">
            <span class="btn-icon">📥</span>
            Télécharger le rapport
          </button>
          <button @click="resetAnalysis" class="btn btn-secondary">Nouvelle analyse</button>
          <RouterLink to="/" class="btn btn-primary"> Retour à l'accueil </RouterLink>
        </div>

        <!-- Disclaimer -->
        <div class="disclaimer">
          <p>
            <strong>Avertissement :</strong> Cette analyse est fournie à titre informatif
            uniquement. Elle ne constitue pas un diagnostic médical et ne remplace pas la
            consultation d'un professionnel de santé. Consultez toujours votre médecin pour toute
            question concernant votre santé.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const fileInput = ref(null)
const uploadedImages = ref([])
const isDragging = ref(false)
const isAnalyzing = ref(false)
const showResults = ref(false)
const showRiskForm = ref(false)
const analysisProgress = ref(0)
const predictionResult = ref('') // 'cancer' or 'no-cancer'
const confidence = ref(0)
const detectedRegions = ref([])

// Données du formulaire de risque
const formData = ref({
  age: null,
  imc: null,
  ant_familiaux: null, // 0 ou 1
  ant_personnels: null, // 0 ou 1
  age_premieres_regles: null,
  age_premier_enfant: null,
  nb_enfants: 0,
  mode_vie: '', // "sain", "modéré", "à risque"
  tabac: null, // 0 ou 1
  alcool: null, // 0 ou 1
  activite_physique: '', // "faible", "moyen", "élevé"
})

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)
  processFiles(files)
}

const handleDrop = (event) => {
  isDragging.value = false
  const files = Array.from(event.dataTransfer.files)
  processFiles(files)
}

const processFiles = (files) => {
  files.forEach((file) => {
    if (file.size > 10 * 1024 * 1024) {
      alert(`Le fichier ${file.name} dépasse 10 MB`)
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      uploadedImages.value.push({
        file: file,
        name: file.name,
        size: file.size,
        preview: file.type.startsWith('image/') ? e.target.result : null,
      })
    }
    reader.readAsDataURL(file)
  })
}

const removeImage = (index) => {
  uploadedImages.value.splice(index, 1)
}

const clearAll = () => {
  uploadedImages.value = []
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const getFileExtension = (filename) => {
  return filename.split('.').pop().toUpperCase()
}

const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

const showRiskFormStep = () => {
  showRiskForm.value = true
}

const backToUpload = () => {
  showRiskForm.value = false
}

const calculateRiskScore = () => {
  // Algorithme simplifié de calcul du score de risque
  // Basé sur les facteurs de risque fournis
  let score = 0

  // Facteur âge (0-20 points)
  if (formData.value.age) {
    if (formData.value.age < 40) score += 3
    else if (formData.value.age < 50) score += 8
    else if (formData.value.age < 60) score += 15
    else score += 20
  }

  // Facteur IMC (0-10 points)
  if (formData.value.imc) {
    if (formData.value.imc < 25) score += 2
    else if (formData.value.imc < 30) score += 5
    else score += 10
  }

  // Antécédents familiaux (0-15 points)
  if (formData.value.ant_familiaux === 1) score += 15

  // Antécédents personnels (0-15 points)
  if (formData.value.ant_personnels === 1) score += 15

  // Âge premières règles (0-8 points)
  if (formData.value.age_premieres_regles && formData.value.age_premieres_regles <= 11) {
    score += 8
  }

  // Âge premier enfant (0-10 points)
  if (formData.value.age_premier_enfant === 0 && formData.value.age >= 30) {
    score += 10
  } else if (formData.value.age_premier_enfant >= 35) {
    score += 7
  }

  // Nombre d'enfants (bonus si élevé)
  if (formData.value.nb_enfants >= 3) {
    score -= 3
  }

  // Mode de vie (0-10 points)
  if (formData.value.mode_vie === 'sain') score += 2
  else if (formData.value.mode_vie === 'modéré') score += 6
  else if (formData.value.mode_vie === 'à risque') score += 10

  // Tabac (0-7 points)
  if (formData.value.tabac === 1) score += 7

  // Alcool (0-6 points)
  if (formData.value.alcool === 1) score += 6

  // Activité physique (bonus si élevée)
  if (formData.value.activite_physique === 'élevé') score -= 5
  else if (formData.value.activite_physique === 'faible') score += 5

  return Math.max(0, score)
}

const getRiskClass = (score) => {
  if (score < 20) return 'risk-low'
  if (score < 40) return 'risk-medium'
  return 'risk-high'
}

const submitForm = async () => {
  // Calculer le score de risque avant de soumettre
  formData.value.score_risque = calculateRiskScore()

  // Validation du formulaire
  console.log('Données du formulaire:', formData.value)
  console.log('Images à analyser:', uploadedImages.value)

  // Lancer l'analyse avec les données du formulaire et les images
  startAnalysis()
}

const startAnalysis = async () => {
  isAnalyzing.value = true
  showRiskForm.value = false
  analysisProgress.value = 0

  // Simuler la progression
  const progressInterval = setInterval(() => {
    analysisProgress.value += 10
    if (analysisProgress.value >= 100) {
      clearInterval(progressInterval)
    }
  }, 300)

  // Simuler l'appel à l'API du modèle d'analyse d'images
  await new Promise((resolve) => setTimeout(resolve, 3500))

  // Ici vous appellerez votre API d'analyse d'images avec les données du formulaire
  // const apiFormData = new FormData()
  // uploadedImages.value.forEach((img, index) => {
  //   apiFormData.append(`image_${index}`, img.file)
  // })
  // // Ajouter les données de risque
  // apiFormData.append('age', formData.value.age)
  // apiFormData.append('imc', formData.value.imc)
  // apiFormData.append('ant_familiaux', formData.value.ant_familiaux)
  // apiFormData.append('mutations_genetiques', formData.value.mutations_genetiques)
  // apiFormData.append('mode_vie', formData.value.mode_vie)
  // apiFormData.append('densite_mammaire', formData.value.densite_mammaire)
  // apiFormData.append('tabac', formData.value.tabac)
  // apiFormData.append('alcool', formData.value.alcool)
  // apiFormData.append('score_risque', formData.value.score_risque)
  //
  // const response = await fetch('/api/analyze-mammography', {
  //   method: 'POST',
  //   body: apiFormData
  // })
  // const result = await response.json()

  // Simulation de résultat aléatoire
  const randomResult = Math.random()

  if (randomResult > 0.6) {
    // Cancer détecté
    predictionResult.value = 'cancer'
    confidence.value = Math.floor(Math.random() * 20) + 75 // 75-95%
    detectedRegions.value = [
      { name: 'Quadrant supérieur externe droit', confidence: 87 },
      { name: 'Région rétro-aréolaire gauche', confidence: 72 },
    ]
  } else {
    // Pas de cancer
    predictionResult.value = 'no-cancer'
    confidence.value = Math.floor(Math.random() * 15) + 80 // 80-95%
  }

  console.log('Images envoyées au modèle:', uploadedImages.value)
  console.log('Résultat de prédiction:', predictionResult.value)

  isAnalyzing.value = false
  showResults.value = true
}

const downloadReport = () => {
  // Générer et télécharger le rapport PDF
  alert('Fonctionnalité de téléchargement du rapport à implémenter')
  console.log('Génération du rapport pour:', predictionResult.value)
}

const resetAnalysis = () => {
  uploadedImages.value = []
  showResults.value = false
  showRiskForm.value = false
  analysisProgress.value = 0
  predictionResult.value = ''
  confidence.value = 0
  detectedRegions.value = []
  // Réinitialiser le formulaire
  formData.value = {
    age: null,
    imc: null,
    ant_familiaux: null,
    ant_personnels: null,
    age_premieres_regles: null,
    age_premier_enfant: null,
    nb_enfants: 0,
    mode_vie: '',
    tabac: null,
    alcool: null,
    activite_physique: '',
  }
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
</script>

<style scoped>
.analyse-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
}

/* Header */
.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  margin-bottom: 2rem;
  transition: all 0.3s ease;
}

.back-link:hover {
  gap: 0.75rem;
}

.back-icon {
  font-size: 1.25rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #2d3748;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #718096;
}

/* Upload Section */
.upload-section {
  max-width: 900px;
  margin: 0 auto;
}

.upload-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.upload-info {
  background: linear-gradient(135deg, #667eea10 0%, #764ba210 100%);
  padding: 2rem;
  border-radius: 20px;
  border-left: 4px solid #667eea;
}

.info-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.info-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 1rem;
}

.info-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-list li {
  color: #4a5568;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Drop Zone */
.drop-zone {
  background: white;
  border: 3px dashed #cbd5e0;
  border-radius: 20px;
  padding: 3rem;
  transition: all 0.3s ease;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.drop-zone.is-dragging {
  border-color: #667eea;
  background: linear-gradient(135deg, #667eea05 0%, #764ba205 100%);
  transform: scale(1.02);
}

.drop-zone.has-files {
  padding: 2rem;
  min-height: auto;
}

.file-input {
  display: none;
}

.drop-zone-content {
  text-align: center;
  width: 100%;
}

.upload-icon-large {
  font-size: 5rem;
  margin-bottom: 1.5rem;
  opacity: 0.5;
}

.upload-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 1rem;
}

.upload-text {
  color: #718096;
  margin-bottom: 1.5rem;
}

.upload-btn {
  display: inline-block;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.upload-hint {
  margin-top: 1rem;
  color: #a0aec0;
  font-size: 0.9rem;
}

/* Uploaded Images */
.uploaded-images {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

.image-preview {
  position: relative;
  background: #f7fafc;
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
}

.preview-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.preview-placeholder {
  width: 100%;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #edf2f7;
}

.file-icon {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.file-type {
  font-weight: 700;
  color: #667eea;
  font-size: 1.1rem;
}

.image-info {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.image-name {
  font-weight: 600;
  color: #2d3748;
  font-size: 0.9rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.image-size {
  color: #a0aec0;
  font-size: 0.85rem;
}

.remove-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 32px;
  height: 32px;
  background: rgba(245, 101, 101, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-weight: 800;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-btn:hover {
  background: #f56565;
  transform: scale(1.1);
}

.add-more-btn {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: 3px dashed #cbd5e0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #667eea;
  font-weight: 600;
}

.add-more-btn:hover {
  border-color: #667eea;
  background: linear-gradient(135deg, #667eea05 0%, #764ba205 100%);
}

.add-icon {
  font-size: 2rem;
  font-weight: 300;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn {
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
}

.btn-secondary:hover {
  background: #667eea;
  color: white;
}

.btn-outline {
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
}

.btn-outline:hover {
  background: #667eea;
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

/* Analyzing Section */
.analyzing-section {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

.analyzing-container {
  text-align: center;
  max-width: 500px;
}

.analyzing-animation {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto 2rem;
}

.pulse-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  border: 3px solid #667eea;
  border-radius: 50%;
  animation: pulse 2s ease-out infinite;
}

.pulse-ring.delay-1 {
  animation-delay: 0.5s;
}

.pulse-ring.delay-2 {
  animation-delay: 1s;
}

@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(0.5);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 0;
  }
}

.analyzing-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  animation: rotate 3s linear infinite;
}

@keyframes rotate {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

.analyzing-title {
  font-size: 2rem;
  font-weight: 800;
  color: #2d3748;
  margin-bottom: 1rem;
}

.analyzing-text {
  font-size: 1.1rem;
  color: #718096;
  margin-bottom: 2rem;
}

.progress-bar {
  width: 100%;
  height: 12px;
  background: #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s ease;
  border-radius: 12px;
}

.progress-text {
  font-size: 1.5rem;
  font-weight: 800;
  color: #667eea;
}

/* Results Section */
.results-section {
  max-width: 900px;
  margin: 0 auto;
}

.results-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.result-card {
  background: white;
  border-radius: 24px;
  padding: 3rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.result-header {
  text-align: center;
  margin-bottom: 2rem;
}

.result-icon {
  width: 120px;
  height: 120px;
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 4rem;
}

.result-icon.danger {
  background: linear-gradient(135deg, #f56565 0%, #c53030 100%);
  color: white;
}

.result-icon.success {
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
}

.result-title {
  font-size: 2rem;
  font-weight: 800;
  color: #2d3748;
}

.result-body {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.confidence-score {
  text-align: center;
  padding: 2rem;
  background: #f7fafc;
  border-radius: 16px;
}

.score-label {
  font-size: 0.9rem;
  color: #718096;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 1rem;
}

.score-value {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
}

.score-value.danger {
  color: #f56565;
}

.score-value.success {
  color: #48bb78;
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

.score-fill.danger {
  background: linear-gradient(135deg, #f56565 0%, #c53030 100%);
}

.score-fill.success {
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
}

.result-description {
  color: #4a5568;
  font-size: 1.1rem;
  line-height: 1.8;
}

.alert-box {
  padding: 1.5rem;
  border-radius: 16px;
  display: flex;
  gap: 1rem;
  border-left: 4px solid;
}

.alert-box.danger {
  background: linear-gradient(135deg, #f5656510 0%, #c5303010 100%);
  border-color: #f56565;
}

.alert-box.success {
  background: linear-gradient(135deg, #48bb7810 0%, #38a16910 100%);
  border-color: #48bb78;
}

.alert-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.alert-content {
  flex: 1;
}

.alert-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.alert-text {
  color: #4a5568;
  line-height: 1.6;
}

.detected-regions {
  padding: 1.5rem;
  background: #f7fafc;
  border-radius: 16px;
}

.regions-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 1rem;
}

.icon {
  font-size: 1.5rem;
}

.regions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.region-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
}

.region-number {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f56565 0%, #c53030 100%);
  color: white;
  border-radius: 50%;
  font-weight: 800;
  flex-shrink: 0;
}

.region-info {
  flex: 1;
}

.region-name {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.25rem;
}

.region-confidence {
  color: #718096;
  font-size: 0.9rem;
}

.reminder-box {
  padding: 1.5rem;
  background: linear-gradient(135deg, #667eea10 0%, #764ba210 100%);
  border-radius: 16px;
  border-left: 4px solid #667eea;
}

.reminder-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.75rem;
}

.reminder-text {
  color: #4a5568;
  line-height: 1.6;
}

.result-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.disclaimer {
  padding: 1.5rem;
  background: #fff5f5;
  border-radius: 12px;
  border: 1px solid #feb2b2;
  color: #742a2a;
  font-size: 0.9rem;
  line-height: 1.6;
  text-align: center;
}

/* Risk Form Section */
.risk-form-section {
  max-width: 800px;
  margin: 0 auto;
}

.form-container {
  background: white;
  border-radius: 24px;
  padding: 3rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.risk-score-card {
  background: linear-gradient(135deg, #667eea10 0%, #764ba210 100%);
  padding: 2rem;
  border-radius: 16px;
  border: 2px solid #667eea;
  text-align: center;
}

.score-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.score-label {
  font-weight: 700;
  color: #2d3748;
  font-size: 1.1rem;
}

.score-value-large {
  font-size: 3rem;
  font-weight: 800;
  color: #667eea;
  margin-bottom: 1rem;
}

.score-bar-container {
  width: 100%;
  height: 12px;
  background: #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.score-bar-fill {
  height: 100%;
  border-radius: 12px;
  transition: width 0.5s ease, background 0.3s ease;
}

.score-bar-fill.risk-low {
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
}

.score-bar-fill.risk-medium {
  background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%);
}

.score-bar-fill.risk-high {
  background: linear-gradient(135deg, #f56565 0%, #c53030 100%);
}

.form-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.form-title {
  font-size: 2rem;
  font-weight: 800;
  color: #2d3748;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.form-subtitle {
  font-size: 1.1rem;
  color: #718096;
}

.risk-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #2d3748;
  font-size: 1rem;
}

.label-icon {
  font-size: 1.25rem;
}

.required {
  color: #f56565;
  font-weight: 700;
}

.form-input,
.form-select {
  padding: 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  font-family: inherit;
  color: #2d3748;
  transition: all 0.3s ease;
  background: white;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input::placeholder {
  color: #a0aec0;
}

.form-select {
  cursor: pointer;
}

.form-hint {
  color: #a0aec0;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
  padding-top: 1.5rem;
  border-top: 2px solid #e2e8f0;
}

/* Responsive */
@media (max-width: 768px) {
  .analyse-page {
    padding: 1rem;
  }

  .page-title {
    font-size: 2rem;
  }

  .upload-info {
    padding: 1.5rem;
  }

  .drop-zone {
    padding: 2rem;
    min-height: 300px;
  }

  .uploaded-images {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }

  .result-card {
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

  .result-actions {
    flex-direction: column;
  }

  .form-container {
    padding: 2rem 1.5rem;
  }

  .form-title {
    font-size: 1.5rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .form-actions .btn {
    width: 100%;
  }
}
</style>
