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

  // 2. OpenCode Style Install Tabs
  const installTabs = document.querySelectorAll('.install-tab-btn');
  const activeInstallCmd = document.getElementById('active-install-cmd');
  const copyBtn = document.getElementById('btn-copy-install');
  const copyLabel = document.getElementById('copy-label');

  const activateInstallTab = (tab) => {
      installTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
        t.tabIndex = -1;
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      tab.tabIndex = 0;

      const cmd = tab.getAttribute('data-cmd');
      if (activeInstallCmd && cmd) {
        activeInstallCmd.textContent = cmd;
      }
  };

  installTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateInstallTab(tab));
    tab.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      let nextIndex = index;
      if (event.key === 'ArrowLeft') nextIndex = (index - 1 + installTabs.length) % installTabs.length;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % installTabs.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = installTabs.length - 1;
      activateInstallTab(installTabs[nextIndex]);
      installTabs[nextIndex].focus();
    });
  });

  // 3. Copy Installation Command
  if (copyBtn && activeInstallCmd) {
    copyBtn.addEventListener('click', async () => {
      const textToCopy = activeInstallCmd.textContent.trim();
      try {
        await navigator.clipboard.writeText(textToCopy);
        if (copyLabel) copyLabel.textContent = 'Copied!';
        copyBtn.style.borderColor = '#4ADE80';
        copyBtn.style.color = '#4ADE80';

        setTimeout(() => {
          if (copyLabel) copyLabel.textContent = 'Copy';
          copyBtn.style.borderColor = '';
          copyBtn.style.color = '';
        }, 2000);
      } catch (err) {
        console.error('Failed to copy command: ', err);
        if (copyLabel) copyLabel.textContent = 'Copy failed';
      }
    });
  }
});
