// shardManager.js
const { MongoClient } = require('mongodb');

// Shard configurations
const shards = [
    {
        id: 0,
        uri: 'mongodb://localhost:27017',
        dbName: 'shard1'
    },
    {
        id: 1,
        uri: 'mongodb://localhost:27018',
        dbName: 'shard2'
    }
];

// Create MongoClient instances for each shard
const clients = shards.map(shard => ({
    id: shard.id,
    client: new MongoClient(shard.uri, { useNewUrlParser: true, useUnifiedTopology: true }),
    dbName: shard.dbName
}));

// Connect to all shards
async function connectShards() {
    for (let shard of clients) {
        await shard.client.connect();
        console.log(`Connected to Shard ${shard.id} at ${shard.uri}`);
    }
}

// Determine the shard based on userId
function getShard(userId) {
    const shardId = userId % shards.length;
    return clients.find(shard => shard.id === shardId);
}

// Close all shard connections
async function closeShards() {
    for (let shard of clients) {
        await shard.client.close();
        console.log(`Disconnected from Shard ${shard.id}`);
    }
}

module.exports = {
    connectShards,
    getShard,
    closeShards
};
