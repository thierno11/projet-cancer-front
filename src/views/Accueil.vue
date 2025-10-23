<template>
  <div class="home-page">
    <!-- Hero Section avec animation -->
    <section class="hero-section">
      <div class="hero-content">
        <!-- <div class="hero-badge" data-aos="fade-down">
          <span class="material-icons badge-icon">local_hospital</span>
          <span class="badge-text">Intelligence Artificielle Médicale</span>
        </div> -->

        <h1 class="hero-title" data-aos="fade-up" data-aos-delay="200">
          Détection Précoce du
          <span class="gradient-text">Cancer du Sein</span>
        </h1>

        <p class="hero-description" data-aos="fade-up" data-aos-delay="400">
          Une plateforme innovante utilisant l'IA pour aider au diagnostic précoce et améliorer les
          chances de guérison
        </p>

        <div class="hero-actions" data-aos="fade-up" data-aos-delay="600">
          <RouterLink to="/diagnostic" class="btn btn-primary btn-large">
            <span class="material-icons btn-icon">search</span>
            Commencer le diagnostic
            <span class="material-icons btn-arrow">arrow_forward</span>
          </RouterLink>
          <button @click="scrollToFeatures" class="btn btn-secondary btn-large">
            <span class="material-icons btn-icon">insights</span>
            En savoir plus
          </button>
        </div>

        <div class="hero-stats" data-aos="fade-up" data-aos-delay="800">
          <div class="stat-item">
            <div class="stat-number">95%</div>
            <div class="stat-label">Taux de précision</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-number">10K+</div>
            <div class="stat-label">Diagnostics réalisés</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-number">24/7</div>
            <div class="stat-label">Disponibilité</div>
          </div>
        </div>
      </div>
    </section>

    <section class="process-section">
      <div class="section-header" data-aos="fade-up">
        <span class="section-badge">Comment ça marche</span>
        <h2 class="section-title">Un processus simple en 4 étapes</h2>
      </div>

      <div class="process-timeline">
        <div
          v-for="(step, index) in processSteps"
          :key="index"
          class="timeline-item"
          data-aos="fade-right"
          :data-aos-delay="index * 200"
        >
          <div class="timeline-number">{{ index + 1 }}</div>
          <div class="timeline-content">
            <div class="timeline-icon">{{ step.icon }}</div>
            <h3 class="timeline-title">{{ step.title }}</h3>
            <p class="timeline-description">{{ step.description }}</p>
          </div>
          <div class="timeline-line" v-if="index < processSteps.length - 1"></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const activeFeature = ref(null)

const features = [
  {
    icon: 'psychology',
    title: 'Intelligence Artificielle',
    description:
      'Algorithmes de deep learning entraînés sur des milliers de cas pour une précision maximale',
  },
  {
    icon: 'analytics',
    title: 'Analyse Avancée',
    description:
      'Visualisation et interprétation des données médicales en temps réel avec des rapports détaillés',
  },
  {
    icon: 'lock',
    title: 'Sécurité Garantie',
    description: 'Vos données sont cryptées et protégées selon les normes RGPD et HIPAA',
  },
  {
    icon: 'bolt',
    title: 'Résultats Rapides',
    description: 'Obtenez une première analyse en quelques minutes seulement',
  },
  {
    icon: 'medical_services',
    title: 'Validation Médicale',
    description: 'Tous les résultats sont vérifiés par des professionnels de santé qualifiés',
  },
  {
    icon: 'devices',
    title: 'Accessible Partout',
    description: 'Plateforme accessible sur tous vos appareils, à tout moment',
  },
]

const processSteps = [
  {
    icon: '📝',
    title: 'Remplissez le formulaire',
    description: 'Complétez le questionnaire médical détaillé avec vos informations et symptômes',
  },
  {
    icon: '📤',
    title: 'Téléchargez vos examens',
    description: 'Importez vos images médicales (mammographie, échographie, IRM)',
  },
  {
    icon: '🔬',
    title: 'Analyse par IA',
    description: 'Notre algorithme analyse vos données en quelques minutes',
  },
  {
    icon: '📋',
    title: 'Recevez vos résultats',
    description: 'Obtenez un rapport détaillé avec recommandations et suivi personnalisé',
  },
]

