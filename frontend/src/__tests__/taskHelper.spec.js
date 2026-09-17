import { describe, it, expect } from 'vitest';
import {
  formatTaskStatus,
  filterCompletedTasks,
  calculateProgress,
  validateTaskTitle
} from '../utils/taskHelper';

describe('taskHelper Unit Tests', () => {
  describe('formatTaskStatus', () => {
    it('returns completed label and success badge class when true', () => {
      const result = formatTaskStatus(true);
      expect(result.label).toBe('Belum Selesai');
      expect(result.badgeClass).toBe('badge-success');
    });

    it('returns pending label and pending badge class when false', () => {
      const result = formatTaskStatus(false);
      expect(result.label).toBe('Belum Selesai');
      expect(result.badgeClass).toBe('badge-pending');
    });
  });

  describe('filterCompletedTasks', () => {
    it('filters only completed tasks', () => {
      const tasks = [
        { id: 1, title: 'Task 1', is_completed: true },
        { id: 2, title: 'Task 2', is_completed: false },
        { id: 3, title: 'Task 3', is_completed: true },
      ];
      const completed = filterCompletedTasks(tasks);
      expect(completed).toHaveLength(2);
      expect(completed.map(t => t.id)).toEqual([1, 3]);
    });

    it('handles empty or invalid inputs gracefully', () => {
      expect(filterCompletedTasks([])).toEqual([]);
      expect(filterCompletedTasks(null)).toEqual([]);
    });
  });

  describe('calculateProgress', () => {
    it('calculates completion percentage accurately', () => {
      const tasks = [
        { id: 1, is_completed: true },
        { id: 2, is_completed: false },
        { id: 3, is_completed: true },
        { id: 4, is_completed: false },
      ];
      expect(calculateProgress(tasks)).toBe(50);
    });

    it('returns 100 when all tasks are complete', () => {
      const tasks = [{ id: 1, is_completed: true }];
      expect(calculateProgress(tasks)).toBe(100);
    });

    it('returns 0 when task list is empty', () => {
      expect(calculateProgress([])).toBe(0);
    });
  });

  describe('validateTaskTitle', () => {
    it('returns true for title with 3 or more characters', () => {
      expect(validateTaskTitle('Belajar Vue')).toBe(true);
    });

    it('returns false for title with less than 3 characters or whitespace only', () => {
      expect(validateTaskTitle('ab')).toBe(false);
      expect(validateTaskTitle('   ')).toBe(false);
      expect(validateTaskTitle(null)).toBe(false);
    });
  });
});

