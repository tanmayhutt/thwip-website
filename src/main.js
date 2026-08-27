import { TerminalDemo } from './terminal-demo.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Terminal Simulator
  const screenEl = document.getElementById('terminal-screen');
  const statusBarEl = document.getElementById('terminal-status-bar');
  const badgeEl = document.getElementById('term-status-badge');
  const replayBtnEl = document.getElementById('demo-replay-btn');

  if (screenEl) {
    const demo = new TerminalDemo(screenEl, statusBarEl, badgeEl, replayBtnEl);
    demo.start();
  }

  // 2. Install Tabs
  const tabs = document.querySelectorAll('.install-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetId = tab.getAttribute('data-target');
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });

  // 3. Copy Code Buttons
  const copyButtons = document.querySelectorAll('.btn-copy, .btn-copy-code');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      let codeToCopy = btn.getAttribute('data-code');
      if (!codeToCopy) {
        const codeEl = btn.closest('.quick-install-box')?.querySelector('code');
        if (codeEl) codeToCopy = codeEl.textContent.trim();
      }

      if (codeToCopy) {
        try {
          await navigator.clipboard.writeText(codeToCopy);
          const originalText = btn.textContent;
          btn.textContent = 'Copied!';
          btn.style.color = '#4ADE80';
          btn.style.borderColor = '#4ADE80';

          setTimeout(() => {
            btn.textContent = originalText;
            btn.style.color = '';
            btn.style.borderColor = '';
          }, 2000);
        } catch (err) {
          console.error('Failed to copy: ', err);
        }
      }
    });
  });
});
