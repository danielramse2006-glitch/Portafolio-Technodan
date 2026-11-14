import { defineConfig } from '@playwright/test';
const port=3198;
export default defineConfig({
  testDir:'./tests',workers:2,reporter:[['list'],['html',{open:'never'}]],
  use:{baseURL:'http://127.0.0.1:'+port,browserName:'chromium',channel:process.env.PLAYWRIGHT_CHANNEL||undefined,trace:'retain-on-failure',reducedMotion:'reduce'},
  webServer:{command:'node node_modules/next/dist/bin/next start -p '+port,port,reuseExistingServer:false,timeout:30000},
});
