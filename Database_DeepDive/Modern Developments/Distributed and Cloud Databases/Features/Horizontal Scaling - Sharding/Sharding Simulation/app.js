// app.js
const { connectShards, getShard, closeShards } = require('./shardManager');

async function run() {
    try {
        // Connect to all shards
        await connectShards();

        // Sample Users
        const users = [
            { userId: 1, name: 'Alice', email: 'alice@example.com' },
            { userId: 2, name: 'Bob', email: 'bob@example.com' },
            { userId: 3, name: 'Charlie', email: 'charlie@example.com' },
            { userId: 4, name: 'Diana', email: 'diana@example.com' },
            { userId: 5, name: 'Ethan', email: 'ethan@example.com' }
        ];

        // Create (Insert) Users
        for (let user of users) {
            const shard = getShard(user.userId);
            const db = shard.client.db(shard.dbName);
            const collection = db.collection('users');
            await collection.insertOne(user);
            console.log(`Inserted user ${user.name} into Shard ${shard.id}`);
        }

        // Read (Find) Users from Shard 0
        const shard0 = getShard(0);
        const db0 = shard0.client.db(shard0.dbName);
        const usersInShard0 = await db0.collection('users').find({}).toArray();
        console.log(`\nUsers in Shard ${shard0.id}:`, usersInShard0);

        // Update User
        const userToUpdate = { userId: 3 };
        const shardToUpdate = getShard(userToUpdate.userId);
        const dbUpdate = shardToUpdate.client.db(shardToUpdate.dbName);
        const updateResult = await dbUpdate.collection('users').updateOne(
            { userId: userToUpdate.userId },
            { $set: { email: 'charlie.new@example.com' } }
        );
        console.log(`\nUpdated User ${userToUpdate.userId} in Shard ${shardToUpdate.id}:`, updateResult.modifiedCount);

        // Delete User
        const userToDelete = { userId: 2 };
        const shardToDelete = getShard(userToDelete.userId);
        const dbDelete = shardToDelete.client.db(shardToDelete.dbName);
        const deleteResult = await dbDelete.collection('users').deleteOne({ userId: userToDelete.userId });
        console.log(`\nDeleted User ${userToDelete.userId} from Shard ${shardToDelete.id}:`, deleteResult.deletedCount);

        // Final State of All Shards
        for (let shard of [0, 1]) {
            const db = shard.client.db(shard.dbName);
            const allUsers = await db.collection('users').find({}).toArray();
            console.log(`\nFinal Users in Shard ${shard.id}:`, allUsers);
        }

    } catch (err) {
        console.error('An error occurred:', err);
    } finally {
        // Close all shard connections
        await closeShards();
    }
}

run();



/*Expected Output:

css
Copy code
Connected to Shard 0 at mongodb://localhost:27017
Connected to Shard 1 at mongodb://localhost:27018
Inserted user Alice into Shard 1
Inserted user Bob into Shard 0
Inserted user Charlie into Shard 1
Inserted user Diana into Shard 0
Inserted user Ethan into Shard 1

Users in Shard 0: [
  { _id: ObjectId("..."), userId: 2, name: 'Bob', email: 'bob@example.com' },
  { _id: ObjectId("..."), userId: 4, name: 'Diana', email: 'diana@example.com' }
]

Updated User 3 in Shard 1: 1

Deleted User 2 from Shard 0: 1

Final Users in Shard 0: [
  { _id: ObjectId("..."), userId: 4, name: 'Diana', email: 'diana@example.com' }
]

Final Users in Shard 1: [
  { _id: ObjectId("..."), userId: 1, name: 'Alice', email: 'alice@example.com' },
  { _id: ObjectId("..."), userId: 3, name: 'Charlie', email: 'charlie.new@example.com' },
  { _id: ObjectId("..."), userId: 5, name: 'Ethan', email: 'ethan@example.com' }
]
Disconnected from Shard 0
Disconnected from Shard 1 */