<template>
  <header class="app-bar">
    <div class="app-bar-container">
      <!-- Logo / Brand -->
      <div class="app-bar-brand">
        <a href="/" class="brand-link">
          <span class="material-icons brand-icon">local_hospital</span>
          <span class="brand-name">Cancer Breast</span>
        </a>
      </div>

      <!-- Navigation Menu -->
      <nav class="app-bar-nav" :class="{ 'is-open': mobileMenuOpen }">
        <ul class="nav-list">
          <li class="nav-item">
            <RouterLink to="/accueil" class="nav-link" @click="closeMenu"> Accueil </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink :to="diagnosticRoute" class="nav-link" @click="closeMenu">
              Diagnostic
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/analyse" class="nav-link" @click="closeMenu"> Analyse </RouterLink>
          </li>
        </ul>
      </nav>

      <!-- Auth Section -->
      <div class="auth-section">
        <div v-if="isAuthenticated" class="user-menu">
          <button @click="toggleUserMenu" class="user-button">
            <span class="material-icons user-icon">account_circle</span>
            <span class="user-name">{{ userName }}</span>
            <span class="material-icons dropdown-arrow" :class="{ 'is-open': userMenuOpen }">expand_more</span>
          </button>
          <div v-if="userMenuOpen" class="user-dropdown">
            <a href="#" class="dropdown-item">
              <span class="material-icons dropdown-icon">settings</span>
              Paramètres
            </a>
            <a href="#" class="dropdown-item">
              <span class="material-icons dropdown-icon">person</span>
              Mon profil
            </a>
            <hr class="dropdown-divider" />
            <button @click="handleLogout" class="dropdown-item logout">
              <span class="material-icons dropdown-icon">logout</span>
              Déconnexion
            </button>
          </div>
        </div>
        <RouterLink v-else to="/login" class="btn-login" @click="closeMenu">
          <span class="material-icons btn-icon">login</span>
          Connexion
        </RouterLink>
      </div>

      <!-- Mobile Menu Toggle -->
      <button class="mobile-menu-toggle" @click="toggleMobileMenu" aria-label="Toggle menu">
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import authService from '@/services/authService'

const router = useRouter()
const route = useRoute()
const mobileMenuOpen = ref(false)
const userMenuOpen = ref(false)
const isAuthenticated = ref(false)
const userName = ref('')
const userRole = ref('')

// Vérifier l'authentification au montage et à chaque changement de route
onMounted(() => {
  checkAuthentication()
})

// Observer les changements de route pour rafraîchir l'état d'authentification
watch(
  () => route.path,
  () => {
    checkAuthentication()
  },
)

const checkAuthentication = () => {
  isAuthenticated.value = authService.isAuthenticated()

  if (isAuthenticated.value) {
    const user = authService.getUser()
    if (user) {
      userName.value = user.name || user.email || user.sub || 'Utilisateur'
      userRole.value = user.role || user.type || ''
    }
  } else {
    userName.value = ''
    userRole.value = ''
  }
}

// Route dynamique pour le diagnostic selon le rôle
const diagnosticRoute = computed(() => {
  return isAuthenticated.value && userRole.value === 'medecin'
    ? '/diagnostic-medical'
    : '/diagnostic'
})

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
  userMenuOpen.value = false
}

const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value
}

const closeMenu = () => {
  mobileMenuOpen.value = false
  userMenuOpen.value = false
}

const handleLogout = () => {
  authService.logout()
  isAuthenticated.value = false
  userName.value = ''
  userRole.value = ''
  userMenuOpen.value = false
  router.push('/accueil')
}

