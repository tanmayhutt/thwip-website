/**
 * Interactive Terminal Simulation for thwip.
 * Replays live multi-agent hot-swapping under rate limits.
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

    // Reset status bar to Anthropic
    this.setStatusBarAgent('claude', 'claude-opus-5', '#D97757', 'badge-anthropic', 'Anthropic Claude');

    // Sequence of animated events
    this.schedule(() => {
      this.appendElement(`
        <div class="t-prompt">
          <span class="t-user-label">You &gt;</span>
          <span class="t-user-query">Refactor backend auth middleware to support API keys and verify with pytest.</span>
        </div>
      `);
    }, 400);

    this.schedule(() => {
      this.appendElement(`
        <div class="t-stream-text" style="color: #D97757; font-weight: 600;">[claude-opus-5]</div>
        <div class="t-stream-text">
          Inspecting <code>backend/auth.py</code> to add API key header validation and secret hash lookup...
        </div>
      `);
    }, 1200);

    this.schedule(() => {
      this.appendElement(`
        <div class="t-tool-box">
          <div style="color: #EAB308; font-weight: 700;">Action: edit_file</div>
          <div style="color: #94A3B8; font-size: 12px;">path: backend/auth.py | diff: +28 lines</div>
          <div style="color: #4ADE80; font-size: 12px; margin-top: 4px;">Result: File backend/auth.py updated successfully.</div>
        </div>
      `);
    }, 2200);

    this.schedule(() => {
      this.appendElement(`
        <div class="t-limit-warning">
          <div style="color: #EAB308; font-weight: 700;">[Limit] Anthropic Claude Opus 5</div>
          <div style="color: #F8FAFC; margin-top: 4px;">Rate limit hit: 429 Too Many Requests. Usage quota exceeded for current hour.</div>
          <div style="margin-top: 8px; color: #94A3B8; font-size: 12.5px;">
            Suggested ready fallback: <strong style="color: #4285F4;">Google Gemini 3.7 Flash</strong>
          </div>
        </div>
      `);
    }, 3600);

    this.schedule(() => {
      this.appendElement(`
        <div class="t-prompt" style="margin-top: 14px;">
          <span class="t-user-label" style="color: #E2E8F0;">thwip &gt;</span>
          <span style="color: #38BDF8; font-weight: 700;">/switch google gemini-3.7-flash</span>
        </div>
      `);
      // Update UI branding to Google
      this.setStatusBarAgent('google', 'gemini-3.7-flash', '#4285F4', 'badge-google', 'Google Gemini');
    }, 4800);

    this.schedule(() => {
      this.appendElement(`
        <div class="t-switch-notice">
          <div style="color: #4285F4; font-weight: 700;">Agent Switch: Antigravity / Gemini (gemini-3.7-flash)</div>
          <div style="color: #94A3B8; font-size: 12px; margin-top: 4px;">
            Supported: Chat, File Edit, Code Run, Terminal, Git | Context preserved intact.
          </div>
        </div>
      `);
    }, 5800);

    this.schedule(() => {
      this.appendElement(`
        <div class="t-stream-text" style="color: #4285F4; font-weight: 600;">[gemini-3.7-flash]</div>
        <div class="t-stream-text">
          Received full conversation memory and auth.py diff. Creating unit tests in <code>tests/test_auth.py</code> and running verification...
        </div>
      `);
    }, 6800);

    this.schedule(() => {
      this.appendElement(`
        <div class="t-tool-box" style="border-left-color: #4285F4;">
          <div style="color: #4285F4; font-weight: 700;">Action: write_file</div>
          <div style="color: #94A3B8; font-size: 12px;">path: tests/test_auth.py | 8 test cases written</div>
        </div>
      `);
    }, 7800);

    this.schedule(() => {
      this.appendElement(`
        <div class="t-tool-box" style="border-left-color: #4ADE80;">
          <div style="color: #4ADE80; font-weight: 700;">Action: run_command</div>
          <div style="color: #94A3B8; font-size: 12px;">command: pytest tests/test_auth.py</div>
          <div class="t-test-pass">[ok] 8 passed in 0.42s</div>
        </div>
        <div class="t-stream-text" style="color: #94A3B8; font-size: 12.5px; margin-top: 10px;">
          All API key validation tests pass cleanly. Context and reasoning preserved across provider switch.
        </div>
      `);
    }, 9000);
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
