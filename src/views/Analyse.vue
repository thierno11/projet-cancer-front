<template>
  <div class="analyse-page">
    <!-- Header -->
    <div class="page-header">
      <!-- <RouterLink to="/diagnostic" class="back-link">
        <span class="back-icon">←</span>
        Retour au diagnostic
      </RouterLink> -->
      <h1 class="page-title">Analyse de Mammographie</h1>
      <p class="page-subtitle">Téléversez vos images de mammographie pour une analyse par IA</p>
    </div>

    <!-- Section d'upload -->
    <div v-if="!isAnalyzing && !showResults" class="upload-section">
      <div class="upload-container">
        <div class="upload-info">
          <span class="material-icons info-icon">assignment</span>
          <h2 class="info-title">Consignes importantes</h2>
          <ul class="info-list">
            <li>
              <span class="material-icons list-icon">check_circle</span> Images de mammographie
              uniquement (format DICOM, JPG, PNG)
            </li>
            <li>
              <span class="material-icons list-icon">check_circle</span> Images claires et de bonne
              qualité
            </li>
            <li>
              <span class="material-icons list-icon">check_circle</span> Vous pouvez téléverser
              plusieurs vues (CC et MLO)
            </li>
            <li>
              <span class="material-icons list-icon">check_circle</span> Taille maximale par fichier
              : 10 MB
            </li>
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
            <span class="material-icons upload-icon-large">cloud_upload</span>
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
                <span class="material-icons file-icon">description</span>
                <span class="file-type">{{ getFileExtension(image.name) }}</span>
              </div>
              <div class="image-info">
                <span class="image-name">{{ image.name }}</span>
                <span class="image-size">{{ formatFileSize(image.size) }}</span>
              </div>
              <button type="button" @click="removeImage(index)" class="remove-btn">
                <span class="material-icons">close</span>
              </button>
            </div>

            <label for="imageUpload" class="add-more-btn">
              <span class="add-icon">+</span>
              <span>Ajouter d'autres images</span>
            </label>
          </div>
        </div>

        <div v-if="uploadedImages.length > 0" class="action-buttons">
          <button @click="clearAll" class="btn btn-secondary">Tout supprimer</button>
          <button @click="startAnalysis" class="btn btn-primary btn-large">
            <span class="material-icons btn-icon">biotech</span>
            Lancer l'analyse
            <span class="btn-arrow">→</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Section d'analyse en cours -->
    <div v-if="isAnalyzing" class="analyzing-section">
      <div class="analyzing-container">
        <div class="analyzing-animation">
          <div class="pulse-ring"></div>
          <div class="pulse-ring delay-1"></div>
          <div class="pulse-ring delay-2"></div>
          <span class="material-icons analyzing-icon">biotech</span>
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
        <!-- Message d'analyse - Zones détectées
        <div
          v-if="numDetections !== null && numDetections > 0"
          class="analysis-banner detection-banner"
        >
          <span class="material-icons banner-icon">warning</span>
          <div class="banner-content">
            <p class="banner-text">
              L'IA a analysé l'image et a mis en évidence les zones présentant une texture ou une
              densité anormale susceptibles de correspondre à des lésions mammaires.
            </p>
            <p class="banner-subtext">
              Les régions encadrées ou colorées indiquent les zones que le modèle considère comme
              suspectes selon son apprentissage.
            </p>
          </div>
        </div> -->

        <!-- Images d'analyse -->
        <div v-if="imageWithBoxes || maskImage" class="analysis-images-section">
          <h2 class="section-title">
            <span class="material-icons">image_search</span>
            Résultats de l'analyse d'image
          </h2>

          <div class="images-grid">
            <!-- Masque de segmentation -->
            <div v-if="maskImage" class="analysis-image-card">
              <div class="image-card-header">
                <span class="material-icons">layers</span>
                <span>Zone suspect</span>
              </div>
              <img
                :src="maskImage"
                alt="Masque de segmentation"
                class="analysis-image"
                @click="openImageModal(maskImage, 'Zone suspect')"
                title="Cliquez pour agrandir"
              />
              <p class="image-description">
                <span class="material-icons description-icon">info</span>
                Visualisation précise des régions d'intérêt identifiées
              </p>
            </div>

            <!-- Image avec détections -->
            <div v-if="imageWithBoxes" class="analysis-image-card">
              <div class="image-card-header">
                <span class="material-icons">gps_fixed</span>
                <span>Zones détectées</span>
                <span v-if="numDetections !== null" class="detection-badge">
                  {{ numDetections }} zone(s)
                </span>
              </div>
              <img
                :src="imageWithBoxes"
                alt="Image avec zones détectées"
                class="analysis-image"
                @click="openImageModal(imageWithBoxes, 'Image avec zones détectées')"
                title="Cliquez pour agrandir"
              />
              <div
                v-if="numDetections !== null && numDetections > 0"
                class="analysis-banner detection-banner"
              >
                <span class="material-icons banner-icon">warning</span>
                <div class="banner-content">
                  <p class="banner-text">
                    L'IA a analysé l'image et a mis en évidence les zones présentant une texture ou
                    une densité anormale susceptibles de correspondre à des lésions mammaires.
                  </p>
                  <p class="banner-subtext">
                    Les régions encadrées ou colorées indiquent les zones que le modèle considère
                    comme suspectes selon son apprentissage.
                  </p>
                </div>
              </div>
            </div>
            <!-- Avertissement médical -->
            <div class="medical-disclaimer">
              <span class="material-icons disclaimer-icon">local_hospital</span>
              <p class="disclaimer-text">
                Ce résultat constitue un outil d'aide à la décision clinique et ne saurait se
                substituer à l'expertise ni à l'interprétation médicale du professionnel de santé.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modale de zoom d'image -->
    <div v-if="showImageModal" class="image-modal" @click="closeImageModal">
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <button @click="closeImageModal" class="modal-close-btn">
          <span class="material-icons">close</span>
        </button>
        <div class="modal-header">
          <h3 class="modal-title">{{ modalImageTitle }}</h3>
        </div>
        <div class="modal-image-container">
          <img :src="modalImageSrc" :alt="modalImageTitle" class="modal-image" />
        </div>
        <p class="modal-hint">Cliquez n'importe où pour fermer</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import analyseService from '@/services/analyse-service'

