const mongoose = require('mongoose');
const { LRUCache } = require('lru-cache');

const connectionCache = new LRUCache({
  max: 100,
  ttl: 1000 * 60 * 30,
  dispose: (connection) => {
    if (connection && connection.readyState === 1) {
      connection.close().catch(() => {});
    }
  }
});

const modelRegistry = new Map();

const getConnection = async (companyId) => {
  if (connectionCache.has(companyId)) {
    return connectionCache.get(companyId);
  }
  const dbName = `tenant_${companyId}`;
  const uri = process.env.MONGO_URI.replace(/\/([^/?]+)(\?|$)/, `/${dbName}$2`);
  const conn = mongoose.createConnection(uri);
  await conn.asPromise();
  connectionCache.set(companyId, conn);
  return conn;
};

const getModel = (companyId, modelName) => {
  const key = `${companyId}_${modelName}`;
  if (modelRegistry.has(key)) {
    return modelRegistry.get(key);
  }
  const conn = connectionCache.get(companyId);
  if (!conn) return null;
  const schemaFactory = require(`../models/${modelName}`);
  const model = conn.model(modelName, schemaFactory);
  modelRegistry.set(key, model);
  return model;
};

const closeAll = async () => {
  for (const [key, conn] of connectionCache) {
    if (conn.readyState === 1) await conn.close().catch(() => {});
  }
  connectionCache.clear();
  modelRegistry.clear();
};

module.exports = { getConnection, getModel, closeAll, connectionCache };
