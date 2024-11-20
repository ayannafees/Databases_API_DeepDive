// mongodb.js
const { MongoClient } = require('mongodb');

// Connection URL
const url = 'mongodb://localhost:27017'; // Replace with your MongoDB URI
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

// Database and Collection Names
const dbName = 'techcorp';
const collectionName = 'employees';

async function run() {
    try {
        // Connect to MongoDB
        await client.connect();
        console.log('Connected successfully to MongoDB');

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Insert Documents
        const insertResult = await collection.insertMany([
            { name: 'Alice Smith', role: 'Engineer', skills: ['JavaScript', 'Node.js'], department: 'Engineering' },
            { name: 'Bob Johnson', role: 'HR Manager', skills: ['Recruitment', 'Employee Relations'], department: 'Human Resources' },
            { name: 'Charlie Williams', role: 'Marketing Specialist', skills: ['SEO', 'Content Creation'], department: 'Marketing' }
        ]);
        console.log(`${insertResult.insertedCount} documents were inserted`);

        // Query Documents
        const query = { department: 'Engineering' };
        const engineers = await collection.find(query).toArray();
        console.log('Engineering Department Employees:', engineers);

        // Update a Document
        const updateResult = await collection.updateOne(
            { name: 'Alice Smith' },
            { $set: { role: 'Senior Engineer', skills: ['JavaScript', 'Node.js', 'Python'] } }
        );
        console.log(`Matched ${updateResult.matchedCount} and modified ${updateResult.modifiedCount} document(s)`);

        // Delete a Document
        const deleteResult = await collection.deleteOne({ name: 'Charlie Williams' });
        console.log(`Deleted ${deleteResult.deletedCount} document(s)`);

        // Final State
        const finalEmployees = await collection.find({}).toArray();
        console.log('Final Employees:', finalEmployees);
    } catch (err) {
        console.error(err.stack);
    } finally {
        // Close the connection
        await client.close();
        console.log('MongoDB connection closed');
    }
}

run();


/*
Expected Output:

css
Copy code
Connected successfully to MongoDB
3 documents were inserted
Engineering Department Employees: [
  {
    _id: ObjectId("..."),
    name: 'Alice Smith',
    role: 'Engineer',
    skills: [ 'JavaScript', 'Node.js' ],
    department: 'Engineering'
  }
]
Matched 1 and modified 1 document(s)
Deleted 1 document(s)
Final Employees: [
  {
    _id: ObjectId("..."),
    name: 'Alice Smith',
    role: 'Senior Engineer',
    skills: [ 'JavaScript', 'Node.js', 'Python' ],
    department: 'Engineering'
  },
  {
    _id: ObjectId("..."),
    name: 'Bob Johnson',
    role: 'HR Manager',
    skills: [ 'Recruitment', 'Employee Relations' ],
    department: 'Human Resources'
  }
]
MongoDB connection closed
Explanation:

Insert: Adds three employee documents with varying structures.
Query: Retrieves employees from the Engineering department.
Update: Modifies Alice's role and adds a new skill.
Delete: Removes Charlie from the database.
Final State: Displays the remaining employees.
*/