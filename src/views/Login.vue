<template>
  <div class="login-page">
    <div class="login-container">
      <!-- Left side - Branding -->
      <div class="login-branding">
        <div class="branding-content">
          <div class="brand-logo">
            <span class="material-icons logo-icon">local_hospital</span>
            <h1 class="brand-title">Cancer Breast</h1>
          </div>
          <p class="brand-description">
            Plateforme d'analyse et de diagnostic du cancer du sein par intelligence artificielle
          </p>
          <div class="features-list">
            <div class="feature-item">
              <span class="material-icons feature-icon">check_circle</span>
              <span class="feature-text">Analyse rapide et précise</span>
            </div>
            <div class="feature-item">
              <span class="material-icons feature-icon">check_circle</span>
              <span class="feature-text">Évaluation des risques personnalisée</span>
            </div>
            <div class="feature-item">
              <span class="material-icons feature-icon">check_circle</span>
              <span class="feature-text">Résultats détaillés et confidentiels</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right side - Login Form -->
      <div class="login-form-section">
        <div class="form-wrapper">
          <div class="form-header">
            <h2 class="form-title">Connexion</h2>
            <p class="form-subtitle">Accédez à votre compte pour continuer</p>
          </div>

          <form @submit.prevent="handleLogin" class="login-form">
            <!-- Email -->
            <div class="form-group">
              <label for="email" class="form-label">
                <span class="material-icons label-icon">email</span>
                Adresse email
              </label>
              <input
                type="email"
                id="email"
                v-model="formData.email"
                required
                class="form-input"
                placeholder="exemple@email.com"
                :class="{ 'input-error': errors.email }"
              />
              <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
            </div>

            <!-- Password -->
            <div class="form-group">
              <label for="password" class="form-label">
                <span class="material-icons label-icon">lock</span>
                Mot de passe
              </label>
              <div class="password-input-wrapper">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  id="password"
                  v-model="formData.password"
                  required
                  class="form-input"
                  placeholder="••••••••"
                  :class="{ 'input-error': errors.password }"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="password-toggle"
                  :aria-label="
                    showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'
                  "
                >
                  <span class="material-icons">{{ showPassword ? 'visibility' : 'visibility_off' }}</span>
                </button>
              </div>
              <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
            </div>

            <!-- Remember me & Forgot password -->
            <div class="form-options">
              <label class="checkbox-label">
                <input type="checkbox" v-model="formData.rememberMe" class="checkbox-input" />
                <span class="checkbox-text">Se souvenir de moi</span>
              </label>
              <a href="#" class="forgot-password-link">Mot de passe oublié ?</a>
            </div>

            <!-- Error message -->
            <div v-if="loginError" class="alert alert-error">
              <span class="material-icons alert-icon">error</span>
              <span>{{ loginError }}</span>
            </div>

            <!-- Submit button -->
            <button type="submit" class="btn-submit" :disabled="isLoading">
              <span v-if="!isLoading" class="btn-content">
                <span class="material-icons btn-icon">login</span>
                Se connecter
              </span>
              <span v-else class="btn-loading">
                <span class="spinner"></span>
                Connexion en cours...
              </span>
            </button>

            <!-- Sign up link -->
            <div class="signup-section">
              <p class="signup-text">
                Vous n'avez pas de compte ?
                <RouterLink to="/inscription" class="signup-link">Créer un compte</RouterLink>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import authService from '@/services/authService'

const router = useRouter()

const formData = ref({
  email: '',
  password: '',
  rememberMe: false,
})

const errors = ref({
  email: '',
  password: '',
})
const user = ref(null)

const loginError = ref('')
const isLoading = ref(false)
const showPassword = ref(false)

const validateForm = () => {
  errors.value = {
    email: '',
    password: '',
  }

  let isValid = true

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!formData.value.email) {
    errors.value.email = "L'adresse email est requise"
    isValid = false
  } else if (!emailRegex.test(formData.value.email)) {
    errors.value.email = "L'adresse email n'est pas valide"
    isValid = false
  }

  // Validate password
  if (!formData.value.password) {
    errors.value.password = 'Le mot de passe est requis'
    isValid = false
  } else if (formData.value.password.length < 6) {
    errors.value.password = 'Le mot de passe doit contenir au moins 6 caractères'
    isValid = false
  }

  return isValid
}

