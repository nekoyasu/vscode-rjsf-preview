import * as vscode from 'vscode';

export const activate = (context: vscode.ExtensionContext) => {
  let panel: vscode.WebviewPanel | undefined;
  let watchedDoc: vscode.TextDocument | undefined;

  const sendSchema = (doc: vscode.TextDocument) => {
    if (!panel) return;
    try {
      const schema = JSON.parse(doc.getText());
      panel.webview.postMessage({ type: 'schema', schema, fileName: doc.fileName });
    } catch (e) {
      panel.webview.postMessage({ type: 'error', message: String(e) });
    }
  };

  const showPreview = () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    watchedDoc = editor.document;

    if (!panel) {
      panel = vscode.window.createWebviewPanel(
        'rjsfPreview',
        'RJSF Preview',
        { viewColumn: vscode.ViewColumn.Two, preserveFocus: true },
        {
          enableScripts: true,
          localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'dist')],
        }
      );

      panel.onDidDispose(
        () => {
          panel = undefined;
        },
        null,
        context.subscriptions
      );

      panel.webview.onDidReceiveMessage(
        (msg) => {
          if (msg.type === 'ready') sendSchema(watchedDoc!);
        },
        undefined,
        context.subscriptions
      );
    } else {
      panel.reveal(vscode.ViewColumn.Two, true);
    }

    panel.webview.html = buildHtml(panel.webview, context.extensionUri);
  };

  context.subscriptions.push(
    vscode.commands.registerCommand('rjsf-preview.showPreview', showPreview)
  );

  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((e) => {
      if (panel && watchedDoc && e.document === watchedDoc) {
        sendSchema(e.document);
      }
    })
  );

  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (editor && panel && isSchemaFile(editor.document.fileName)) {
        watchedDoc = editor.document;
        sendSchema(editor.document);
      }
    })
  );
};

export const isSchemaFile = (fileName: string): boolean =>
  /schema.*\.json$|.*schema\.json$/i.test(fileName);

export const getNonce = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length: 32 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

const buildHtml = (webview: vscode.Webview, extensionUri: vscode.Uri): string => {
  const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'dist', 'webview.js'));
  const bootstrapCssUri = webview
    .asWebviewUri(vscode.Uri.joinPath(extensionUri, 'dist', 'bootstrap.css'))
    .toString();
  const nonce = getNonce();
  return /* html */ `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy"
    content="default-src 'none'; script-src 'nonce-${nonce}'; style-src 'unsafe-inline' ${webview.cspSource};">
  <title>RJSF Preview</title>
  <link id="theme-stylesheet" rel="stylesheet" href="">
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body {
      font-family: var(--vscode-font-family);
      font-size: var(--vscode-font-size);
      background: var(--vscode-editor-background);
      color: var(--vscode-editor-foreground);
      padding: 16px;
      margin: 0;
    }
    h2 { font-size: 1em; opacity: 0.6; margin: 0 0 16px; font-weight: normal; }
    .error {
      color: var(--vscode-errorForeground);
      background: var(--vscode-inputValidation-errorBackground);
      border: 1px solid var(--vscode-inputValidation-errorBorder);
      padding: 8px 12px; border-radius: 4px; margin-bottom: 12px;
    }
    label { display: block; margin-bottom: 4px; font-weight: 600; }
    .field-description { font-size: 0.85em; opacity: 0.7; margin-bottom: 4px; }
    .form-group { margin-bottom: 14px; }
    input[type="text"], input[type="number"], input[type="email"],
    input[type="url"], input[type="password"], select, textarea {
      background: var(--vscode-input-background);
      color: var(--vscode-input-foreground);
      border: 1px solid var(--vscode-input-border, #555);
      padding: 5px 8px;
      border-radius: 2px;
      width: 100%;
      font-family: inherit;
      font-size: inherit;
    }
    input[type="checkbox"] { margin-right: 6px; }
    fieldset {
      border: 1px solid var(--vscode-panel-border, #444);
      padding: 12px 16px;
      margin-bottom: 14px;
      border-radius: 3px;
    }
    legend { padding: 0 6px; font-weight: 600; }
    button[type="submit"] {
      background: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
      border: none;
      padding: 6px 16px;
      border-radius: 2px;
      cursor: pointer;
      font-size: inherit;
      margin-top: 8px;
    }
    button[type="submit"]:hover { background: var(--vscode-button-hoverBackground); }
    .array-item { display: flex; gap: 8px; align-items: flex-start; margin-bottom: 8px; }
    .array-item > div { flex: 1; }
    .array-item-toolbar button {
      background: transparent;
      color: var(--vscode-editor-foreground);
      border: 1px solid var(--vscode-panel-border, #444);
      padding: 2px 8px;
      border-radius: 2px;
      cursor: pointer;
      margin-left: 4px;
    }
    #form-data-preview {
      margin-top: 24px;
      padding: 12px;
      background: var(--vscode-textBlockQuote-background);
      border-left: 3px solid var(--vscode-activityBarBadge-background);
      font-family: var(--vscode-editor-font-family, monospace);
      font-size: 0.85em;
      white-space: pre-wrap;
      border-radius: 0 3px 3px 0;
    }
  </style>
</head>
<body>
  <script nonce="${nonce}">window.__BOOTSTRAP_CSS__ = '${bootstrapCssUri}';</script>
  <div id="root"><h2>Waiting for schema…</h2></div>
  <script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
};

export const deactivate = () => {};
