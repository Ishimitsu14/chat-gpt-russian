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
    },
  ],
};
