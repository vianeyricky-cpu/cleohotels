import test from 'node:test';
import assert from 'node:assert/strict';
import { greeting, languageHelpQuestion, requestedLanguage, messageLanguage } from '../src/lib/cleo/chat-language';
import { roomAmenities } from '../src/lib/cleo/room';
test('greetings use Surabaya time, selected hotel and varied wording', () => {
  const date = new Date('2026-09-28T01:00:00Z');
  assert.match(greeting('id', 'Cleo Jemursari', date), /Selamat pagi.*Cleo AI.*Jemursari/);
  assert.notEqual(greeting('id', undefined, date, 0), greeting('id', undefined, date, 1));
  assert.match(greeting('id', undefined, new Date('2026-09-28T13:00:00Z')), /malam/);
});
test('language preference distinguishes an instruction from a question about staff', () => {
  assert.equal(requestedLanguage('Pakai bahasa Jawa ya'), 'jv');
  assert.equal(requestedLanguage('Please reply in Japanese'), 'ja');
  assert.equal(requestedLanguage('Bahasa Indonesia'), 'id');
  assert.equal(requestedLanguage('Apakah ada staff yang bisa bahasa Inggris?'), undefined);
  assert.equal(messageLanguage('Apa promo saat ini?', 'en'), 'id');
  assert.equal(languageHelpQuestion.test('bisa rubah bahasa ?'), true);
});
test('legacy and current amenities both render, without treating objects as text', () => {
  assert.deepEqual(roomAmenities(['Wi-Fi', ' AC ', null, { name: 'unsafe' }]), ['Wi-Fi', 'AC']);
  assert.deepEqual(roomAmenities('Wi-Fi, AC, '), ['Wi-Fi', 'AC']);
  assert.deepEqual(roomAmenities(null), []);
});
