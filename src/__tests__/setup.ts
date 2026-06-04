if (typeof document !== 'undefined') {
  document.body.innerHTML = '<div id="root"></div>';
  const link = document.createElement('link');
  link.id = 'theme-stylesheet';
  document.head.appendChild(link);
  (window as any).__BOOTSTRAP_CSS__ = '';
}

(globalThis as any).acquireVsCodeApi = () => ({ postMessage: jest.fn() });
