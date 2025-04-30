module.exports = {
  apps: [
    {
      name: "sigos",
      script: "npm",
      args: "start",
      env: {
        PORT: 3001,
      },
    },
  ],
};
