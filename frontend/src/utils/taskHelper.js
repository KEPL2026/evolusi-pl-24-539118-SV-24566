/**
 * Format status label and badge CSS class based on task completion.
 * @param {boolean} isCompleted
 * @returns {{ label: string, badgeClass: string }}
 */
export function formatTaskStatus(isCompleted) {
  if (isCompleted) {
    return {
      label: 'Selesai',
      badgeClass: 'badge-success'
    };
  }
  return {
    label: 'Belum Selesai',
    badgeClass: 'badge-pending'
  };
}

/**
 * Filter list of tasks to only include completed tasks.
 * @param {Array} tasks
 * @returns {Array}
 */
export function filterCompletedTasks(tasks = []) {
  if (!Array.isArray(tasks)) return [];
  return tasks.filter(task => task && Boolean(task.is_completed));
}

/**
 * Calculate completion percentage.
 * @param {Array} tasks
 * @returns {number} 0 - 100
 */
export function calculateProgress(tasks = []) {
  if (!Array.isArray(tasks) || tasks.length === 0) return 0;
  const completed = filterCompletedTasks(tasks);
  return Math.round((completed.length / tasks.length) * 100);
}

/**
 * Validate task title string.
 * @param {string} title
 * @returns {boolean}
 */
export function validateTaskTitle(title) {
  if (typeof title !== 'string') return false;
  return title.trim().length >= 3;
}