const statistics = [
  { icon: '✓', value: '10,000+', label: 'Diagnostics réalisés' },
  { icon: '⭐', value: '4.9/5', label: 'Note moyenne' },
  { icon: '🏥', value: '50+', label: 'Hôpitaux partenaires' },
  { icon: '🌍', value: '15', label: 'Pays desservis' },
]

const scrollToFeatures = () => {
  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
}

const calculateStrokeDashoffset = (percentage) => {
  const circumference = 2 * Math.PI * 52
  return circumference - (percentage / 100) * circumference
}

onMounted(() => {
  // Animation pour les formes flottantes
  const shapes = document.querySelectorAll('.shape')
  shapes.forEach((shape, index) => {
    shape.style.animationDelay = `${index * 0.5}s`
  })
})
</script>

<style scoped>
/* Global Styles */
.home-page {
  width: 100%;
  overflow-x: hidden;
}

/* Hero Section */
.hero-section {
  position: relative;
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  z-index: 0;
}

.floating-shapes {
  position: absolute;
  width: 100%;
  height: 100%;
}

.shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  animation: float 20s infinite ease-in-out;
}

.shape-1 {
  width: 300px;
  height: 300px;
  background: gray;
  top: 10%;
  left: 10%;
}

.shape-2 {
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  top: 60%;
  right: 15%;
  animation-delay: 2s;
}

.shape-3 {
  width: 150px;
  height: 150px;
  background: linear-gradient(135deg, #ed64a6 0%, #d53f8c 100%);
  bottom: 20%;
  left: 20%;
  animation-delay: 4s;
}

.shape-4 {
  width: 250px;
  height: 250px;
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
  top: 30%;
  right: 25%;
  animation-delay: 6s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-30px) rotate(180deg);
  }
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  text-align: center;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.5rem;
  background: white;
  border-radius: 50px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  animation: bounceIn 1s ease;
}

.badge-icon {
  font-size: 1.25rem;
}

.badge-text {
  font-weight: 600;
  color: #667eea;
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  color: #2d3748;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.gradient-text {
  background: black;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-description {
  font-size: 1.25rem;
  color: #4a5568;
  max-width: 700px;
  margin: 0 auto 3rem;
  line-height: 1.8;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 4rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  cursor: pointer;
}

.btn-large {
  padding: 1.25rem 2.5rem;
  font-size: 1.1rem;
}

.btn-primary {
  background: gray;
  color: white;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4);
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

.btn-white {
  background: white;
  color: #667eea;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.btn-white:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.btn-outline {
  background: transparent;
  color: white;
  border: 2px solid white;
}

.btn-outline:hover {
  background: white;
  color: #667eea;
}

.btn-icon {
  font-size: 1.25rem;
}

.btn-arrow {
  transition: transform 0.3s ease;
}

.btn:hover .btn-arrow {
  transform: translateX(5px);
}

.hero-stats {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3rem;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 800;
  background: gray;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #718096;
  font-size: 0.9rem;
  font-weight: 500;
}

.stat-divider {
  width: 2px;
  height: 40px;
  background: #e2e8f0;
}

/* Features Section */
.features-section {
  padding: 8rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 5rem;
}

.section-badge {
  display: inline-block;
  padding: 0.5rem 1.5rem;
  background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
  color: #667eea;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.section-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  color: #2d3748;
  margin-bottom: 1rem;
}

.section-description {
  font-size: 1.1rem;
  color: #718096;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.8;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
}

.feature-card {
  position: relative;
  padding: 2.5rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: gray;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s ease;
}

.feature-card:hover::before,
.feature-card.is-active::before {
  transform: scaleX(1);
}

.feature-card:hover,
.feature-card.is-active {
  transform: translateY(-10px);
  box-shadow: 0 15px 40px rgba(102, 126, 234, 0.2);
}

.feature-icon-wrapper {
  position: relative;
  width: 80px;
  height: 80px;
  margin-bottom: 1.5rem;
}

.feature-icon {
  position: relative;
  z-index: 2;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
  border-radius: 20px;
  transition: transform 0.4s ease;
}

.feature-card:hover .feature-icon {
  transform: scale(1.1) rotate(5deg);
}

.feature-icon-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background: gray;
  border-radius: 20px;
  opacity: 0;
  transition: all 0.4s ease;
}

