<template>
  <div class="task-view">
    <!-- Header Section -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
      <div>
        <h1 style="font-size: 1.6rem; font-weight: 700; color: var(--text-main); letter-spacing: -0.015em;">
          Daftar Tugas
        </h1>
      </div>

      <button @click="fetchTasks" class="btn btn-outline" :disabled="loading">
        <IconRefresh :size="15" />
        <span>refresh</span>
      </button>
    </div>

    <!-- Stat Grid -->
    <div class="stat-grid">
      <div class="stat-box">
        <div class="stat-num">{{ tasks.length }}</div>
        <div class="stat-label">Total Tugas</div>
      </div>
      <div class="stat-box">
        <div class="stat-num" style="color: var(--primary);">{{ completedCount }}</div>
        <div class="stat-label">Selesai</div>
      </div>
      <div class="stat-box">
        <div class="stat-num" style="color: var(--warning);">{{ progressPercent }}%</div>
        <div class="stat-label">Tugas Selesai</div>
      </div>
    </div>

    <!-- Add Task Form -->
    <form @submit.prevent="createTask" class="card task-add-card">

      <div class="form-group" style="margin-bottom: 0.75rem;">
        <label for="task-title-input" class="form-label">Judul Tugas</label>
        <input
          id="task-title-input"
          v-model="newTaskTitle"
          type="text"
          class="form-input"
          placeholder="Contoh: Menyelesaikan laporan praktikum"
          :disabled="submitting"
          required
        />
      </div>

      <div class="form-group" style="margin-bottom: 1rem;">
        <label for="task-desc-input" class="form-label">Deskripsi Tugas <span style="font-weight: 400; color: var(--text-dim);">(Opsional)</span></label>
        <textarea
          id="task-desc-input"
          v-model="newTaskDescription"
          class="form-input"
          placeholder="Tulis keterangan atau rincian tugas di sini..."
          rows="2"
          :disabled="submitting"
          style="resize: vertical;"
        ></textarea>
      </div>

      <div style="display: flex; justify-content: flex-end;">
        <button
          type="submit"
          class="btn btn-primary"
          :disabled="submitting || !newTaskTitle.trim()"
        >
          <IconPlus :size="15" />
          <span>{{ submitting ? 'Menyimpan...' : 'Tambah Tugas' }}</span>
        </button>
      </div>
    </form>

    <!-- Error Alert -->
    <div v-if="error" class="alert alert-danger" role="alert">
      <IconAlert :size="18" />
      <div>
        <strong>Pemberitahuan:</strong> {{ error }}
        <div style="font-size: 0.82rem; margin-top: 0.25rem;">
          Pastikan backend Laravel sedang berjalan di <code>{{ apiUrl }}</code>.
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="card" style="text-align: center; padding: 3rem; color: var(--text-muted);">
      <p style="font-weight: 500;">Memuat data tugas dari server...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="tasks.length === 0" class="card" style="text-align: center; padding: 3rem; color: var(--text-muted);">
      <p style="font-size: 1.05rem; font-weight: 600; color: var(--text-main); margin-bottom: 0.35rem;">
        Belum ada tugas yang tersedia
      </p>
      <p style="font-size: 0.88rem;">Gunakan formulir di atas untuk menambahkan tugas baru.</p>
    </div>

    <!-- Task List (Cards with Interactive Checkbox) -->
    <div v-else class="task-list">
      <div
        v-for="task in tasks"
        :key="task.id"
        class="task-card"
        :class="{ 'is-completed': task.is_completed }"
      >
        <!-- Interactive Checkbox -->
        <div class="task-checkbox-wrapper">
          <input
            type="checkbox"
            :id="`task-chk-${task.id}`"
            :checked="task.is_completed"
            @change="toggleTask(task)"
            class="task-checkbox"
            :disabled="updatingTaskId === task.id"
            :title="task.is_completed ? 'Tandai belum selesai' : 'Tandai sudah selesai'"
          />
        </div>

        <!-- Task Info -->
        <div style="flex: 1; min-width: 0;">
          <label
            :for="`task-chk-${task.id}`"
            class="task-title"
            :class="{ 'completed-text': task.is_completed }"
            style="cursor: pointer;"
          >
            {{ task.title }}
          </label>
          <div v-if="task.description" class="task-desc">{{ task.description }}</div>
        </div>

        <!-- Status Badge & Delete Action -->
        <div style="display: flex; align-items: center; gap: 0.75rem; margin-left: 0.75rem; flex-shrink: 0;">
          <span :class="['badge', getBadgeInfo(task.is_completed).badgeClass]">
            <IconCheck v-if="task.is_completed" :size="12" />
            <span>{{ getBadgeInfo(task.is_completed).label }}</span>
          </span>

          <button
            type="button"
            @click="deleteTask(task.id)"
            class="btn-icon-danger"
            title="Hapus tugas"
            :disabled="deletingTaskId === task.id"
          >
            <IconTrash :size="15" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { formatTaskStatus, filterCompletedTasks, calculateProgress } from '../utils/taskHelper';
