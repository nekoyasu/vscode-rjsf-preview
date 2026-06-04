const vscode = {
  window: {
    createWebviewPanel: jest.fn(),
    activeTextEditor: undefined,
    onDidChangeActiveTextEditor: jest.fn(() => ({ dispose: jest.fn() })),
  },
  workspace: {
    onDidChangeTextDocument: jest.fn(() => ({ dispose: jest.fn() })),
  },
  commands: {
    registerCommand: jest.fn(() => ({ dispose: jest.fn() })),
  },
  Uri: { joinPath: jest.fn() },
  ViewColumn: { Two: 2 },
};

module.exports = vscode;
