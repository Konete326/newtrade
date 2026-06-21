const { connectControlDB } = require('../config/db');

let User = null;
let Tenant = null;

const getUserModel = async () => {
  if (User) return User;
  const conn = await connectControlDB();
  const userSchema = require('../models/UserModel');
  User = conn.model('User', userSchema);
  return User;
};

const getTenantModel = async () => {
  if (Tenant) return Tenant;
  const conn = await connectControlDB();
  const tenantSchema = require('../models/TenantModel');
  Tenant = conn.model('Tenant', tenantSchema);
  return Tenant;
};

module.exports = { getUserModel, getTenantModel };
