if (typeof document !== 'undefined') {
  document.body.innerHTML = '<div id="root"></div>';
  (window as any).__DEFAULT_THEME__ = 'default';
}

(globalThis as any).acquireVsCodeApi = () => ({ postMessage: jest.fn() });