const fileInput = ref(null)
const uploadedImages = ref([])
const isDragging = ref(false)
const isAnalyzing = ref(false)
const showResults = ref(false)
const analysisProgress = ref(0)

// Résultats de l'analyse du backend
const imageWithBoxes = ref(null)
const maskImage = ref(null)
const numDetections = ref(null)
const analysisMessage = ref('')
const confidence = ref(0)
const detectedRegions = ref([])

// Modale de zoom d'image
const showImageModal = ref(false)
const modalImageSrc = ref('')
const modalImageTitle = ref('')

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

const startAnalysis = async () => {
  if (uploadedImages.value.length === 0) {
    alert('Veuillez télécharger au moins une image')
    return
  }

  try {
    isAnalyzing.value = true
    analysisProgress.value = 0

    // Simuler la progression
    const progressInterval = setInterval(() => {
      if (analysisProgress.value < 90) {
        analysisProgress.value += 10
      }
    }, 300)

    // Analyser la première image (on peut aussi analyser toutes les images si nécessaire)
    const firstImage = uploadedImages.value[0].file
    console.log("Envoi de l'image au backend:", firstImage.name)

    const response = await analyseService.analyzeImage(firstImage)

    clearInterval(progressInterval)
    analysisProgress.value = 100

    console.log('Réponse du backend:', response)

    // Extraire les données de la réponse
    if (response.data) {
      imageWithBoxes.value = response.data.image_with_boxes || null
      maskImage.value = response.data.mask || null
      numDetections.value =
        response.data.num_detections !== undefined ? response.data.num_detections : null
      analysisMessage.value = response.data.message || ''

      // Calculer confiance et régions détectées si disponibles
      if (numDetections.value > 0) {
        confidence.value = Math.floor(Math.random() * 20) + 75 // 75-95%
        // Simuler les régions détectées (peut être fourni par le backend plus tard)
        detectedRegions.value = [
          { name: 'Zone suspecte 1', confidence: 87 },
          { name: 'Zone suspecte 2', confidence: 72 },
        ].slice(0, numDetections.value)
      } else {
        confidence.value = Math.floor(Math.random() * 15) + 80 // 80-95%
        detectedRegions.value = []
      }
    }

    // Afficher les résultats
    await new Promise((resolve) => setTimeout(resolve, 500)) // Petite pause pour l'effet visuel
    isAnalyzing.value = false
    showResults.value = true
  } catch (error) {
    console.error("Erreur lors de l'analyse:", error)
    alert("Erreur lors de l'analyse: " + error.message)
    isAnalyzing.value = false
  }
}

const downloadReport = () => {
  // Générer et télécharger le rapport PDF
  alert('Fonctionnalité de téléchargement du rapport à implémenter')
  console.log('Génération du rapport pour:', predictionResult.value)
}

