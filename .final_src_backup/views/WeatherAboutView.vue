<script setup>
// 정적 소개 페이지라 로직이 필요 없어요.
</script>

<template>
  <div class="about-view">
    <div class="about-card">
      <h2>ℹ️ 서비스 소개</h2>
      <hr />
      <p>본 앱은 Vue 3 및 Vue Router 4 기반으로 제작된 실습용 기상 관측 대시보드입니다.</p>
      <ul>
        <li><code>components/exercise/</code> 폴더 내부의 독립 부품 컴포넌트 연동</li>
        <li>클라이언트 사이드 라우팅을 통한 새로고침 없는 화면 전환</li>
        <li>동적 경로 매칭을 활용한 도시별 상세 페이지 제공</li>
      </ul>
    </div>

    <RouterLink to="/" class="home-btn">대시보드 홈으로 이동</RouterLink>
  </div>
</template>

<style scoped>
.about-card {
  background: var(--surface);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  padding: var(--space-3);
  margin-bottom: var(--space-2);
}
.about-card h2 { margin: 0 0 8px; font-size: 18px; font-weight: 700; }
.about-card hr {
  border: none;
  border-top: 1px solid var(--border);
  margin: 12px 0;
}
.about-card p,
.about-card li { color: var(--text-secondary); font-size: 14px; }
.about-card li { margin: 6px 0; }
code {
  background: var(--bg-muted);
  color: var(--accent);
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 0.9em;
}
.home-btn {
  display: block;
  text-align: center;
  padding: 13px;
  background: var(--btn-bg);
  color: var(--btn-fg);
  border-radius: var(--radius-btn);
  text-decoration: none;
  font-weight: 600;
}
</style>