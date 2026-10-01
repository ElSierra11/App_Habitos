import { describe, it, expect, beforeEach } from 'vitest';
import { calculateStreak, safeStorage } from '../storage';

describe('Storage and Calculations (storage.js)', () => {
  beforeEach(() => {
    safeStorage.clear();
  });

  describe('calculateStreak', () => {
    it('returns baseline streak 1 when no water logs exist', () => {
      const res = calculateStreak([], 3000);
      expect(res.streak).toBe(1);
      expect(res.todayTotal).toBe(0);
      expect(res.targetWaterMl).toBe(3000);
    });

    it('calculates today total water correctly', () => {
      const today = new Date().toISOString().split('T')[0];
      const logs = [
        { id: '1', date: today, amountMl: 500 },
        { id: '2', date: today, amountMl: 750 },
        { id: '3', date: today, amountMl: 250 }
      ];

      const res = calculateStreak(logs, 3000);
      expect(res.todayTotal).toBe(1500);
      expect(res.streak).toBeGreaterThanOrEqual(1);
    });

    it('increases streak when past days reached goal (>= 75% target)', () => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const twoDaysAgo = new Date(today);
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

      const logs = [
        { id: '1', date: today.toISOString().split('T')[0], amountMl: 3000 },
        { id: '2', date: yesterday.toISOString().split('T')[0], amountMl: 3200 },
        { id: '3', date: twoDaysAgo.toISOString().split('T')[0], amountMl: 3000 },
      ];

      const res = calculateStreak(logs, 3000);
      expect(res.streak).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Theme Management', () => {
    it('saves and retrieves theme preference correctly', async () => {
      const { saveStoredTheme, getStoredTheme } = await import('../storage');
      saveStoredTheme('dark');
      expect(getStoredTheme()).toBe('dark');
      saveStoredTheme('light');
      expect(getStoredTheme()).toBe('light');
    });
  });

  describe('Full Data Import and Export', () => {
    it('exports all app state and imports it safely', async () => {
      const { getAllAppData, importAllAppData, addWaterLog, getWaterLogs } = await import('../storage');
      
      addWaterLog(500);
      const exported = getAllAppData();
      expect(exported.waterLogs).toBeDefined();
      expect(exported.waterLogs.length).toBeGreaterThan(0);
      expect(exported.exportedAt).toBeDefined();

      const newDataset = {
        ...exported,
        users: [{ id: 'u_test_sync', email: 'test_cross_device@paciente.com', name: 'Paciente Sync', role: 'patient' }],
        waterLogs: [{ id: 'w_imported_99', amountMl: 777, date: '2026-09-30' }],
      };

      importAllAppData(newDataset);
      const updatedLogs = getWaterLogs();
      expect(updatedLogs.some(l => l.id === 'w_imported_99')).toBe(true);

      const { getStoredUsers } = await import('../storage');
      const users = getStoredUsers();
      expect(users.some(u => u.email === 'test_cross_device@paciente.com')).toBe(true);
    });

    it('records detailed meals with photo, dishName, and health evaluation', async () => {
      const { addDetailedMealLog, getMealLogs } = await import('../storage');
      addDetailedMealLog({
        mealId: 'almuerzo',
        mealName: 'Almuerzo',
        dishName: 'Pechuga con ensalada y limón',
        photoUrl: 'data:image/jpeg;base64,samplephoto123',
        evaluation: { status: 'safe', score: 95 },
        notes: 'Sin sal de mesa',
      });

      const today = new Date().toISOString().split('T')[0];
      const meals = getMealLogs();
      const target = meals.find(m => m.date === today && m.mealId === 'almuerzo');
      expect(target).toBeDefined();
      expect(target.dishName).toBe('Pechuga con ensalada y limón');
      expect(target.photoUrl).toBe('data:image/jpeg;base64,samplephoto123');
      expect(target.evaluation.score).toBe(95);
    });

    it('records patient reactions to motivational care notes', async () => {
      const { addCareNote, reactToCareNote, getCareNotes } = await import('../storage');
      addCareNote('¡Tú puedes mi amor!', 'Alejandro', 'love', true);
      const notes = getCareNotes();
      const firstNote = notes[0];

      reactToCareNote(firstNote.id, '❤️', 'Leído con amor');
      const updatedNotes = getCareNotes();
      const updated = updatedNotes.find(n => n.id === firstNote.id);
      expect(updated.reactions).toHaveLength(1);
      expect(updated.reactions[0].emoji).toBe('❤️');
      expect(updated.reactions[0].label).toBe('Leído con amor');
    });
  });
});

