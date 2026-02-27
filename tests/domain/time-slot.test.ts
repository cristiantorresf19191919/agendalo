import { describe, it, expect } from 'vitest';
import { timeToMinutes, minutesToTime, doTimeSlotsOverlap, TimeSlot } from '@/domain/value-objects/time-slot';

describe('timeToMinutes', () => {
  it('converts "00:00" to 0', () => {
    expect(timeToMinutes('00:00')).toBe(0);
  });

  it('converts "09:30" to 570', () => {
    expect(timeToMinutes('09:30')).toBe(570);
  });

  it('converts "23:59" to 1439', () => {
    expect(timeToMinutes('23:59')).toBe(1439);
  });

  it('converts "12:00" (noon) to 720', () => {
    expect(timeToMinutes('12:00')).toBe(720);
  });

  it('converts "01:01" to 61', () => {
    expect(timeToMinutes('01:01')).toBe(61);
  });
});

describe('minutesToTime', () => {
  it('converts 0 to "00:00"', () => {
    expect(minutesToTime(0)).toBe('00:00');
  });

  it('converts 570 to "09:30"', () => {
    expect(minutesToTime(570)).toBe('09:30');
  });

  it('converts 1439 to "23:59"', () => {
    expect(minutesToTime(1439)).toBe('23:59');
  });

  it('converts 720 to "12:00"', () => {
    expect(minutesToTime(720)).toBe('12:00');
  });

  it('pads single-digit hours and minutes with leading zeros', () => {
    expect(minutesToTime(65)).toBe('01:05');
  });
});

describe('doTimeSlotsOverlap', () => {
  it('returns true for overlapping slots', () => {
    const a: TimeSlot = { start: '09:00', end: '10:00' };
    const b: TimeSlot = { start: '09:30', end: '10:30' };
    expect(doTimeSlotsOverlap(a, b)).toBe(true);
  });

  it('returns true when one slot is fully contained in another', () => {
    const outer: TimeSlot = { start: '08:00', end: '12:00' };
    const inner: TimeSlot = { start: '09:00', end: '10:00' };
    expect(doTimeSlotsOverlap(outer, inner)).toBe(true);
  });

  it('returns true when slots are identical', () => {
    const a: TimeSlot = { start: '10:00', end: '11:00' };
    const b: TimeSlot = { start: '10:00', end: '11:00' };
    expect(doTimeSlotsOverlap(a, b)).toBe(true);
  });

  it('returns false for non-overlapping slots', () => {
    const a: TimeSlot = { start: '09:00', end: '10:00' };
    const b: TimeSlot = { start: '11:00', end: '12:00' };
    expect(doTimeSlotsOverlap(a, b)).toBe(false);
  });

  it('returns false for adjacent slots (end of one equals start of other)', () => {
    const a: TimeSlot = { start: '09:00', end: '10:00' };
    const b: TimeSlot = { start: '10:00', end: '11:00' };
    expect(doTimeSlotsOverlap(a, b)).toBe(false);
  });

  it('returns false for adjacent slots in reverse order', () => {
    const a: TimeSlot = { start: '10:00', end: '11:00' };
    const b: TimeSlot = { start: '09:00', end: '10:00' };
    expect(doTimeSlotsOverlap(a, b)).toBe(false);
  });

  it('returns true when slot b starts before slot a ends', () => {
    const a: TimeSlot = { start: '14:00', end: '15:30' };
    const b: TimeSlot = { start: '15:00', end: '16:00' };
    expect(doTimeSlotsOverlap(a, b)).toBe(true);
  });
});
