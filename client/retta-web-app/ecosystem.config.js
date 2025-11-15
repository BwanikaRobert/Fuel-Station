module.exports = {
  apps: [
    {
      name: 'fuel-station',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/Fuel-Station/client/retta-web-app',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: '/var/log/pm2/fuel-station-error.log',
      out_file: '/var/log/pm2/fuel-station-out.log',
      log_file: '/var/log/pm2/fuel-station-combined.log',
      time: true,
    },
  ],
};
