import test from 'node:test';
import assert from 'node:assert/strict';
import { slides, shortRoute, shortTimes, reviews, defaultClinic, calculateSavings, validateClinic, sanitizeSession, getPlan } from '../src/session.js';
import { simpleSlides, simpleTimings, businessCase, improvementCosts, feedbackAnalysis } from '../src/simpleSession.js';

test('The short talk connects feedback and an improvement before the final choice', () => {
  assert.deepEqual(simpleSlides.map(slide => slide.kind), ['cover', 'choice', 'reveal', 'feedback', 'analysis', 'change', 'impact', 'rechoice', 'ai', 'close', 'connection']);
  for (const minutes of [5, 7, 10]) {
    assert.equal(simpleTimings[minutes].length, simpleSlides.length);
    assert.equal(simpleTimings[minutes].reduce((a, b) => a + b, 0), minutes * 60);
  }
});

test('The assumed profit increase reconciles with direct cost changes at constant sales', () => {
  assert.equal(businessCase.a.beforeCosts, 950000);
  assert.equal(businessCase.a.afterCosts, 700000);
  assert.equal(businessCase.a.beforeProfit, 50000);
  assert.equal(businessCase.a.afterProfit, 300000);
  assert.equal(improvementCosts[2].before - improvementCosts[2].after, 270000);
  assert.equal(improvementCosts[1].after - improvementCosts[1].before, 20000);
  assert.equal(businessCase.a.afterProfit - businessCase.a.beforeProfit, 270000 - 20000);
  assert.equal(businessCase.a.sales - businessCase.a.afterCosts, businessCase.a.afterProfit);
  assert.equal(businessCase.b.afterProfit / businessCase.b.sales, 0.4);
  assert.equal(businessCase.a.afterProfit / businessCase.a.sales, 0.3);
  assert.deepEqual(feedbackAnalysis.map(item => item.count), [5, 2, 1]);
});

test('Both routes include all three activities and meet the planned duration', () => {
  assert.equal(slides.reduce((total, slide) => total + slide.minutes, 0), 25);
  assert.equal(shortTimes.reduce((a, b) => a + b, 0), 600);
  for (const section of ['Activity 01', 'Activity 02', 'Activity 03']) assert(shortRoute.some(id => slides[id].section === section));
});
test('Complaint answer key matches the eight original messages', () => {
  const delivery = reviews.filter(review => review.theme === 'Delivery');
  assert.deepEqual(delivery.map(review => review.id), [1, 3, 4, 6, 8]);
  assert.equal(delivery.length / reviews.length * 100, 62.5);
  assert.equal(reviews.filter(review => review.theme === 'Packaging').length, 2);
  assert.equal(reviews.filter(review => review.theme === 'Billing').length, 1);
});
test('Savings include tool cost and preserve a negative business case', () => {
  assert.deepEqual(calculateSavings(defaultClinic), { hours: 5, capacityValue: 1500, net: 1000 });
  assert.deepEqual(calculateSavings({ ...defaultClinic, after: 9 }), { hours: -5, capacityValue: -1500, net: -2000 });
  assert.deepEqual(calculateSavings({ ...defaultClinic, volume: 0 }), { hours: 0, capacityValue: 0, net: -500 });
  assert.equal(calculateSavings({ ...defaultClinic, volume: 2.5 }), null);
  assert.equal(calculateSavings({ ...defaultClinic, before: -1 }), null);
});
test('Custom briefs require a complete problem, source, workflow, review and metric', () => {
  const custom = { ...defaultClinic, type: 'custom' };
  assert.equal(validateClinic(custom).length, 1);
  Object.assign(custom, { task: 'Weekly report', source: 'Sales export', workflow: 'Checked summary', human: 'Analyst', metric: 'Time and factual corrections' });
  assert.deepEqual(validateClinic(custom), []);
  assert.equal(getPlan(custom).problem, 'Weekly report');
});
test('Resuming a session rejects malformed slide indices and unsafe votes', () => {
  const restored = sanitizeSession({ slide: 99, mode: 'wrong', votes: [{ a: -1, b: 5, unsure: Infinity }], clinic: { type: 'unknown' } });
  assert.equal(restored.slide, 0);
  assert.equal(restored.mode, 'full');
  assert.deepEqual(restored.votes[0], { a: 0, b: 5, unsure: 0 });
  assert.equal(restored.clinic.type, 'delivery');
});
