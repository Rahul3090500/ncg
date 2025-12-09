module.exports = {
  apps: [
    {
      name: 'ncg',
      cwd: __dirname + '/../../..',
      script: 'node_modules/.bin/next',
      args: 'start -p 3000',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
}