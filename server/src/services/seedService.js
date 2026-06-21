const { getUserModel, getTenantModel } = require('./authService');

const seedSuperAdmin = async () => {
  const User = await getUserModel();
  const Tenant = await getTenantModel();
  const existing = await User.findOne({ role: 'SUPER_ADMIN' });
  if (existing) {
    process.stdout.write('Super admin already exists, skipping seed.\n');
    return;
  }

  let tenant = await Tenant.findOne({ email: process.env.SUPER_ADMIN_EMAIL });
  if (!tenant) {
    tenant = await Tenant.create({
      name: 'Platform Admin',
      email: process.env.SUPER_ADMIN_EMAIL,
      status: 'ACTIVE',
      subscriptionPlan: 'ENTERPRISE',
      maxUsers: 999
    });
  }

  await User.create({
    companyId: tenant._id.toString(),
    name: process.env.SUPER_ADMIN_NAME || 'Super Admin',
    email: process.env.SUPER_ADMIN_EMAIL,
    password: process.env.SUPER_ADMIN_PASSWORD,
    role: 'SUPER_ADMIN',
    isActive: true
  });
  process.stdout.write('Super admin seeded successfully.\n');
};

module.exports = { seedSuperAdmin };
