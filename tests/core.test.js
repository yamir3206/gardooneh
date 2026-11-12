import { test } from 'node:test';
import assert from 'node:assert/strict';
import { eligibleIndices, selectWinner } from '../assets/js/selection.js';
import { parseBulk, entryType } from '../assets/js/participants.js';
import { landingRotation, indexAtPointer } from '../assets/js/wheel.js';

test('all eight selection scenarios and priority', () => {
 const cases = [
  [['Ali','Reza','Sara','Mehdi'], [0,1,2,3]],
  [['Ali','Reza','Sara ','Mehdi'], [2]],
  [['Ali','Reza ','Sara ','Mehdi'], [1,2]],
  [['Ali',' Reza','Sara','Mehdi'], [0,2,3]],
  [[' Ali','Reza','Sara ','Mehdi'], [2]],
  [['Ali',' Reza',' Sara','Mehdi'], [0,3]],
  [[' Ali',' Reza'], []],
  [['Ali ','Reza ',' Sara '], [0,1]],
 ];
 for (const [names, expected] of cases) { assert.deepEqual(eligibleIndices(names), expected); if (!expected.length) assert.equal(selectWinner(names), null); else expected.forEach((index,i) => assert.equal(selectWinner(names, () => i), index)); }
});
test('bulk preserves spaces, Unicode and duplicate independent entries', () => {
 const names = parseBulk(' Ali\r\nسارا \r\nAli\nAli\n\n ');
 assert.deepEqual(names, [' Ali','سارا ','Ali','Ali',' ']);
 assert.deepEqual(eligibleIndices(names), [1]); assert.equal(entryType(' both '), 'excluded');
 assert.deepEqual(eligibleIndices(['Ali','Ali']), [0,1]);
});
test('wheel lands on selected segment at varying rotations and offsets', () => {
 for (let n=1;n<=100;n++) for(let i=0;i<n;i++) for(const current of [0, 4.2, 125.8]) for(const offset of [.25,.5,.7499]) assert.equal(indexAtPointer(landingRotation(i,n,current,6,offset),n),i);
});
