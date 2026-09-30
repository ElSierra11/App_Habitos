import { describe, it, expect } from 'vitest';
import { evaluateMeal } from '../renalFoodEvaluator';

describe('Renal Nutrition Evaluator (evaluateMeal)', () => {
  it('returns default prompt when meal text is empty', () => {
    const res = evaluateMeal('');
    expect(res.status).toBe('safe');
    expect(res.headline).toBe('Escribe lo que vas a comer');
    expect(res.analysis).toHaveLength(1);
  });

  it('detects dangerous food items (lithiasis risk) and returns avoid status', () => {
    const res = evaluateMeal('Almorzaré con una gaseosa negra y salchichas fritas');
    expect(res.status).toBe('avoid');
    expect(res.headline).toContain('Cuidado');
    expect(res.analysis.length).toBeGreaterThanOrEqual(1);
    expect(res.hydrationAdvice).toBeDefined();
  });

  it('detects high oxalate vegetables (espinacas) as avoid', () => {
    const res = evaluateMeal('Ensalada de espinacas crudas');
    expect(res.status).toBe('avoid');
    expect(res.analysis.some(r => r.includes('oxalato'))).toBe(true);
  });

  it('detects moderate items like coffee or red meat', () => {
    const res = evaluateMeal('Una taza de cafe con una porción pequeña de carne roja');
    expect(res.status).toBe('moderate');
    expect(res.headline).toContain('moderación');
    expect(res.analysis.length).toBeGreaterThanOrEqual(1);
  });

  it('detects highly beneficial items like lemon and melon as safe and protective', () => {
    const res = evaluateMeal('Pescado a la plancha con limonada natural y porción de melon');
    expect(res.status).toBe('safe');
    expect(res.headline).toContain('Excelente');
    expect(res.analysis.some(r => r.includes('citrato'))).toBe(true);
  });

  it('prioritizes avoid if meal contains both dangerous and healthy items', () => {
    // e.g. eating melon but drinking dark soda
    const res = evaluateMeal('Sandia fresca con una coca cola bien fria');
    expect(res.status).toBe('avoid');
  });

  it('is case-insensitive and trims whitespace', () => {
    const res = evaluateMeal('   LIMONADA NATURAL CON AGUA PURA   ');
    expect(res.status).toBe('safe');
  });
});
