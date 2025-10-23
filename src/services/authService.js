// Service d'authentification centralisé
// const API_BASE_URL = 'http://localhost:8000'
const API_BASE_URL = import.meta.env.VITE_API_URL

class AuthService {
  /**
   * Login avec email et mot de passe
   * @param {string} email - Email de l'utilisateur
   * @param {string} password - Mot de passe
   * @returns {Promise<Object>} Token et informations utilisateur
   */
  async login(email, password) {
    try {
      // Créer les données au format application/x-www-form-urlencoded
      const formData = new URLSearchParams()
      formData.append('username', email) // L'API attend "username" même si c'est un email
      formData.append('password', password)

      const response = await fetch(`${API_BASE_URL}/utilisateurs/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || 'Identifiants incorrects')
      }

      const data = await response.json()

      // La réponse contient généralement: { access_token, token_type }
      if (data.access_token) {
        // Stocker le token dans localStorage
        this.setToken(data.access_token)

        // Décoder le JWT pour obtenir les infos utilisateur (optionnel)
        const userInfo = this.decodeToken(data.access_token)
        this.setUser(userInfo)

        return {
          success: true,
          token: data.access_token,
          tokenType: data.token_type || 'bearer',
          user: userInfo,
        }
      } else {
        throw new Error('Token non reçu')
      }
    } catch (error) {
      console.error('Erreur de connexion:', error)
      throw error
    }
  }

  /**
   * Décode un JWT token (sans vérification de signature)
   * @param {string} token - JWT token
   * @returns {Object} Payload décodé
   */
  decodeToken(token) {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join(''),
      )
      return JSON.parse(jsonPayload)
    } catch (error) {
      console.error('Erreur de décodage du token:', error)
      return {}
    }
  }

  /**
   * Stocker le token dans localStorage
   * @param {string} token - JWT token
   */
  setToken(token) {
    localStorage.setItem('access_token', token)
    localStorage.setItem('isAuthenticated', 'true')
  }

  /**
   * Récupérer le token depuis localStorage
   * @returns {string|null} Token ou null
   */
  getToken() {
    return localStorage.getItem('access_token')
  }

  /**
   * Stocker les informations utilisateur
   * @param {Object} user - Informations utilisateur
   */
  setUser(user) {
    localStorage.setItem('user', JSON.stringify(user))
  }

  /**
   * Récupérer les informations utilisateur
   * @returns {Object|null} Utilisateur ou null
   */
  getUser() {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  }

  /**
   * Vérifier si l'utilisateur est authentifié
   * @returns {boolean}
   */
  isAuthenticated() {
    const token = this.getToken()
    if (!token) return false

    // Vérifier si le token est expiré
    try {
      const decoded = this.decodeToken(token)
      if (decoded.exp) {
        const currentTime = Date.now() / 1000
        return decoded.exp > currentTime
      }
      return true
    } catch {
      return false
    }
  }

  /**
   * Déconnexion - Nettoyer le localStorage
   */
  logout() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('user')
  }

  /**
   * Faire une requête authentifiée
   * @param {string} url - URL de la requête
   * @param {Object} options - Options fetch
   * @returns {Promise<Response>}
   */
  async authenticatedFetch(url, options = {}) {
    const token = this.getToken()

    if (!token) {
      throw new Error('Non authentifié')
    }

    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    // Si 401, le token est invalide ou expiré
    if (response.status === 401) {
      this.logout()
      throw new Error('Session expirée, veuillez vous reconnecter')
    }

    return response
  }

  /**
   * Récupérer les informations du profil utilisateur depuis l'API
   * @returns {Promise<Object>}
   */
  async getProfile(email) {
    try {
      const response = await this.authenticatedFetch(`${API_BASE_URL}/utilisateurs/${email}`)

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du profil')
      }

      const userData = await response.json()
      this.setUser(userData)
      return userData
    } catch (error) {
      console.error('Erreur de récupération du profil:', error)
      throw error
    }
  }
}

// Exporter une instance unique (singleton)
export default new AuthService()
