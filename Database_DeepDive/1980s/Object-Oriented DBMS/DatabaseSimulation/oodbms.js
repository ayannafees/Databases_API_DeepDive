// oodbms.js
const fs = require('fs');
const path = require('path');
const { Vehicle, Car, Motorcycle } = require('./classes');

const dbFilePath = path.join(__dirname, 'vehicles.json');

// Initialize the database file if it doesn't exist
if (!fs.existsSync(dbFilePath)) {
    fs.writeFileSync(dbFilePath, JSON.stringify([]));
}

// Function to save an object to the "database"
function saveObject(obj) {
    const data = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
    data.push(obj);
    fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2));
    console.log(`Saved: ${obj.getDetails()}`);
}

// Function to retrieve all objects
function getAllObjects() {
    const data = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
    // Reconstruct objects based on type
    return data.map(item => {
        if (item.type === 'Car') {
            return new Car(item.id, item.make, item.model, item.doors);
        } else if (item.type === 'Motorcycle') {
            return new Motorcycle(item.id, item.make, item.model, item.hasSidecar);
        } else {
            return new Vehicle(item.id, item.make, item.model);
        }
    });
}

// Example Usage
function runExamples() {
    // Create objects
    const car1 = new Car(1, 'Toyota', 'Corolla', 4);
    const motorcycle1 = new Motorcycle(2, 'Harley-Davidson', 'Street 750', false);
    const vehicle1 = new Vehicle(3, 'Generic', 'Transporter');

    // Save objects
    saveObject(car1);
    saveObject(motorcycle1);
    saveObject(vehicle1);

    // Retrieve and display all objects
    const allVehicles = getAllObjects();
    console.log('\nAll Vehicles:');
    allVehicles.forEach(v => console.log(v.getDetails()));
}

runExamples();

/*
Expected Output:

vbnet
Copy code
Saved: Car: Toyota Corolla with 4 doors
Saved: Motorcycle: Harley-Davidson Street 750
Saved: Vehicle: Generic Transporter

All Vehicles:
Car: Toyota Corolla with 4 doors
Motorcycle: Harley-Davidson Street 750
Vehicle: Generic Transporter
*/