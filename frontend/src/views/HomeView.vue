<template>
  <div class="home-view">
    <section class="hero card">
      <h1 class="hero-title">Aplikasi Manajemen Tugas</h1>
      <p class="hero-subtitle">
        Proyek frontend modern berbasis <strong>Vue 3</strong> yang terintegrasi dengan REST API serta autentikasi dari <strong>Laravel</strong>
      </p>

      <div style="display: flex; justify-content: center; gap: 0.75rem; flex-wrap: wrap;">
        <router-link to="/tasks" class="btn btn-primary">
          <IconList :size="16" />
          <span>Buka Daftar Tugas</span>
        </router-link>
        <router-link v-if="!auth.isAuthenticated.value" to="/login" class="btn btn-outline">
          <IconLogin :size="16" />
          <span>Masuk ke Akun</span>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useAuth } from '../composables/useAuth';
import IconLogo from '../components/icons/IconLogo.vue';
import IconList from '../components/icons/IconList.vue';
import IconCheck from '../components/icons/IconCheck.vue';
import IconLogin from '../components/icons/IconLogin.vue';

const auth = useAuth();
</script>
