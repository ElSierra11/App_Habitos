import { describe, it, expect } from 'vitest';
import { isNotificationSupported, getNotificationPermissionState } from '../notifications';

describe('Notifications Utility (notifications.js)', () => {
  it('returns boolean for isNotificationSupported without crashing', () => {
    const supported = isNotificationSupported();
    expect(typeof supported).toBe('boolean');
  });

  it('returns valid permission state or unsupported', () => {
    const state = getNotificationPermissionState();
    expect(['unsupported', 'default', 'granted', 'denied']).toContain(state);
  });
});
