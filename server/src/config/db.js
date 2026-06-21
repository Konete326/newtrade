const mongoose = require('mongoose');

let controlConnection = null;

const connectControlDB = async () => {
  if (controlConnection) return controlConnection;
  const uri = process.env.MONGO_URI.replace(/\/[^/?]*(\?|$)/, '/trader_desktop_control$1');
  controlConnection = await mongoose.createConnection(uri).asPromise();
  return controlConnection;
};

const getControlConnection = () => controlConnection;

module.exports = { connectControlDB, getControlConnection };
