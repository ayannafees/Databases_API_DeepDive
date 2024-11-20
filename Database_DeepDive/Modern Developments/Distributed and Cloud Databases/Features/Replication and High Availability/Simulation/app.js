// app.js
const { MongoClient } = require('mongodb');

// Connection URI
const uri = "mongodb://mongo-primary:27017,mongo-secondary1:27017,mongo-secondary2:27017/?replicaSet=rs0";

// Database and Collection Names
const dbName = "companyDB";
const collectionName = "employees";

// Create a new MongoClient
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // Set pool size for better performance
    poolSize: 10
});

async function run() {
    try {
        // Connect to the MongoDB Replica Set
        await client.connect();
        console.log("Connected successfully to MongoDB Replica Set");

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Perform CRUD Operations

        // Create (Insert) Documents
        const insertResult = await collection.insertMany([
            { name: "Alice Smith", role: "Engineer", department: "Engineering" },
            { name: "Bob Johnson", role: "HR Manager", department: "Human Resources" },
            { name: "Charlie Williams", role: "Marketing Specialist", department: "Marketing" }
        ]);
        console.log(`${insertResult.insertedCount} employees were inserted.`);

        // Read (Find) Documents
        const engineeringEmployees = await collection.find({ department: "Engineering" }).toArray();
        console.log("Engineering Department Employees:", engineeringEmployees);

        // Update a Document
        const updateResult = await collection.updateOne(
            { name: "Alice Smith" },
            { $set: { role: "Senior Engineer" } }
        );
        console.log(`Updated ${updateResult.modifiedCount} employee(s).`);

        // Delete a Document
        const deleteResult = await collection.deleteOne({ name: "Charlie Williams" });
        console.log(`Deleted ${deleteResult.deletedCount} employee(s).`);

        // Final State of Collection
        const allEmployees = await collection.find({}).toArray();
        console.log("Final Employees:", allEmployees);

    } catch (err) {
        console.error("An error occurred:", err);
    } finally {
        // Close the connection
        await client.close();
        console.log("MongoDB connection closed");
    }
}

run();


/*
Connected successfully to MongoDB Replica Set
3 employees were inserted.
Engineering Department Employees: [
  {
    _id: ObjectId("..."),
    name: 'Alice Smith',
    role: 'Engineer',
    department: 'Engineering'
  }
]
Updated 1 employee(s).
Deleted 1 employee(s).
Final Employees: [
  {
    _id: ObjectId("..."),
    name: 'Alice Smith',
    role: 'Senior Engineer',
    department: 'Engineering'
  },
  {
    _id: ObjectId("..."),
    name: 'Bob Johnson',
    role: 'HR Manager',
    department: 'Human Resources'
  }
]
MongoDB connection closed
 */