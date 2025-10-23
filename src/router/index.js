import Accueil from '@/views/Accueil.vue'
import Analyse from '@/views/Analyse.vue'
import Diagnostic from '@/views/Diagnostic.vue'
import DiagnosticMedical from '@/views/DiagnosticMedical.vue'
import Login from '@/views/Login.vue'
import authService from '@/services/authService'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/accueil',
    },
    {
      path: '/accueil',
      name: 'accueil',
      component: Accueil,
    },
    {
      path: '/diagnostic',
      name: 'diagnostic',
      component: Diagnostic,
      meta: { requiresAuth: false },
    },
    {
      path: '/diagnostic-medical',
      name: 'diagnostic-medical',
      component: DiagnosticMedical,
      meta: { requiresAuth: true }, // Réservé aux médecins connectés
    },
    {
      path: '/analyse',
      name: 'analyse',
      component: Analyse,
      meta: { requiresAuth: false },
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { guest: true },
    },
  ],
})

// Navigation guard pour vérifier l'authentification
router.beforeEach((to, _from, next) => {
  const isAuthenticated = authService.isAuthenticated()

  // Si la route nécessite l'authentification et l'utilisateur n'est pas connecté
  if (to.meta.requiresAuth && !isAuthenticated) {
    // Sauvegarder la route demandée pour rediriger après connexion
    localStorage.setItem('redirectAfterLogin', to.fullPath)
    next('/login')
  }
  // Si l'utilisateur est connecté et essaie d'accéder à la page de connexion
  else if (to.meta.guest && isAuthenticated) {
    // Rediriger vers la page sauvegardée ou l'accueil
    const redirectPath = localStorage.getItem('redirectAfterLogin') || '/accueil'
    localStorage.removeItem('redirectAfterLogin')
    next(redirectPath)
  }
  // Sinon, continuer normalement
  else {
    next()
  }
})

export default router
