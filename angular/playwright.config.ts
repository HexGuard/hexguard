import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './playwright/tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['html', { open: 'never' }], ['github']] : 'list',
  use: {
    baseURL: 'http://127.0.0.1:4200',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
  },
  webServer: [
    {
      command: 'pnpm exec ng serve demo-angular --host 127.0.0.1 --port 4200',
      url: 'http://127.0.0.1:4200/orders',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
    {
      command:
        'dotnet run --project ../dotnet/samples/HexGuard.SampleApi/HexGuard.SampleApi.csproj -- --urls http://127.0.0.1:5074',
      url: 'http://127.0.0.1:5074/api/angular-lookups',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
  ],
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
