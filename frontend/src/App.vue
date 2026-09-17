<template>
  <div class="app-container">
    <nav class="navbar">
      <div class="nav-inner">
        <router-link to="/" class="nav-brand">
          <span>TaskFlow</span>
        </router-link>

        <div class="nav-menu">
          <div class="nav-links">
            <router-link to="/" class="nav-link">Beranda</router-link>
            <router-link to="/tasks" class="nav-link">Daftar Tugas</router-link>
          </div>

          <div class="nav-auth">
            <template v-if="auth.isAuthenticated.value">
              <span class="user-badge" :title="auth.user.value?.email">
                <IconUser :size="14" />
                <span>{{ auth.userDisplayName.value }}</span>
              </span>
              <button @click="handleLogout" class="btn btn-outline btn-sm">
                <IconLogout :size="14" />
                <span>Keluar</span>
              </button>
            </template>
            <template v-else>
              <router-link to="/login" class="btn btn-primary btn-sm">
                <IconLogin :size="14" />
                <span>Masuk</span>
              </router-link>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <main class="main-content">
      <router-view />
    </main>

    <footer class="footer">
      <p>Praktikum Konstruksi dan Evolusi Perangkat Lunak &copy; 2026</p>
    </footer>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from './composables/useAuth';
import IconLogo from './components/icons/IconLogo.vue';
import IconUser from './components/icons/IconUser.vue';
import IconLogin from './components/icons/IconLogin.vue';
import IconLogout from './components/icons/IconLogout.vue';

const router = useRouter();
const auth = useAuth();

async function handleLogout() {
  await auth.logout();
  router.push('/login');
}

onMounted(() => {
  auth.checkAuth();
});
</script>
