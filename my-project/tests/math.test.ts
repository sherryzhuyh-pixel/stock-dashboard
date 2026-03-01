import { describe, it, expect } from 'vitest';
import { add, subtract, multiply, divide } from '../src/utils/math';

describe('math utils', () => {
  describe('add', () => {
    it('should return sum of two numbers', () => {
      expect(add(1, 2)).toBe(3);
    });
  });

  describe('subtract', () => {
    it('should return difference of two numbers', () => {
      expect(subtract(5, 3)).toBe(2);
    });
  });

  describe('multiply', () => {
    it('should return product of two numbers', () => {
      expect(multiply(3, 4)).toBe(12);
    });
  });

  describe('divide', () => {
    it('should return quotient of two numbers', () => {
      expect(divide(10, 2)).toBe(5);
    });

    it('should throw error when dividing by zero', () => {
      expect(() => divide(10, 0)).toThrow('Division by zero');
    });
  });
});
