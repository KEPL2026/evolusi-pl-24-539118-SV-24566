<template>
  <div class="login-page">
    <div class="card login-card">
      <div class="login-header">
        <h1 class="login-title">Masuk ke Akun</h1>
      </div>

      <!-- Alert Error -->
      <div v-if="auth.error.value" class="alert alert-danger" role="alert">
        <IconAlert :size="18" />
        <div>{{ auth.error.value }}</div>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email" class="form-label">Alamat Email</label>
          <div class="input-wrapper">
            <span class="input-icon">
              <IconMail :size="16" />
            </span>
            <input
              id="email"
              v-model="form.email"
              type="email"
              class="form-input has-icon"
              placeholder="nama@email.com"
              required
              autocomplete="email"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="password" class="form-label">Kata Sandi</label>
          <div class="input-wrapper">
            <span class="input-icon">
              <IconLock :size="16" />
            </span>
            <input
              id="password"
              v-model="form.password"
              type="password"
              class="form-input has-icon"
              placeholder="Masukkan kata sandi"
              required
              autocomplete="current-password"
            />
          </div>
        </div>

        <div class="form-group" style="display: flex; align-items: center; justify-content: space-between;">
          <label style="display: inline-flex; align-items: center; gap: 0.5rem; font-size: 0.88rem; cursor: pointer;">
            <input
              type="checkbox"
              v-model="form.remember"
              style="accent-color: var(--primary);"
            />
            <span>Ingat saya</span>
          </label>
        </div>

        <button
          type="submit"
          class="btn btn-primary"
          style="width: 100%; padding: 0.7rem;"
          :disabled="auth.loading.value"
        >
          <IconLogin :size="16" />
          <span>{{ auth.loading.value ? 'Memproses...' : 'Masuk' }}</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import IconLogo from '../components/icons/IconLogo.vue';
import IconMail from '../components/icons/IconMail.vue';
import IconLock from '../components/icons/IconLock.vue';
import IconAlert from '../components/icons/IconAlert.vue';
import IconLogin from '../components/icons/IconLogin.vue';

const router = useRouter();
const auth = useAuth();
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const form = reactive({
  email: '',
  password: '',
  remember: false
});

async function handleLogin() {
  const result = await auth.login({
    email: form.email,
    password: form.password,
    remember: form.remember
  });

  if (result.success) {
    router.push('/tasks');
  }
}
</script>

<style scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
}

.login-card {
  max-width: 440px;
  width: 100%;
  padding: 2.25rem;
}

.login-header {
  text-align: center;
  margin-bottom: 1.75rem;
}

.login-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text-main);
  letter-spacing: -0.02em;
  margin-bottom: 0.4rem;
}

.login-subtitle {
  font-size: 0.88rem;
  color: var(--text-muted);
  line-height: 1.5;
}

.login-hint {
  margin-top: 1.75rem;
  padding: 0.85rem 1rem;
  background-color: var(--bg-page);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 0.84rem;
  color: var(--text-muted);
}
</style>

