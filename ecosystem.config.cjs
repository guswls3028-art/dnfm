module.exports = {
  apps: [
    {
      name: "dnfm-newb",
      script: ".next/standalone/server.js",
      cwd: __dirname,
      env: {
        HOSTNAME: "127.0.0.1",
        NODE_ENV: "production",
        PORT: "3000",
      },
    },
  ],
};
