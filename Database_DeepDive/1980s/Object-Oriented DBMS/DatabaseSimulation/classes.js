// classes.js
class Vehicle {
    constructor(id, make, model) {
        this.id = id;
        this.make = make;
        this.model = model;
        this.type = 'Vehicle';
    }

    getDetails() {
        return `${this.type}: ${this.make} ${this.model}`;
    }
}

class Car extends Vehicle {
    constructor(id, make, model, doors) {
        super(id, make, model);
        this.doors = doors;
        this.type = 'Car';
    }

    getDetails() {
        return `${super.getDetails()} with ${this.doors} doors`;
    }
}

class Motorcycle extends Vehicle {
    constructor(id, make, model, hasSidecar) {
        super(id, make, model);
        this.hasSidecar = hasSidecar;
        this.type = 'Motorcycle';
    }

    getDetails() {
        return `${super.getDetails()}${this.hasSidecar ? ' with a sidecar' : ''}`;
    }
}

module.exports = { Vehicle, Car, Motorcycle };