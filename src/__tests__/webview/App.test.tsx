/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, act } from '@testing-library/react';

jest.mock('@rjsf/core', () => {
  const R = require('react');
  return {
    __esModule: true,
    default: () => R.createElement('div', { 'data-testid': 'form-default' }),
  };
});
jest.mock('@rjsf/bootstrap-4', () => {
  const R = require('react');
  return {
    __esModule: true,
    default: () => R.createElement('div', { 'data-testid': 'form-bootstrap' }),
  };
});
jest.mock('@rjsf/fluentui-rc', () => {
  const R = require('react');
  return {
    __esModule: true,
    default: () => R.createElement('div', { 'data-testid': 'form-fluent' }),
  };
});
jest.mock('@rjsf/validator-ajv8', () => ({ __esModule: true, default: {} }));
jest.mock('@fluentui/react-components', () => {
  const R = require('react');
  return {
    __esModule: true,
    FluentProvider: ({ children }: any) =>
      R.createElement('div', { 'data-testid': 'fluent-provider' }, children),
    webLightTheme: {},
    webDarkTheme: {},
  };
});

import { App, FormWrapper } from '../../webview/App';

describe('FormWrapper', () => {
  test('renders children without FluentProvider for default theme', () => {
    render(
      <FormWrapper theme="default">
        <span data-testid="child" />
      </FormWrapper>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.queryByTestId('fluent-provider')).toBeNull();
  });

  test('renders children without FluentProvider for bootstrap theme', () => {
    render(
      <FormWrapper theme="bootstrap">
        <span data-testid="child" />
      </FormWrapper>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.queryByTestId('fluent-provider')).toBeNull();
  });

  test('wraps with FluentProvider for fluent-light theme', () => {
    render(
      <FormWrapper theme="fluent-light">
        <span data-testid="child" />
      </FormWrapper>
    );
    expect(screen.getByTestId('fluent-provider')).toBeInTheDocument();
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  test('wraps with FluentProvider for fluent-dark theme', () => {
    render(
      <FormWrapper theme="fluent-dark">
        <span data-testid="child" />
      </FormWrapper>
    );
    expect(screen.getByTestId('fluent-provider')).toBeInTheDocument();
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});

describe('App', () => {
  test('shows waiting message initially', () => {
    render(<App />);
    expect(screen.getByText(/Waiting for schema/)).toBeInTheDocument();
  });

  test('uses __DEFAULT_THEME__ as initial theme', () => {
    (window as any).__DEFAULT_THEME__ = 'bootstrap';
    render(<App />);
    expect((screen.getByRole('combobox') as HTMLSelectElement).value).toBe('bootstrap');
    (window as any).__DEFAULT_THEME__ = 'default';
  });

  test('shows error when error message received', async () => {
    render(<App />);
    await act(async () => {
      window.dispatchEvent(
        new MessageEvent('message', {
          data: { type: 'error', message: 'SyntaxError: unexpected token' },
        })
      );
    });
    expect(screen.getByText(/SyntaxError: unexpected token/)).toBeInTheDocument();
  });

  test('renders form and filename when schema message received', async () => {
    render(<App />);
    await act(async () => {
      window.dispatchEvent(
        new MessageEvent('message', {
          data: {
            type: 'schema',
            schema: { type: 'object', properties: { name: { type: 'string' } } },
            fileName: '/workspace/user.schema.json',
          },
        })
      );
    });
    expect(screen.getByTestId('form-default')).toBeInTheDocument();
    expect(screen.getByText('user.schema.json')).toBeInTheDocument();
  });

  test('clears error when valid schema received after error', async () => {
    render(<App />);
    await act(async () => {
      window.dispatchEvent(
        new MessageEvent('message', {
          data: { type: 'error', message: 'bad json' },
        })
      );
    });
    expect(screen.getByText(/bad json/)).toBeInTheDocument();

    await act(async () => {
      window.dispatchEvent(
        new MessageEvent('message', {
          data: {
            type: 'schema',
            schema: { type: 'object' },
            fileName: '/workspace/schema.json',
          },
        })
      );
    });
    expect(screen.queryByText(/bad json/)).toBeNull();
  });
});
