import { defineConfig } from '@playwright/test';
import path from 'node:path';

const python = process.env.PYTHON_BIN || path.resolve('..', 'venv', process.platform === 'win32' ? 'Scripts/python.exe' : 'bin/python');

export default defineConfig({
  testDir: './tests',
  timeout: 90000,
  expect: { timeout: 15000 },
  workers: 1,
  use: {
    baseURL: 'http://127.0.0.1:5175',
    channel: process.env.PLAYWRIGHT_CHANNEL || (process.platform === 'win32' ? 'msedge' : undefined),
    headless: true,
    viewport: { width: 1440, height: 1000 },
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: [
    {
      command: `"${python}" -m uvicorn tests.online_server:app --app-dir ../backend --host 127.0.0.1 --port 8011`,
      url: 'http://127.0.0.1:8011/api/health',
      env: { CORS_ORIGINS: '["http://127.0.0.1:5175"]' },
      reuseExistingServer: false,
    },
    {
      command: 'npm run dev -- --port 5175',
      url: 'http://127.0.0.1:5175',
      env: { VITE_API_URL: 'http://127.0.0.1:8011' },
      reuseExistingServer: false,
    },
  ],
});
