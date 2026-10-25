require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../app_api/models/user');

async function main() {
  const { ADMIN_EMAIL, ADMIN_NAME, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_NAME || !ADMIN_PASSWORD) {
    throw new Error('Set ADMIN_EMAIL, ADMIN_NAME, and ADMIN_PASSWORD in the environment.');
  }
  await mongoose.connect(`mongodb://${process.env.DB_HOST || '127.0.0.1'}/travlr`);
  if (await User.exists({})) {
    throw new Error('Bootstrap is disabled because a staff account already exists.');
  }
  const user = new User({ email: ADMIN_EMAIL, name: ADMIN_NAME });
  user.setPassword(ADMIN_PASSWORD);
  await user.save();
  console.log('Initial staff account created.');
}
main().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
}).finally(() => mongoose.disconnect());
