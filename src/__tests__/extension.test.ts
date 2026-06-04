import { isSchemaFile, getNonce } from '../extension';

describe('isSchemaFile', () => {
  test.each([
    ['schema.json', true],
    ['schema_v2.json', true],
    ['user.schema.json', true],
    ['myschema.json', true],
    ['Schema.JSON', true],
    ['/path/to/schema.json', true],
    ['schema.ts', false],
    ['data.json', false],
    ['noschema.txt', false],
    ['', false],
  ])('isSchemaFile(%s) === %s', (filename, expected) => {
    expect(isSchemaFile(filename)).toBe(expected);
  });
});

describe('getNonce', () => {
  test('is 32 characters long', () => {
    expect(getNonce()).toHaveLength(32);
  });

  test('contains only alphanumeric characters', () => {
    expect(getNonce()).toMatch(/^[A-Za-z0-9]{32}$/);
  });

  test('generates unique values', () => {
    const nonces = Array.from({ length: 50 }, getNonce);
    expect(new Set(nonces).size).toBe(50);
  });
});
