// app.js
const { MongoClient } = require('mongodb');

// Replace the following with your MongoDB Atlas connection string
const uri = 'mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority';

// Create a new MongoClient
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Database and Collection Names
const dbName = 'companyDB';
const collectionName = 'employees';

async function run() {
    try {
        // Connect to MongoDB Atlas
        await client.connect();
        console.log('Connected successfully to MongoDB Atlas');

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Clear existing data (for demo purposes)
        await collection.deleteMany({});
        console.log('Cleared existing employee data');

        // Insert Employees
        const employees = [
            { name: 'Alice Smith', role: 'Engineer', skills: ['JavaScript', 'Node.js'], department: 'Engineering' },
            { name: 'Bob Johnson', role: 'HR Manager', skills: ['Recruitment', 'Employee Relations'], department: 'Human Resources' },
            { name: 'Charlie Williams', role: 'Marketing Specialist', skills: ['SEO', 'Content Creation'], department: 'Marketing' }
        ];

        const insertResult = await collection.insertMany(employees);
        console.log(`${insertResult.insertedCount} employees were inserted`);

        // Query Employees in Engineering Department
        const query = { department: 'Engineering' };
        const engineeringEmployees = await collection.find(query).toArray();
        console.log('Engineering Department Employees:', engineeringEmployees);

        // Update an Employee's Role
        const updateFilter = { name: 'Alice Smith' };
        const updateDoc = { $set: { role: 'Senior Engineer', skills: ['JavaScript', 'Node.js', 'Python'] } };
        const updateResultOp = await collection.updateOne(updateFilter, updateDoc);
        console.log(`Matched ${updateResultOp.matchedCount} and modified ${updateResultOp.modifiedCount} document(s)`);

        // Delete an Employee
        const deleteFilter = { name: 'Charlie Williams' };
        const deleteResultOp = await collection.deleteOne(deleteFilter);
        console.log(`Deleted ${deleteResultOp.deletedCount} document(s)`);

        // Final List of Employees
        const finalEmployees = await collection.find({}).toArray();
        console.log('Final Employees:', finalEmployees);
    } catch (err) {
        console.error('An error occurred:', err);
    } finally {
        // Close the connection
        await client.close();
        console.log('MongoDB Atlas connection closed');
    }
}

run();


/*
Expected Output:

css
Copy code
Connected successfully to MongoDB Atlas
Cleared existing employee data
3 employees were inserted
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
MongoDB Atlas connection closed
*/