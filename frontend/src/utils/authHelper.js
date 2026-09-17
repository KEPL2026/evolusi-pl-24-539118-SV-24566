/**
 * Validate email address format.
 * @param {string} email
 * @returns {boolean}
 */
export function validateEmail(email) {
  if (typeof email !== 'string') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

/**
 * Validate password (minimum 6 characters).
 * @param {string} password
 * @returns {boolean}
 */
export function validatePassword(password) {
  if (typeof password !== 'string') return false;
  return password.length >= 6;
}

/**
 * Format user display name from user object.
 * @param {Object|null} user
 * @returns {string}
 */
export function formatUserDisplayName(user) {
  if (!user || typeof user !== 'object') return 'Tamu';
  if (user.name && typeof user.name === 'string' && user.name.trim().length > 0) {
    return user.name.trim();
  }
  if (user.email && typeof user.email === 'string') {
    return user.email.split('@')[0];
  }
  return 'Pengguna';
}

