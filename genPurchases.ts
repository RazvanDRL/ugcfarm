import { faker } from '@faker-js/faker';
import fs from 'fs';
export interface Purchase {
    name: string;
    product: string;
    timestamp: number;
}

const purchases: Purchase[] = [];

for (let i = 0; i < 20; i++) {
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    purchases.push({
        name: faker.person.firstName() + " " + faker.person.lastName().charAt(0).toUpperCase() + ".",
        product: randomNumber > 50 ? "Creator Plan" : "Starter Plan",
        timestamp: faker.date.recent().getTime(),
    });
}

purchases.sort((a, b) => b.timestamp - a.timestamp);

// fs write file
fs.writeFileSync("purchases.json", JSON.stringify(purchases, null, 2));