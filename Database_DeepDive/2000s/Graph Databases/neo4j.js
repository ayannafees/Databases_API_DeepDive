// neo4j.js
const neo4j = require('neo4j-driver');

// Create a driver instance, for the user neo4j with password 'password'.
const uri = 'bolt://localhost:7687'; // Replace with your Neo4j URI
const user = 'neo4j'; // Replace with your Neo4j username
const password = 'password'; // Replace with your Neo4j password

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

async function run() {
    const session = driver.session();

    try {
        // Create Nodes and Relationships
        await session.writeTransaction(tx =>
            tx.run(
                `CREATE (a:Person {name: $aliceName, age: $aliceAge})
                  CREATE (b:Person {name: $bobName, age: $bobAge})
                  CREATE (c:Company {name: $companyName})
                  CREATE (a)-[:WORKS_AT {since: $since}]->(c)
                  CREATE (b)-[:WORKS_AT {since: $since}]->(c)
                  CREATE (a)-[:FRIEND_OF]->(b)`,
                {
                    aliceName: 'Alice Smith',
                    aliceAge: 30,
                    bobName: 'Bob Johnson',
                    bobAge: 35,
                    companyName: 'TechCorp',
                    since: 2015
                }
            )
        );
        console.log('Nodes and relationships created');

        // Query Relationships
        const result = await session.readTransaction(tx =>
            tx.run(
                `MATCH (p:Person)-[r:WORKS_AT]->(c:Company)
                 RETURN p.name AS name, c.name AS company, r.since AS since`
            )
        );

        console.log('People and their Companies:');
        result.records.forEach(record => {
            console.log(`${record.get('name')} works at ${record.get('company')} since ${record.get('since')}`);
        });

        // Find Friends
        const friendsResult = await session.readTransaction(tx =>
            tx.run(
                `MATCH (a:Person)-[:FRIEND_OF]->(b:Person)
                 RETURN a.name AS person, b.name AS friend`
            )
        );

        console.log('\nFriendships:');
        friendsResult.records.forEach(record => {
            console.log(`${record.get('person')} is friends with ${record.get('friend')}`);
        });
    } catch (err) {
        console.error('An error occurred:', err);
    } finally {
        await session.close();
        await driver.close();
        console.log('Neo4j connection closed');
    }
}

run();


/*
Expected Output:

Nodes and relationships created
People and their Companies:
Alice Smith works at TechCorp since 2015
Bob Johnson works at TechCorp since 2015

Friendships:
Alice Smith is friends with Bob Johnson
Neo4j connection closed

Explanation:

Create Nodes:

Persons: Alice and Bob with properties like name and age.
Company: TechCorp with a name property.
Create Relationships:

WORKS_AT: Alice and Bob work at TechCorp since 2015.
FRIEND_OF: Alice is friends with Bob.
Query Relationships:

Retrieves and displays who works at which company.
Retrieves and displays friendships between persons.
Notes:

Cypher Query Language: Neo4j uses Cypher, a declarative graph query language, similar in intent to SQL but optimized for graph operations.
Transactions: Ensures that operations are executed safely and consistently.
Graph Traversal: Efficiently navigates complex relationships, which is more cumbersome in relational databases.
*/