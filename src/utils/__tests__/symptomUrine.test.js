import { describe, it, expect, beforeEach } from 'vitest';
import { 
  addUrineLog, 
  deleteUrineLog, 
  getUrineLogs, 
  addSymptomLog, 
  deleteSymptomLog, 
  getSymptomLogs,
  safeStorage
} from '../storage';
import { URINE_LEVELS } from '../urineConstants';

describe('Symptom and Urine Clinical Tracking', () => {
  beforeEach(() => {
    safeStorage.clear();
    safeStorage.setItem('breyhabitos_urine_logs_v1', '[]');
    safeStorage.setItem('breyhabitos_symptom_logs_v1', '[]');
  });

  describe('Armstrong Urine Hydration Scale', () => {
    it('contains all 5 calibrated clinical hydration tiers', () => {
      expect(URINE_LEVELS).toHaveLength(5);
      const levels = URINE_LEVELS.map(u => u.level);
      expect(levels).toEqual([1, 2, 3, 4, 5]);
    });

    it('assigns correct danger alert to level 5 (concentrated tea)', () => {
      const criticalTier = URINE_LEVELS.find(u => u.level === 5);
      expect(criticalTier?.status).toBe('danger');
      expect(criticalTier?.label).toContain('Crítica');
    });

    it('adds and persists a urine log record', () => {
      const record = {
        level: 4,
        label: 'Concentrada (Ámbar)',
        status: 'warning',
        timestamp: new Date().toISOString(),
      };

      const updated = addUrineLog(record);
      expect(updated.length).toBe(1);
      expect(updated[0].level).toBe(4);
      expect(updated[0].id).toBeDefined();

      const retrieved = getUrineLogs();
      expect(retrieved).toHaveLength(1);
      expect(retrieved[0].level).toBe(4);
    });

    it('deletes an existing urine log by id', () => {
      const added = addUrineLog({ level: 2 });
      const id = added[0].id;

      const remaining = deleteUrineLog(id);
      expect(remaining.length).toBe(0);
      expect(getUrineLogs().length).toBe(0);
    });
  });

  describe('Renal Symptom & Colic Pain Tracking', () => {
    it('adds and retrieves symptom reports with pain rating 1-10', () => {
      const entry = {
        painLevel: 3,
        location: 'Fosa lumbar derecha',
        notes: 'Molestia leve al agacharse',
        date: new Date().toISOString().split('T')[0],
      };

      const list = addSymptomLog(entry);
      expect(list.length).toBe(1);
      expect(list[0].painLevel).toBe(3);
      expect(list[0].id).toBeDefined();

      const all = getSymptomLogs();
      expect(all.length).toBe(1);
      expect(all[0].location).toBe('Fosa lumbar derecha');
    });

    it('deletes symptom report properly', () => {
      const list = addSymptomLog({ painLevel: 5, location: 'Espalda baja' });
      const id = list[0].id;

      const afterDelete = deleteSymptomLog(id);
      expect(afterDelete.length).toBe(0);
    });
  });
});