// Fermer le menu utilisateur si on clique ailleurs
if (typeof window !== 'undefined') {
  window.addEventListener('click', (e) => {
    if (!e.target.closest('.user-menu')) {
      userMenuOpen.value = false
    }
  })
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app-bar {
  position: sticky;
  top: 0;
  z-index: 1000;
  /* background: linear-gradient(135deg, #ed64a6 0%, #9f7aea 100%); */
  background-color: #fbcfe8;
  box-shadow: 0 4px 20px rgba(237, 100, 166, 0.3);
  margin: 0;
  padding: 0;
}

.app-bar-container {
  width: 100vw;
  padding: 1rem 3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Brand */
.app-bar-brand {
  flex: 0 0 auto;
  min-width: 200px;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: black;
  font-weight: 800;
  font-size: 1.35rem;
  transition: all 0.3s ease;
  letter-spacing: 0.5px;
}

.brand-link:hover {
  transform: scale(1.05);
  text-shadow: 0 2px 10px rgba(255, 255, 255, 0.3);
}

.brand-icon {
  font-size: 1.75rem;
}

.brand-name {
  white-space: nowrap;
}

/* Navigation */
.app-bar-nav {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 800px;
  margin: 0 auto;
}

.nav-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 2rem;
  justify-content: space-evenly;
  width: 100%;
}

.nav-item {
  margin: 0;
}

.nav-link {
  display: block;
  padding: 0.5rem 1.25rem;
  color: black;
  text-decoration: none;
  border-radius: 0.75rem;
  transition: all 0.3s ease;
  font-weight: 600;
  white-space: nowrap;
  position: relative;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
}

.nav-link.router-link-active {
  background-color: rgba(255, 255, 255, 0.25);
  font-weight: 700;
}

/* Auth Section */
.auth-section {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-login {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  color: black;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 700;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  white-space: nowrap;
}

.btn-login:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.3);
}

.btn-icon {
  font-size: 1.1rem;
}

/* User Menu */
.user-menu {
  position: relative;
}

.user-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.2);
  color: black;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  font-family: inherit;
  white-space: nowrap;
}

.user-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.user-icon {
  font-size: 1.25rem;
}

.user-name {
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-arrow {
  font-size: 0.7rem;
  transition: transform 0.3s ease;
}

.dropdown-arrow.is-open {
  transform: rotate(180deg);
}

.user-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  min-width: 200px;
  background: black;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  z-index: 1000;
  animation: slideDown 0.2s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.25rem;
  color: #2d3748;
  text-decoration: none;
  transition: all 0.2s ease;
  font-weight: 600;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.95rem;
}

.dropdown-item:hover {
  background: #f7fafc;
}

.dropdown-item.logout {
  color: #f56565;
}

.dropdown-item.logout:hover {
  background: #fff5f5;
}

.dropdown-icon {
  font-size: 1.1rem;
}

.dropdown-divider {
  margin: 0.5rem 0;
  border: none;
  border-top: 1px solid #e2e8f0;
}

/* Mobile Menu Toggle */
.mobile-menu-toggle {
  display: none;
  flex-direction: column;
  gap: 0.25rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  flex: 0 0 auto;
}

.hamburger-line {
  width: 25px;
  height: 3px;
  background-color: white;
  border-radius: 2px;
  transition: all 0.3s ease;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .app-bar-container {
    padding: 1rem 2rem;
  }

  .nav-list {
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .app-bar-container {
    padding: 1rem;
    justify-content: space-between;
  }

  .mobile-menu-toggle {
    display: flex;
  }

  .app-bar-nav {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: linear-gradient(135deg, #ed64a6 0%, #9f7aea 100%);
    box-shadow: 0 4px 10px rgba(237, 100, 166, 0.3);
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
    max-width: 100%;
    margin: 0;
  }

  .app-bar-nav.is-open {
    max-height: 400px;
  }

  .nav-list {
    flex-direction: column;
    padding: 1rem;
    gap: 0;
    width: 100%;
  }

  .nav-link {
    padding: 0.75rem 1rem;
    width: 100%;
  }

  .brand-name {
    font-size: 1.1rem;
  }

  .app-bar-brand {
    min-width: auto;
  }

  .auth-section {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: linear-gradient(135deg, #ed64a6 0%, #9f7aea 100%);
    padding: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
  }

  .btn-login {
    width: 100%;
    justify-content: center;
  }

  .user-button {
    width: 100%;
    justify-content: center;
  }

  .user-dropdown {
    position: static;
    margin-top: 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

@media (max-width: 480px) {
  .brand-icon {
    font-size: 1.5rem;
  }

  .brand-name {
    font-size: 1rem;
  }

  .app-bar-container {
    padding: 0.75rem 1rem;
  }
}
</style>
