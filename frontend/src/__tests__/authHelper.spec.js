import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validatePassword,
  formatUserDisplayName
} from '../utils/authHelper';

describe('authHelper Unit Tests', () => {
  describe('validateEmail', () => {
    it('accepts valid email addresses', () => {
      expect(validateEmail('user@example.com')).toBe(true);
      expect(validateEmail('test@gmail.com')).toBe(true);
      expect(validateEmail('john.doe@univ.ac.id')).toBe(true);
    });

    it('rejects invalid email formats', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
      expect(validateEmail(null)).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('accepts passwords with 6 or more characters', () => {
      expect(validatePassword('secret123')).toBe(true);
      expect(validatePassword('123456')).toBe(true);
    });

    it('rejects passwords shorter than 6 characters', () => {
      expect(validatePassword('12345')).toBe(false);
      expect(validatePassword('')).toBe(false);
      expect(validatePassword(null)).toBe(false);
    });
  });

  describe('formatUserDisplayName', () => {
    it('returns user name if available', () => {
      expect(formatUserDisplayName({ name: 'Budi Santoso', email: 'budi@test.com' })).toBe('Budi Santoso');
    });

    it('falls back to username prefix from email if name is missing', () => {
      expect(formatUserDisplayName({ email: 'john_dev@gmail.com' })).toBe('john_dev');
    });

    it('returns Tamu if user is null or undefined', () => {
      expect(formatUserDisplayName(null)).toBe('Tamu');
      expect(formatUserDisplayName(undefined)).toBe('Tamu');
    });
  });
});

