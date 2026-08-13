<script setup>
import { watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useConfigStore } from './stores/configStore.js'
import SettingsToggle from './components/SettingsToggle.vue'

const config = useConfigStore()
const route = useRoute()

// Element Plus 다크 테마는 html.dark 를 사용 → 우리 테마와 동기화
watchEffect(() => {
  document.documentElement.classList.toggle('dark', config.isDark)
})

const nav = [
  { to: '/dashboard', label: '대시보드', icon: '🏠' },
  { to: '/map', label: '지도', icon: '🗺️' },
  { to: '/commute', label: '통근', icon: '🚇' },
  { to: '/about', label: '소개', icon: 'ℹ️' },
]
</script>

<template>
  <div class="app" :class="{ dark: config.isDark }">
    <header class="topbar">
      <div class="topbar__inner">
        <RouterLink to="/" class="brand">
          <span class="brand__logo">☀︎</span>
          <span class="brand__name">Weatherly</span>
        </RouterLink>

        <el-menu
          :default-active="route.path"
          mode="horizontal"
          router
          :ellipsis="false"
          class="nav-menu"
        >
          <el-menu-item v-for="n in nav" :key="n.to" :index="n.to">
            <span class="nav__icon">{{ n.icon }}</span>
            <span class="nav__label">{{ n.label }}</span>
          </el-menu-item>
        </el-menu>

        <SettingsToggle />
      </div>
    </header>

    <main class="content">
      <RouterView v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
}
.topbar {
  position: sticky;
  top: 0;
  z-index: 20;
  background: color-mix(in srgb, var(--surface) 88%, transparent);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
}
.topbar__inner {
  max-width: 960px;
  margin: 0 auto;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
}
.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 800;
  font-size: 18px;
  letter-spacing: -0.02em;
}
.brand__logo {
  color: var(--accent);
  font-size: 20px;
}
/* Element Plus el-menu 를 상단바에 맞게 테마 */
.nav-menu {
  margin-left: auto;
  border-bottom: none;
  --el-menu-bg-color: transparent;
  --el-menu-hover-bg-color: var(--surface-2);
  --el-menu-text-color: var(--text-muted);
  --el-menu-active-color: var(--accent);
  --el-menu-border-color: transparent;
  --el-menu-item-height: 46px;
}
.nav-menu :deep(.el-menu-item) {
  font-size: 14px;
  font-weight: 600;
  border-radius: var(--r-md);
  padding: 0 14px;
  margin: 0 2px;
}
.nav-menu :deep(.el-menu-item.is-active) {
  background: var(--accent-weak);
}
.nav__icon {
  font-size: 15px;
  margin-right: 6px;
}
.content {
  max-width: 960px;
  margin: 0 auto;
  padding: 28px 24px 64px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 640px) {
  .topbar__inner,
  .content {
    padding-left: 16px;
    padding-right: 16px;
  }
  .nav__label {
    display: none;
  }
  .nav-menu :deep(.el-menu-item) {
    padding: 0 10px;
  }
  .nav__icon {
    margin-right: 0;
  }
}
</style>
