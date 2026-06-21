require('dotenv').config();
const app = require('../src/app');
const { connectControlDB } = require('../src/config/db');
const { seedSuperAdmin } = require('../src/services/seedService');

let initialized = false;

const init = async () => {
  if (initialized) return;
  initialized = true;
  try {
    await connectControlDB();
    await seedSuperAdmin();
  } catch (err) {
    console.error('DB init error:', err.message);
  }
};

module.exports = async (req, res) => {
  await init();
  return app(req, res);
};
