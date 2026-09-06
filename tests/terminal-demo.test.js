import assert from 'node:assert/strict';
import { test } from 'node:test';
import { TerminalDemo } from '../src/terminal-demo.js';

test('demo completes, replays, and cancels obsolete scheduled events', () => {
  const original = { document: globalThis.document, setTimeout: globalThis.setTimeout, clearTimeout: globalThis.clearTimeout };
  const callbacks = new Map();
  let nextId = 0;
  const nodes = new Map();
  const screen = { innerHTML: '', children: [], scrollHeight: 50, appendChild(node) { this.children.push(node); } };
  const replay = { disabled: false, addEventListener(_, fn) { this.click = fn; } };
  try {
    globalThis.setTimeout = (fn, delay) => { callbacks.set(++nextId, { fn, delay }); return nextId; };
    globalThis.clearTimeout = id => callbacks.delete(id);
    globalThis.document = {
      createElement: () => ({ innerHTML: '' }),
      getElementById: id => {
        if (!nodes.has(id)) nodes.set(id, { style: {}, textContent: '' });
        return nodes.get(id);
      },
    };
    const demo = new TerminalDemo(screen, null, null, replay);
    demo.start();
    assert.equal(replay.disabled, true);
    assert.equal(demo.isRunning, true);
    const oldIds = [...callbacks.keys()];
    demo.start();
    assert.ok(oldIds.every(id => !callbacks.has(id)));
    for (const { fn } of [...callbacks.values()].sort((a, b) => a.delay - b.delay)) fn();
    assert.equal(demo.isRunning, false);
    assert.equal(replay.disabled, false);
    assert.match(screen.children.at(-1).innerHTML, /8 passed/);
    assert.equal(nodes.get('bar-agent-label').textContent, 'google');
    replay.click();
    assert.equal(demo.isRunning, true);
    assert.equal(nodes.get('bar-agent-label').textContent, 'claude');
  } finally {
    Object.assign(globalThis, original);
  }
});
