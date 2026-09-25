/**
 * Interactive terminal simulation for thwip.
 * Replays a real flow: a usage limit on one signed-in CLI, a one-key switch to another,
 * the catch-up the new provider receives, and a project-memory update.
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
          <div style="color: #EAB308; font-weight: 700;">Tool: Edit backend/auth.py</div>
          <div style="color: #94A3B8; font-size: 12px;">Claude Code's own tools, its own sandbox and approvals</div>
        </div>
      `);
    }, 2200);

    this.schedule(() => {
      this.appendElement(`
        <div class="t-limit-warning">
          <div style="color: #EAB308; font-weight: 700;">Claude Code: usage limit reached (5h window, resets 16:40)</div>
          <div style="color: #F8FAFC; margin-top: 4px;">Ready alternatives: 1. Antigravity CLI (gemini-3.8-flash-high)  2. Codex CLI (gpt-5.6-sol)</div>
          <div style="margin-top: 8px; color: #94A3B8; font-size: 12.5px;">Switch to alternative agent now? [1 to switch, Enter to cancel]: <strong style="color: #F1ECEC;">1</strong></div>
        </div>
      `);
    }, 3600);

    this.schedule(() => {
      this.appendElement(`
        <div class="t-switch-notice">
          <div style="color: #4285F4; font-weight: 700;">Switched to Antigravity CLI (gemini-3.8-flash-high) through its existing sign-in</div>
          <div style="color: #94A3B8; font-size: 12px; margin-top: 4px;">
            Portable text history preserved. Retrying your last message with the new agent...
          </div>
        </div>
      `);
      this.setStatusBarAgent('google', 'gemini-3.8-flash-high', '#4285F4', 'badge-google', 'Antigravity CLI');
    }, 4800);

    this.schedule(() => {
      this.appendElement(`
        <div class="t-stream-text" style="color: #4285F4; font-weight: 600;">[gemini-3.8-flash-high]</div>
        <div class="t-stream-text">
          Picking up from the transcript: header validation is in place. Writing <code>tests/test_auth.py</code> and running it.
        </div>
      `);
    }, 5900);

    this.schedule(() => {
      this.appendElement(`
        <div class="t-tool-box" style="border-left-color: #4285F4;">
          <div style="color: #4285F4; font-weight: 700;">Tool: write_to_file tests/test_auth.py</div>
          <div style="color: #94A3B8; font-size: 12px;">8 test cases</div>
        </div>
      `);
    }, 6900);

    this.schedule(() => {
      this.appendElement(`
        <div class="t-prompt" style="margin-top: 14px;">
          <span class="t-user-label" style="color: #E2E8F0;">You &gt;</span>
          <span style="color: #38BDF8; font-weight: 700;">/memory update</span>
        </div>
        <div class="t-tool-box" style="border-left-color: #CFCECD;">
          <div style="color: #CFCECD; font-weight: 700;">context.md: proposed changes</div>
          <div style="color: #4ADE80; font-size: 12px;">+ Decisions: API keys validated from the X-API-Key header against hashed rows in SQLite.</div>
          <div style="color: #4ADE80; font-size: 12px;">+ 2026-09-25: header auth added; tests in tests/test_auth.py.</div>
          <div style="color: #94A3B8; font-size: 12px; margin-top: 4px;">Write these changes to context.md? [y/N] <strong style="color: #F1ECEC;">y</strong></div>
        </div>
      `);
    }, 7900);

    this.schedule(() => {
      this.appendElement(`
        <div class="t-tool-box" style="border-left-color: #4ADE80;">
          <div style="color: #4ADE80; font-weight: 700;">!pytest tests/test_auth.py</div>
          <div class="t-test-pass">[ok] 8 passed in 0.42s</div>
          <div style="color: #94A3B8; font-size: 12.5px; margin-top: 6px;">Project memory updated and filed in the vault. Both agents now start from the same context.md.</div>
        </div>
      `);
    }, 9000);

    this.schedule(() => {
      this.isRunning = false;
      if (this.replayBtn) this.replayBtn.disabled = false;
    }, 9200);
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
