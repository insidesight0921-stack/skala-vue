<script setup>
defineProps({ title: String })
</script>
<template>
  <div class="card">
    <h3 v-if="title">{{ title }}</h3>
    <slot></slot>
  </div>
</template>