import IconRefresh from '../components/icons/IconRefresh.vue';
import IconCheck from '../components/icons/IconCheck.vue';
import IconAlert from '../components/icons/IconAlert.vue';
import IconPlus from '../components/icons/IconPlus.vue';
import IconTrash from '../components/icons/IconTrash.vue';

// Read API URL strictly from environment variable VITE_API_URL
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const tasks = ref([]);
const loading = ref(true);
const error = ref(null);
const newTaskTitle = ref('');
const newTaskDescription = ref('');
const submitting = ref(false);
const updatingTaskId = ref(null);
const deletingTaskId = ref(null);

const completedCount = computed(() => filterCompletedTasks(tasks.value).length);
const progressPercent = computed(() => calculateProgress(tasks.value));

function getBadgeInfo(isCompleted) {
  return formatTaskStatus(isCompleted);
}

// Fetch all tasks from backend
async function fetchTasks() {
  loading.value = true;
  error.value = null;

  try {
    const response = await axios.get(`${apiUrl}/api/tasks`);
    tasks.value = Array.isArray(response.data) ? response.data : [];
  } catch (err) {
    error.value = 'Tidak dapat terhubung ke server Laravel API.';
    console.error('Error fetching tasks:', err);
  } finally {
    loading.value = false;
  }
}

// Toggle task completion status via PUT /api/tasks/{id}
async function toggleTask(task) {
  const previousState = task.is_completed;
  const nextState = !previousState;

  // Optimistic UI update
  task.is_completed = nextState;
  updatingTaskId.value = task.id;
  error.value = null;

  try {
    const response = await axios.put(`${apiUrl}/api/tasks/${task.id}`, {
      is_completed: nextState
    });
    // Sync with server response
    if (response.data && typeof response.data.is_completed !== 'undefined') {
      task.is_completed = Boolean(response.data.is_completed);
    }
  } catch (err) {
    // Rollback on error
    task.is_completed = previousState;
    error.value = 'Gagal memperbarui status tugas. Periksa koneksi backend.';
    console.error('Error toggling task:', err);
  } finally {
    updatingTaskId.value = null;
  }
}

// Create new task via POST /api/tasks
async function createTask() {
  const title = newTaskTitle.value.trim();
  const description = newTaskDescription.value.trim();
  if (!title) return;

  submitting.value = true;
  error.value = null;

  try {
    const response = await axios.post(`${apiUrl}/api/tasks`, {
      title,
      description: description || null,
      is_completed: false
    });
    if (response.data) {
      tasks.value.unshift(response.data);
      newTaskTitle.value = '';
      newTaskDescription.value = '';
    }
  } catch (err) {
    error.value = 'Gagal menambahkan tugas baru.';
    console.error('Error creating task:', err);
  } finally {
    submitting.value = false;
  }
}

// Delete task via DELETE /api/tasks/{id}
async function deleteTask(taskId) {
  deletingTaskId.value = taskId;
  error.value = null;

  try {
    await axios.delete(`${apiUrl}/api/tasks/${taskId}`);
    tasks.value = tasks.value.filter(t => t.id !== taskId);
  } catch (err) {
    error.value = 'Gagal menghapus tugas.';
    console.error('Error deleting task:', err);
  } finally {
    deletingTaskId.value = null;
  }
}

onMounted(() => {
  fetchTasks();
});
</script>