const handleLogin = async () => {
  loginError.value = ''

  if (!validateForm()) {
    return
  }

  isLoading.value = true

  try {
    // Appeler le service d'authentification
    const result = await authService.login(formData.value.email, formData.value.password)

    console.log('Connexion réussie:', result)

    // Optionnel: Récupérer le profil utilisateur complet depuis l'API

    // Rediriger vers la page d'accueil ou diagnostic médical selon le rôle
    const userInfo = authService.getUser()
    console.log(userInfo.sub)

    try {
      user.value = await authService.getProfile(userInfo.sub)
    } catch (profileError) {
      console.warn('Impossible de récupérer le profil:', profileError)
      // Continuer même si la récupération du profil échoue
    }
    if (user && user.value.role === 'medecin') {
      router.push('/diagnostic-medical')
    } else {
      router.push('/accueil')
    }
  } catch (error) {
    // Gérer les différents types d'erreurs
    if (error.message.includes('Identifiants')) {
      loginError.value = 'Email ou mot de passe incorrect. Veuillez réessayer.'
    } else if (error.message.includes('réseau') || error.message.includes('fetch')) {
      loginError.value =
        "Impossible de se connecter au serveur. Vérifiez votre connexion internet ou contactez l'administrateur."
    } else {
      loginError.value =
        error.message || 'Une erreur est survenue lors de la connexion. Veuillez réessayer.'
    }
    console.error('Erreur de connexion:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  padding: 2rem;
}

.login-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1200px;
  width: 100%;
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

/* Left side - Branding */
.login-branding {
  /* background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); */
  background-color: #e2e8f0;
  padding: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: black;
}

.branding-content {
  max-width: 400px;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.logo-icon {
  font-size: 3rem;
}

.brand-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0;
}

.brand-description {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 3rem;
  opacity: 0.95;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.feature-icon {
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  flex-shrink: 0;
}

.feature-text {
  font-size: 1rem;
  line-height: 1.5;
}

/* Right side - Login Form */
.login-form-section {
  padding: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-wrapper {
  width: 100%;
  max-width: 400px;
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
  /* background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); */
  background: black;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.form-subtitle {
  font-size: 1rem;
  color: #718096;
}

.login-form {
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
  font-size: 0.95rem;
}

.label-icon {
  font-size: 1.1rem;
}

.form-input {
  padding: 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  font-family: inherit;
  color: #2d3748;
  transition: all 0.3s ease;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: #e2e8f0;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input.input-error {
  border-color: #f56565;
}

.form-input::placeholder {
  color: #a0aec0;
}

.password-input-wrapper {
  position: relative;
}

.password-input-wrapper .form-input {
  padding-right: 3rem;
}

.password-toggle {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0.25rem;
  line-height: 1;
  transition: opacity 0.3s ease;
}

.password-toggle:hover {
  opacity: 0.7;
}

.error-message {
  color: #f56565;
  font-size: 0.875rem;
  font-weight: 500;
}

.form-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: -0.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
}

.checkbox-input {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #667eea;
}

.checkbox-text {
  font-size: 0.9rem;
  color: #4a5568;
}

.forgot-password-link {
  font-size: 0.9rem;
  color: black;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.forgot-password-link:hover {
  color: black;
  text-decoration: underline;
}

.alert {
  padding: 1rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
}

.alert-error {
  background: #fff5f5;
  border: 1px solid #feb2b2;
  color: #742a2a;
}

.alert-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.btn-submit {
  width: 100%;
  padding: 1rem;
  background: gray;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-content,
.btn-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-icon {
  font-size: 1.25rem;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.signup-section {
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.signup-text {
  color: #718096;
  font-size: 0.95rem;
}

.signup-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 700;
  transition: color 0.3s ease;
}

.signup-link:hover {
  color: #764ba2;
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 968px) {
  .login-container {
    grid-template-columns: 1fr;
  }

  .login-branding {
    padding: 3rem 2rem;
  }

  .brand-title {
    font-size: 2rem;
  }

  .features-list {
    gap: 1rem;
  }
}

@media (max-width: 640px) {
  .login-page {
    padding: 1rem;
  }

  .login-form-section {
    padding: 2rem 1.5rem;
  }

  .login-branding {
    padding: 2rem 1.5rem;
  }

  .brand-title {
    font-size: 1.75rem;
  }

  .brand-description {
    font-size: 1rem;
  }

  .form-title {
    font-size: 1.75rem;
  }

  .form-options {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
