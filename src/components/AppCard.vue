<script setup>
defineProps({
  title: String,
  eyebrow: String,
})
</script>

<template>
  <section class="app-card">
    <header v-if="title || eyebrow || $slots.action" class="app-card__head">
      <div>
        <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
        <h3 v-if="title" class="app-card__title">{{ title }}</h3>
      </div>
      <div class="app-card__action">
        <slot name="action" />
      </div>
    </header>
    <slot />
  </section>
</template>

<style scoped>
.app-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  box-shadow: var(--shadow);
  padding: var(--sp-3);
  margin-bottom: var(--sp-2);
}
.app-card__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: var(--sp-2);
}
.app-card__title {
  font-size: 17px;
  font-weight: 700;
}
.app-card__action {
  flex-shrink: 0;
}
</style>