.feature-card:hover .feature-icon-bg {
  opacity: 0.1;
  transform: translate(-50%, -50%) scale(1.2);
}

.feature-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 1rem;
}

.feature-description {
  color: #718096;
  line-height: 1.8;
  margin-bottom: 1.5rem;
}

.feature-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #667eea;
  font-weight: 600;
  transition: gap 0.3s ease;
}

.feature-card:hover .feature-link {
  gap: 1rem;
}

.arrow {
  transition: transform 0.3s ease;
}

.feature-card:hover .arrow {
  transform: translateX(5px);
}

/* Process Section */
.process-section {
  /* padding: 8rem 2rem; */
  background: linear-gradient(135deg, #667eea05 0%, #764ba205 100%);
}

.process-timeline {
  max-width: 1000px;
  margin: 4rem auto 0;
  position: relative;
}

.timeline-item {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
  position: relative;
}

.timeline-number {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 800;
  background: gray;
  color: white;
  border-radius: 50%;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
  position: relative;
  z-index: 2;
}

.timeline-content {
  background: white;
  padding: 1rem;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.timeline-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.timeline-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.75rem;
}

.timeline-description {
  color: #718096;
  line-height: 1.8;
}

.timeline-line {
  position: absolute;
  left: 40px;
  top: 80px;
  bottom: -60px;
  width: 2px;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  opacity: 0.3;
}

/* Statistics Section */
.statistics-section {
  padding: 8rem 2rem;
  background: white;
}

.stats-container {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.stats-content {
  max-width: 600px;
}

.stats-list {
  margin: 3rem 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.stat-list-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #f7fafc;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.stat-list-item:hover {
  background: linear-gradient(135deg, #667eea05 0%, #764ba205 100%);
  transform: translateX(10px);
}

.stat-icon {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  background: gray;
  color: white;
  border-radius: 12px;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 800;
  color: #2d3748;
  margin-bottom: 0.25rem;
}

.stat-text {
  color: #718096;
  font-size: 0.95rem;
}

.stats-visual {
  display: flex;
  justify-content: center;
  align-items: center;
}

.visual-card {
  width: 100%;
  max-width: 500px;
  padding: 3rem;
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
}

.card-title {
  font-weight: 700;
  font-size: 1.25rem;
  color: #2d3748;
}

.card-badge {
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #48bb7815 0%, #38a16915 100%);
  color: #48bb78;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 600;
}

.progress-rings {
  display: flex;
  justify-content: space-around;
  gap: 2rem;
}

.ring-item {
  text-align: center;
  position: relative;
}

.progress-ring {
  transform: rotate(-90deg);
}

.progress-ring-circle {
  stroke-dasharray: 326.56;
  stroke-linecap: round;
  transition: stroke-dashoffset 2s ease;
  animation: fillRing 2s ease forwards;
}

@keyframes fillRing {
  from {
    stroke-dashoffset: 326.56;
  }
}

.ring-value {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.5rem;
  font-weight: 800;
  color: #2d3748;
}

.ring-label {
  margin-top: 1rem;
  color: #718096;
  font-weight: 600;
  font-size: 0.9rem;
}

/* CTA Section */
.cta-section {
  padding: 8rem 2rem;
  background: gray;
  position: relative;
  overflow: hidden;
}

.cta-section::before {
  content: '';
  position: absolute;
  width: 500px;
  height: 500px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  top: -200px;
  right: -200px;
}

.cta-content {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.cta-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  color: white;
  margin-bottom: 1rem;
}

.cta-description {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 3rem;
}

.cta-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* Animations */
@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
}

/* Responsive */
@media (max-width: 1024px) {
  .stats-container {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .stats-visual {
    order: -1;
  }
}

@media (max-width: 768px) {
  .hero-section {
    min-height: auto;
    padding: 6rem 1rem;
  }

  .hero-stats {
    flex-direction: column;
    gap: 2rem;
  }

  .stat-divider {
    width: 40px;
    height: 2px;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .timeline-item {
    grid-template-columns: 60px 1fr;
    gap: 1rem;
  }

  .timeline-number {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
  }

  .timeline-line {
    left: 30px;
  }

  .progress-rings {
    flex-direction: column;
    align-items: center;
  }

  .cta-actions {
    flex-direction: column;
  }

  .btn-large {
    width: 100%;
  }
}
</style>
