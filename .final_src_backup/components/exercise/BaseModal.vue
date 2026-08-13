<script setup>
// 모달을 닫으라는 신호를 부모에게 올려보냄
const emit = defineEmits(['close'])
</script>

<template>
  <!-- 어두운 배경막. 배경 클릭 시 닫기 -->
  <div class="modal-backdrop" @click="emit('close')">
    <!-- 팝업 박스. .stop으로 박스 클릭이 배경까지 안 퍼지게 -->
    <div class="modal-box" @click.stop>
      <slot></slot>
      <button class="modal-close" @click="emit('close')">닫기</button>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-box {
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  min-width: 280px;
  max-width: 90%;
}
.modal-close {
  margin-top: 16px;
  padding: 6px 16px;
  cursor: pointer;
}
</style>