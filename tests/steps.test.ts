import { describe, test, expect } from 'bun:test';
import { allSteps, categories } from '../src/constants.ts';

describe('step definitions', () => {
  test('all step IDs are unique', () => {
    const ids = allSteps.map(s => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('every step has required fields', () => {
    for (const step of allSteps) {
      expect(step.id).toBeTruthy();
      expect(step.title).toBeTruthy();
      expect(step.description).toBeTruthy();
      expect(step.category).toBeTruthy();
      expect(step.commands.length).toBeGreaterThan(0);
      expect(['low', 'medium', 'high', 'critical']).toContain(step.dangerLevel);
      expect(typeof step.requiresSudo).toBe('boolean');
    }
  });

  test('sudo flag matches commands', () => {
    for (const step of allSteps) {
      const hasSudoCmd = step.commands.some(c => c.startsWith('sudo '));
      if (hasSudoCmd) {
        expect(step.requiresSudo).toBe(true);
      }
    }
  });

  test('every step belongs to a valid category', () => {
    const categoryIds = new Set(categories.map(c => c.id));
    for (const step of allSteps) {
      expect(categoryIds.has(step.category)).toBe(true);
    }
  });

  test('categories aggregate correctly', () => {
    const totalFromCategories = categories.reduce((n, c) => n + c.steps.length, 0);
    expect(totalFromCategories).toBe(allSteps.length);
  });

  test('no empty commands', () => {
    for (const step of allSteps) {
      for (const cmd of step.commands) {
        expect(cmd.trim().length).toBeGreaterThan(0);
      }
    }
  });

  test('high/critical danger steps have warnings', () => {
    for (const step of allSteps) {
      if (step.dangerLevel === 'critical' || step.dangerLevel === 'high') {
        expect(step.warning).toBeTruthy();
      }
    }
  });

  test('has at least 60 steps total', () => {
    expect(allSteps.length).toBeGreaterThanOrEqual(60);
  });

  test('all 11 categories present', () => {
    expect(categories.length).toBe(11);
  });
});
