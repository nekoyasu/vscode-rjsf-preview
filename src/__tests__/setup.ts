if (typeof document !== 'undefined') {
  document.body.innerHTML = '<div id="root"></div>';
  const link = document.createElement('link');
  link.id = 'theme-stylesheet';
  document.head.appendChild(link);
  (window as any).__BOOTSTRAP_CSS__ = '';
  (window as any).__DEFAULT_THEME__ = 'default';
}

(globalThis as any).acquireVsCodeApi = () => ({ postMessage: jest.fn() });
