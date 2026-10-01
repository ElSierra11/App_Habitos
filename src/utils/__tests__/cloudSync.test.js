import { describe, it, expect } from 'vitest';
import { mergeAppData, testCloudConnection } from '../cloudSync';

describe('Cloud Synchronization Engine (cloudSync)', () => {
  describe('mergeAppData', () => {
    it('returns local if cloud is null or empty', () => {
      const local = { waterLogs: [{ id: 'w1', amountMl: 500 }] };
      const merged = mergeAppData(local, null);
      expect(merged).toEqual(local);
    });

    it('returns cloud if local is null', () => {
      const cloud = { waterLogs: [{ id: 'w1', amountMl: 500 }] };
      const merged = mergeAppData(null, cloud);
      expect(merged).toEqual(cloud);
    });

    it('merges water logs without duplicates by id', () => {
      const local = {
        waterLogs: [
          { id: 'w1', amountMl: 250, date: '2026-09-30' },
          { id: 'w2', amountMl: 500, date: '2026-09-30' }
        ]
      };
      const cloud = {
        waterLogs: [
          { id: 'w2', amountMl: 500, date: '2026-09-30' },
          { id: 'w3', amountMl: 350, date: '2026-09-30' } // added from Brey's phone
        ]
      };

      const merged = mergeAppData(local, cloud);
      expect(merged.waterLogs).toHaveLength(3);
      const ids = merged.waterLogs.map(l => l.id);
      expect(ids).toContain('w1');
      expect(ids).toContain('w2');
      expect(ids).toContain('w3');
    });

    it('merges meal logs by unique date and mealId combination', () => {
      const local = {
        mealLogs: [
          { date: '2026-09-30', mealId: 'desayuno', completed: true }
        ]
      };
      const cloud = {
        mealLogs: [
          { date: '2026-09-30', mealId: 'almuerzo', completed: true }
        ]
      };

      const merged = mergeAppData(local, cloud);
      expect(merged.mealLogs).toHaveLength(2);
    });

    it('merges symptom and pain logs without duplicates', () => {
      const local = {
        symptomLogs: [
          { id: 's1', painLevel: 2, location: 'Fosa lumbar derecha' }
        ]
      };
      const cloud = {
        symptomLogs: [
          { id: 's1', painLevel: 2, location: 'Fosa lumbar derecha' },
          { id: 's2', painLevel: 1, location: 'Fosa lumbar izquierda' }
        ]
      };

      const merged = mergeAppData(local, cloud);
      expect(merged.symptomLogs).toHaveLength(2);
      expect(merged.symptomLogs.map(s => s.id)).toEqual(expect.arrayContaining(['s1', 's2']));
    });

    it('merges care notes seamlessly from Alejandro to Brey', () => {
      const local = {
        careNotes: [
          { id: 'cn1', message: 'Toma agua amor' }
        ]
      };
      const cloud = {
        careNotes: [
          { id: 'cn1', message: 'Toma agua amor' },
          { id: 'cn2', message: 'Orgulloso de tu recuperación' }
        ]
      };

      const merged = mergeAppData(local, cloud);
      expect(merged.careNotes).toHaveLength(2);
    });

    it('merges registered users seamlessly between PC and mobile phone', () => {
      const local = {
        users: [
          { id: 'u1', email: 'alejosierra656@gmail.com', name: 'Alejandro', role: 'admin' }
        ]
      };
      const cloud = {
        users: [
          { id: 'u1', email: 'alejosierra656@gmail.com', name: 'Alejandro', role: 'admin' },
          { id: 'u2', email: 'brey@paciente.com', name: 'Brey', role: 'patient' }
        ]
      };

      const merged = mergeAppData(local, cloud);
      expect(merged.users).toHaveLength(2);
      expect(merged.users.map(u => u.email)).toContain('brey@paciente.com');
    });

    it('preserves meal photoUrl and evaluation when merging meals', () => {
      const local = {
        mealLogs: [
          { id: 'm1', date: '2026-09-30', mealId: 'almuerzo', dishName: 'Pollo' }
        ]
      };
      const cloud = {
        mealLogs: [
          { id: 'm1', date: '2026-09-30', mealId: 'almuerzo', dishName: 'Pollo', photoUrl: 'data:image/jpeg;base64,abc123', evaluation: { status: 'safe', score: 95 } }
        ]
      };

      const merged = mergeAppData(local, cloud);
      expect(merged.mealLogs[0].photoUrl).toBe('data:image/jpeg;base64,abc123');
      expect(merged.mealLogs[0].evaluation.score).toBe(95);
    });
  });

  describe('Device Pairing Tokens (Cross-device PC & Mobile linking)', () => {
    it('generates a valid portable pairing token and restores it on mobile', async () => {
      const { generateDevicePairingToken, applyDevicePairingToken } = await import('../cloudSync');
      const samplePayload = {
        users: [{ id: 'u100', email: 'brey@salud.com', name: 'Brey' }],
        cloudConfig: { roomId: 'test_room', enabled: true },
        currentUser: { id: 'u100', email: 'brey@salud.com', name: 'Brey', role: 'patient' }
      };

      const token = generateDevicePairingToken(samplePayload);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');

      const restored = applyDevicePairingToken(token);
      expect(restored.success).toBe(true);
      expect(restored.payload.users[0].email).toBe('brey@salud.com');
      expect(restored.payload.currentUser.name).toBe('Brey');
      expect(restored.payload.cloudConfig.roomId).toBe('test_room');
    });

    it('handles malformed pairing tokens safely', async () => {
      const { applyDevicePairingToken } = await import('../cloudSync');
      const res = applyDevicePairingToken('not-a-valid-token');
      expect(res.success).toBe(false);
      expect(res.error).toBeDefined();
    });
  });

  describe('testCloudConnection', () => {
    it('fails gracefully when credentials are empty', async () => {
      const res = await testCloudConnection({});
      expect(res.success).toBe(false);
      expect(res.error).toContain('Falta la URL');
    });
  });

  describe('Offline Queue & Status Subscription', () => {
    it('queues, retrieves, and clears offline sync payloads', async () => {
      const { queueOfflineSync, getOfflineQueue, clearOfflineQueue } = await import('../cloudSync');
      clearOfflineQueue();

      const sampleData = { waterLogs: [{ id: 'w_off_1', amountMl: 250 }] };
      queueOfflineSync(sampleData);

      const queued = getOfflineQueue();
      expect(queued).not.toBeNull();
      expect(queued.data.waterLogs[0].id).toBe('w_off_1');

      clearOfflineQueue();
      expect(getOfflineQueue()).toBeNull();
    });

    it('notifies status subscribers when sync status changes', async () => {
      const { subscribeSyncStatus, setSyncStatus, getSyncStatus } = await import('../cloudSync');
      let latestStatus = null;
      const unsubscribe = subscribeSyncStatus((s) => {
        latestStatus = s;
      });

      setSyncStatus({ state: 'syncing', error: null });
      expect(latestStatus?.state).toBe('syncing');

      setSyncStatus({ state: 'synced', lastSyncTime: '2026-09-30T12:00:00Z' });
      expect(latestStatus?.state).toBe('synced');
      expect(getSyncStatus().lastSyncTime).toBe('2026-09-30T12:00:00Z');

      unsubscribe();
    });

    it('returns unconfigured gracefully when config is disabled', async () => {
      const { performTwoWaySync } = await import('../cloudSync');
      const res = await performTwoWaySync({ enabled: false }, {});
      expect(res.success).toBe(false);
      expect(res.reason).toBe('unconfigured');
    });
  });
});

