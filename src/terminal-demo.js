/**
 * Interactive terminal simulation for thwip.
 * Replays a real flow: a relayed permission question, a usage limit on one signed-in CLI,
 * a compaction offer before the handoff, a one-key switch to another CLI, and a project-memory update.
 */

export class TerminalDemo {
  constructor(screenEl, statusBarEl, badgeEl, replayBtnEl) {
    this.screen = screenEl;
    this.statusBar = statusBarEl;
    this.badge = badgeEl;
    this.replayBtn = replayBtnEl;
    this.timeouts = [];
    this.isRunning = false;

    if (this.replayBtn) {
      this.replayBtn.addEventListener('click', () => this.start());
    }
  }

  clear() {
    this.timeouts.forEach(t => clearTimeout(t));
    this.timeouts = [];
    this.screen.innerHTML = '';
  }

  schedule(fn, delay) {
    const t = setTimeout(() => {
      fn();
      this.screen.scrollTop = this.screen.scrollHeight;
    }, delay);
    this.timeouts.push(t);
  }

  start() {
    this.clear();
    this.isRunning = true;
    if (this.replayBtn) this.replayBtn.disabled = true;

    this.setStatusBarAgent('claude', 'fable', '#D97757', 'badge-anthropic', 'Claude Code');

    this.schedule(() => {
      this.appendElement(`
        <div class="t-prompt">
          <span class="t-user-label">You &gt;</span>
          <span class="t-user-query">Add API-key auth to the middleware and cover it with pytest.</span>
        </div>
      `);
    }, 400);

    this.schedule(() => {
      this.appendElement(`
        <div class="t-stream-text" style="color: #D97757; font-weight: 600;">[fable]</div>
        <div class="t-stream-text">
          Read <code>context.md</code>: the project already stores hashed keys in SQLite. Adding header validation in
          <code>backend/auth.py</code> and a lookup against that table.
        </div>
      `);
    }, 1200);

    this.schedule(() => {
      this.appendElement(`
        <div class="t-tool-box">
          <div style="color: #EAB308; font-weight: 700;">Native tool permission</div>
          <div style="color: #F8FAFC; font-size: 12.5px; margin-top: 4px;">Claude Code wants to use Edit.<br>File: backend/auth.py</div>
          <div style="color: #94A3B8; font-size: 12px; margin-top: 4px;">This is Claude Code's own question; thwip only relays it. Denying lets it continue without the operation.</div>
          <div style="margin-top: 6px; color: #94A3B8; font-size: 12.5px;">Allow this operation once? [y/N]: <strong style="color: #F1ECEC;">y</strong></div>
        </div>
      `);
    }, 2200);

    this.schedule(() => {
      this.appendElement(`
        <div class="t-limit-warning">
          <div style="color: #EAB308; font-weight: 700;">Claude Code: usage limit reached (5h window, resets 16:40)</div>
          <div style="color: #F8FAFC; margin-top: 4px;">Ready alternatives: 1. Antigravity CLI (gemini-3.8-flash-high)  2. Codex CLI (gpt-5.6-sol)</div>
          <div style="margin-top: 8px; color: #94A3B8; font-size: 12.5px;">Switch to another CLI now? [1 to switch, Enter to cancel]: <strong style="color: #F1ECEC;">1</strong></div>
        </div>
      `);
    }, 3600);

    this.schedule(() => {
      this.appendElement(`
        <div class="t-tool-box" style="border-left-color: #CFCECD;">
          <div style="color: #CFCECD; font-weight: 700;">This switch would send about 46,200 tokens to Antigravity CLI (72% of its 64,000-token window).</div>
          <div style="color: #94A3B8; font-size: 12.5px; margin-top: 4px;">Compact older turns first so the handoff is small? Recent turns stay verbatim. [y/N] <strong style="color: #F1ECEC;">y</strong></div>
          <div style="color: #4ADE80; font-size: 12px; margin-top: 6px;">Compacted on Codex CLI: 14 older turns summarised, 4 kept verbatim, 9 exact items (paths, commands, errors) checked and present. Older turns archived for /recall.</div>
        </div>
      `);
    }, 4600);

    this.schedule(() => {
      this.appendElement(`
        <div class="t-switch-notice">
          <div style="color: #4285F4; font-weight: 700;">Switched to Antigravity CLI (gemini-3.8-flash-high) through its existing sign-in</div>
          <div style="color: #94A3B8; font-size: 12px; margin-top: 4px;">
            Conversation carried over as text. Retrying your last message with the new CLI...
          </div>
        </div>
      `);
      this.setStatusBarAgent('google', 'gemini-3.8-flash-high', '#4285F4', 'badge-google', 'Antigravity CLI');
    }, 5600);

    this.schedule(() => {
      this.appendElement(`
        <div class="t-stream-text" style="color: #4285F4; font-weight: 600;">[gemini-3.8-flash-high]</div>
        <div class="t-stream-text">
          Picking up from the transcript: header validation is in place. Writing <code>tests/test_auth.py</code> and running it.
        </div>
      `);
    }, 6700);

    this.schedule(() => {
      this.appendElement(`
        <div class="t-tool-box" style="border-left-color: #4285F4;">
          <div style="color: #4285F4; font-weight: 700;">Tool: write_to_file tests/test_auth.py</div>
          <div style="color: #94A3B8; font-size: 12px;">Antigravity's own tools and sandbox. 8 test cases</div>
        </div>
      `);
    }, 7700);

    this.schedule(() => {
      this.appendElement(`
        <div class="t-prompt" style="margin-top: 14px;">
          <span class="t-user-label" style="color: #E2E8F0;">You &gt;</span>
          <span style="color: #38BDF8; font-weight: 700;">/memory update</span>
        </div>
        <div class="t-tool-box" style="border-left-color: #CFCECD;">
          <div style="color: #CFCECD; font-weight: 700;">context.md: proposed changes</div>
          <div style="color: #4ADE80; font-size: 12px;">+ Decisions: API keys validated from the X-API-Key header against hashed rows in SQLite.</div>
          <div style="color: #4ADE80; font-size: 12px;">+ 2026-10-12: header auth added; tests in tests/test_auth.py.</div>
          <div style="color: #94A3B8; font-size: 12px; margin-top: 4px;">Write these changes to context.md? [y/N] <strong style="color: #F1ECEC;">y</strong></div>
        </div>
      `);
    }, 8700);

    this.schedule(() => {
      this.appendElement(`
        <div class="t-tool-box" style="border-left-color: #4ADE80;">
          <div style="color: #4ADE80; font-weight: 700;">!pytest tests/test_auth.py</div>
          <div class="t-test-pass">[ok] 8 passed in 0.42s</div>
          <div style="color: #94A3B8; font-size: 12.5px; margin-top: 6px;">Project memory updated and filed in the vault. Every CLI now starts from the same context.md.</div>
        </div>
      `);
    }, 9800);

    this.schedule(() => {
      this.isRunning = false;
      if (this.replayBtn) this.replayBtn.disabled = false;
    }, 10000);
  }

  appendElement(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    this.screen.appendChild(div);
  }

  setStatusBarAgent(agentName, modelName, color, badgeClass, badgeTitle) {
    const agentLabel = document.getElementById('bar-agent-label');
    const modelLabel = document.getElementById('bar-model-label');
    const badge = document.getElementById('term-status-badge');

    if (agentLabel) {
      agentLabel.textContent = agentName;
      agentLabel.style.color = color;
    }
    if (modelLabel) {
      modelLabel.textContent = modelName;
    }
    if (badge) {
      badge.className = `term-badge ${badgeClass}`;
      badge.textContent = badgeTitle;
    }
  }
}
