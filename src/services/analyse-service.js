// Service d'analyse d'images médicales
const API_BASE_URL = import.meta.env.VITE_API_URL

class AnalyseService {
  /**
   * Envoyer une image pour analyse
   * @param {File} imageFile - Fichier image à analyser
   * @returns {Promise<Object>} Résultat de l'analyse avec images
   */
  async analyzeImage(imageFile) {
    try {
      if (!imageFile) {
        throw new Error('Aucune image fournie')
      }

      // Créer FormData pour envoyer l'image
      const formData = new FormData()
      formData.append('image', imageFile)

      const response = await fetch(`${API_BASE_URL}/analyse`, {
        method: 'POST',
        body: formData,
        // Ne pas définir Content-Type, le navigateur le fera automatiquement avec boundary
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || "Erreur lors de l'analyse de l'image")
      }

      const result = await response.json()
      return {
        success: true,
        data: result,
      }
    } catch (error) {
      console.error("Erreur d'analyse:", error)
      throw error
    }
  }

  /**
   * Analyser plusieurs images
   * @param {Array<File>} imageFiles - Tableau de fichiers images
   * @returns {Promise<Array>} Résultats des analyses
   */
  async analyzeMultipleImages(imageFiles) {
    try {
      if (!imageFiles || imageFiles.length === 0) {
        throw new Error('Aucune image fournie')
      }

      // Analyser chaque image séparément
      const promises = imageFiles.map((file) => this.analyzeImage(file))
      const results = await Promise.all(promises)

      return results
    } catch (error) {
      console.error('Erreur lors de l\'analyse multiple:', error)
      throw error
    }
  }
}

// Exporter une instance unique (singleton)
export default new AnalyseService()
