// appB.js
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'appB_users.json');

// Initialize the file if it doesn't exist
if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
}

// Function to add a user
function addUser(user) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    data.push(user);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`App B: User ${user.name} added.`);
}

// Function to get all users
function getUsers() {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return data;
}

// Example Usage
addUser({ id: 1, name: 'Bob', email: 'bob@example.com' });
console.log('App B Users:', getUsers());
