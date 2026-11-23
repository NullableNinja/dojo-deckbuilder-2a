import test from 'node:test';
import assert from 'node:assert/strict';
import { readBoutHistory, recordBout, boutSummary, countInventory } from '../app/bout-notebook.ts';
const record = (id, won = true) => ({id, won, finishedAt: 1, fighter: 'Ducktape', opponent: 'Glitterpunch', rounds: 5, damage: 25, purchases: 3, belt: 'Gold'});
test('bout records survive reload without counting the same result twice', () => {
  const saved = recordBout([], record('a'));
  const restored = readBoutHistory(JSON.stringify(saved));
  assert.equal(recordBout(restored, record('a')), restored);
  assert.deepEqual(boutSummary(recordBout(restored, record('b', false))), {wins: 1, bouts: 2, streak: 0});
  assert.equal(boutSummary([record('c'), record('b'), record('a', false)]).streak, 2);
});
test('history tolerates corrupt storage and caps stored results', () => {
  assert.deepEqual(readBoutHistory('{broken'), []);
  assert.deepEqual(readBoutHistory(JSON.stringify([{id:'bad'}])), []);
  const records = Array.from({length: 30}, (_,i) => record(String(i)));
  assert.equal(recordBout(records, record('new')).length, 30);
  assert.equal(recordBout(records, record('new'))[0].id, 'new');
});
test('inventory groups duplicate cards without changing the source or exposing draw order', () => {
  const ids = ['jab', 'habit', 'habit'];
  assert.deepEqual(countInventory(ids), [{id:'habit',count:2},{id:'jab',count:1}]);
  assert.deepEqual(countInventory([...ids].reverse()), countInventory(ids));
  assert.deepEqual(ids, ['jab', 'habit', 'habit']);
});
