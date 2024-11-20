// redis.js
const redis = require('redis');

// Create a Redis client
const client = redis.createClient({
    url: 'redis://localhost:6379' // Replace with your Redis URI
});

client.on('error', (err) => console.log('Redis Client Error', err));

async function run() {
    try {
        // Connect to Redis
        await client.connect();
        console.log('Connected to Redis');

        // Set Key-Value Pairs
        await client.set('user:1001', JSON.stringify({ name: 'Alice Smith', role: 'Engineer' }));
        await client.set('user:1002', JSON.stringify({ name: 'Bob Johnson', role: 'HR Manager' }));
        console.log('Key-Value pairs set');

        // Get a Value by Key
        const user1001 = await client.get('user:1001');
        console.log('Retrieved user:1001:', JSON.parse(user1001));

        // Update a Value
        await client.set('user:1001', JSON.stringify({ name: 'Alice Smith', role: 'Senior Engineer' }));
        console.log('Updated user:1001');

        // Delete a Key
        await client.del('user:1002');
        console.log('Deleted user:1002');

        // Final State
        const remainingUsers = await client.keys('user:*');
        console.log('Remaining Users:', remainingUsers);

        for (const key of remainingUsers) {
            const user = await client.get(key);
            console.log(`${key}:`, JSON.parse(user));
        }
    } catch (err) {
        console.error(err);
    } finally {
        // Disconnect from Redis
        await client.disconnect();
        console.log('Redis connection closed');
    }
}

run();

/*
Expected Output:

css
Copy code
Connected to Redis
Key-Value pairs set
Retrieved user:1001: { name: 'Alice Smith', role: 'Engineer' }
Updated user:1001
Deleted user:1002
Remaining Users: [ 'user:1001' ]
user:1001: { name: 'Alice Smith', role: 'Senior Engineer' }
Redis connection closed
Explanation:

Set: Stores user data as JSON strings with unique keys.
Get: Retrieves and parses the JSON data for a specific key.
Update: Overwrites the existing value for a key.
Delete: Removes a key-value pair.
Final State: Lists remaining users and their details.
*/
