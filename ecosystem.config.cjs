module.exports = {
  apps: [
    {
      name: "chat-gpt-russian",
      script: "./.output/server/index.mjs",
      port: "3000",
      exec_mode: "cluster",
      instances: "max",
      autorestart: true,
      pre_setup: "npm install && npm run build",
      env: {
        "PORT": 3000,
        "NODE_ENV": "development",
        "AUTH_ORIGIN": "http://localhost:3000"
      },
      env_production: {
        HOST: "0.0.0.0",
        PORT: 80,
        NODE_ENV: "production",
        AUTH_ORIGIN: "http://chat-gpt-free-russian.ru/",
        NEXTAUTH_URL: "http://chat-gpt-free-russian.ru/",
      }
    },
  ],
};