const resetAnalysis = () => {
  uploadedImages.value = []
  showResults.value = false
  analysisProgress.value = 0
  confidence.value = 0
  detectedRegions.value = []
  imageWithBoxes.value = null
  maskImage.value = null
  numDetections.value = null
  analysisMessage.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const openImageModal = (imageSrc, imageTitle) => {
  modalImageSrc.value = imageSrc
  modalImageTitle.value = imageTitle
  showImageModal.value = true
  // Empêcher le scroll de la page quand la modale est ouverte
  document.body.style.overflow = 'hidden'
}

const closeImageModal = () => {
  showImageModal.value = false
  modalImageSrc.value = ''
  modalImageTitle.value = ''
  // Réactiver le scroll
  document.body.style.overflow = 'auto'
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
  color: #667eea;
}

.list-icon {
  font-size: 1.2rem;
  color: #48bb78;
  margin-right: 0.5rem;
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
  color: #667eea;
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
  color: #667eea;
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
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-btn .material-icons {
  font-size: 1.25rem;
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
  color: white;
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
}

.result-icon .material-icons {
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
  margin-right: 0.5rem;
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
  transition:
    width 0.5s ease,
    background 0.3s ease;
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

/* Analysis Banner */
.analysis-banner {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #3b82f610 0%, #2563eb10 100%);
  border-radius: 16px;
  border-left: 4px solid #3b82f6;
  margin-bottom: 2rem;
}

/* Detection Banner - Warning style */
.detection-banner {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-left: 4px solid #f59e0b;
  align-items: flex-start;
  padding: 2rem;
}

.detection-banner .banner-icon {
  font-size: 2rem;
  color: #f59e0b;
  flex-shrink: 0;
  margin-top: 0.25rem;
}

.banner-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.banner-icon {
  font-size: 1.75rem;
  color: #3b82f6;
}

.banner-text {
  font-size: 1.05rem;
  font-weight: 600;
  color: #92400e;
  line-height: 1.6;
  margin: 0;
}

.banner-subtext {
  font-size: 0.95rem;
  font-weight: 500;
  color: #b45309;
  line-height: 1.6;
  margin: 0;
}

/* Medical Disclaimer */
.medical-disclaimer {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.75rem;
  background: #eff6ff;
  border-radius: 12px;
  border-left: 4px solid #2563eb;
  margin-bottom: 2rem;
}

.disclaimer-icon {
  font-size: 1.75rem;
  color: #2563eb;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.disclaimer-text {
  font-size: 0.95rem;
  font-weight: 500;
  color: #1e40af;
  line-height: 1.6;
  margin: 0;
  font-style: italic;
}

/* Analysis Images Section */
.analysis-images-section {
  background: #f7fafc;
  padding: 2.5rem;
  border-radius: 24px;
  margin-bottom: 2rem;
  max-width: 100%;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.75rem;
  font-weight: 800;
  color: #2d3748;
  margin-bottom: 2rem;
  text-align: center;
  justify-content: center;
}

.section-title .material-icons {
  font-size: 2rem;
  color: #667eea;
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 2rem;
  max-width: 100%;
}

.analysis-image-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  transition: all 0.3s ease;
}

.analysis-image-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
}

.image-card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
}

.image-card-header .material-icons {
  font-size: 1.5rem;
}

.detection-badge {
  margin-left: auto;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  font-size: 0.95rem;
  font-weight: 700;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.4);
}

.analysis-image {
  width: 100%;
  min-height: 400px;
  max-height: 600px;
  height: auto;
  object-fit: contain;
  display: block;
  background: #f8fafc;
  cursor: zoom-in;
  transition: transform 0.3s ease;
}

.analysis-image:hover {
  transform: scale(1.02);
}

.image-description {
  padding: 1.25rem 1.5rem;
  color: #4a5568;
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;
  font-weight: 500;
  background: #f8fafc;
  border-top: 2px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.description-icon {
  font-size: 1.25rem;
  color: #667eea;
  flex-shrink: 0;
}

/* Image Modal */
.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
}

.modal-content {
  position: relative;
  z-index: 10000;
  max-width: 95vw;
  max-height: 95vh;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: zoomIn 0.3s ease;
}

@keyframes zoomIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.modal-close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10001;
  width: 48px;
  height: 48px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.modal-close-btn:hover {
  background: rgba(255, 0, 0, 0.9);
  transform: scale(1.1) rotate(90deg);
}

.modal-close-btn .material-icons {
  font-size: 1.75rem;
}

.modal-header {
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.modal-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.modal-image-container {
  max-height: calc(95vh - 180px);
  overflow: auto;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-image {
  width: 100%;
  height: auto;
  max-width: 100%;
  object-fit: contain;
  display: block;
}

.modal-hint {
  padding: 1rem;
  text-align: center;
  color: #718096;
  font-size: 0.9rem;
  margin: 0;
  background: #f7fafc;
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

  /* Images responsive */
  .images-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .analysis-image {
    min-height: 300px;
    max-height: 500px;
  }

  .section-title {
    font-size: 1.35rem;
  }

  .analysis-images-section {
    padding: 1.5rem;
  }

  .image-card-header {
    padding: 1rem;
    font-size: 0.95rem;
  }

  .detection-badge {
    font-size: 0.8rem;
    padding: 0.35rem 0.75rem;
  }
}
</style>
