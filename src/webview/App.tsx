import React, { useState, useEffect } from 'react';
import DefaultForm from '@rjsf/core';
import BootstrapForm from '@rjsf/bootstrap-4';
import FluentForm from '@rjsf/fluentui-rc';
import { FluentProvider, webLightTheme, webDarkTheme } from '@fluentui/react-components';
import validator from '@rjsf/validator-ajv8';
import type { RJSFSchema } from '@rjsf/utils';

declare function acquireVsCodeApi(): { postMessage(msg: unknown): void };
const vscode = acquireVsCodeApi();

export type Theme = 'default' | 'bootstrap' | 'fluent-light' | 'fluent-dark';

type Message =
  | { type: 'schema'; schema: RJSFSchema; fileName: string }
  | { type: 'error'; message: string };

declare const window: Window & { __BOOTSTRAP_CSS__: string };

function useThemeStylesheet(theme: Theme) {
  useEffect(() => {
    const link = document.getElementById('theme-stylesheet') as HTMLLinkElement;
    link.href = theme === 'bootstrap' ? window.__BOOTSTRAP_CSS__ : '';
  }, [theme]);
}

export function FormWrapper({ theme, children }: { theme: Theme; children: React.ReactNode }) {
  if (theme === 'fluent-light') {
    return <FluentProvider theme={webLightTheme}>{children}</FluentProvider>;
  }
  if (theme === 'fluent-dark') {
    return <FluentProvider theme={webDarkTheme}>{children}</FluentProvider>;
  }
  return <>{children}</>;
}

export function App() {
  const [schema, setSchema] = useState<RJSFSchema | null>(null);
  const [fileName, setFileName] = useState('');
  const [formData, setFormData] = useState<unknown>({});
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>('default');

  useThemeStylesheet(theme);

  useEffect(() => {
    const handler = (event: MessageEvent<Message>) => {
      const msg = event.data;
      if (msg.type === 'schema') {
        setSchema(msg.schema);
        setFileName(msg.fileName.split('/').pop() ?? '');
        setFormData({});
        setError(null);
      } else if (msg.type === 'error') {
        setError(msg.message);
      }
    };
    window.addEventListener('message', handler);
    vscode.postMessage({ type: 'ready' });
    return () => window.removeEventListener('message', handler);
  }, []);

  const FormComponent =
    theme === 'bootstrap' ? BootstrapForm :
    theme === 'fluent-light' || theme === 'fluent-dark' ? FluentForm :
    DefaultForm;

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        {fileName && <h2 style={{ margin: 0 }}>{fileName}</h2>}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
          <label htmlFor="theme-select" style={{ margin: 0, fontWeight: 'normal', opacity: 0.7, fontSize: '0.85em' }}>
            Theme:
          </label>
          <select
            id="theme-select"
            value={theme}
            onChange={(e) => setTheme(e.target.value as Theme)}
            style={{ width: 'auto' }}
          >
            <option value="default">Default</option>
            <option value="bootstrap">Bootstrap 4</option>
            <option value="fluent-light">Fluent UI (Light)</option>
            <option value="fluent-dark">Fluent UI (Dark)</option>
          </select>
        </div>
      </div>

      {error && <div className="error"><strong>Parse error:</strong> {error}</div>}
      {!schema && !error && <p style={{ opacity: 0.5 }}>Waiting for schema…</p>}

      {schema && (
        <FormWrapper theme={theme}>
          <FormComponent
            schema={schema}
            validator={validator}
            formData={formData}
            onChange={({ formData: d }) => setFormData(d)}
            onSubmit={({ formData: d }) => {
              vscode.postMessage({ type: 'submit', data: d });
            }}
          />
          <div id="form-data-preview">{JSON.stringify(formData, null, 2)}</div>
        </FormWrapper>
      )}
    </>
  );
}
