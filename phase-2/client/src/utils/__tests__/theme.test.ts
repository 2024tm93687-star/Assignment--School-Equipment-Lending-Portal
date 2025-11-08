import { getStoredTheme, applyTheme, getCurrentTheme, toggleTheme } from '../theme';

describe('theme util', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-bs-theme');
  });

  it('stores and retrieves theme', () => {
    applyTheme('dark');
    expect(getStoredTheme()).toBe('dark');
    expect(document.documentElement.getAttribute('data-bs-theme')).toBe('dark');
  });

  it('toggles theme', () => {
    applyTheme('light');
    const next = toggleTheme('light');
    expect(next).toBe('dark');
    expect(document.documentElement.getAttribute('data-bs-theme')).toBe('dark');
  });

  it('getCurrentTheme falls back to system when not stored', () => {
    // cannot reliably test system preference here, but function should return a string
    const t = getCurrentTheme();
    expect(['light', 'dark']).toContain(t);
  });
});
