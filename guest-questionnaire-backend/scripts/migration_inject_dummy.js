const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

async function run() {
    const db = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    });

    console.log('Connected. Running Safe Data Injection...');

    try {
        // Inject 4 unique robust dummy projects
        const dummy1 = { s: uuidv4(), e: 'alice@neon.com', b: 'Neon Digital Edge', st: 'unassigned' };
        const dummy2 = { s: uuidv4(), e: 'dr@apex.com', b: 'Apex Health Systems', st: 'assigned', d: 2 }; // dev id 2
        const dummy3 = { s: uuidv4(), e: 'sarah@velocity.com', b: 'Velocity HyperMotors', st: 'in_progress', d: 2 };
        const dummy4 = { s: uuidv4(), e: 'mark@lumina.com', b: 'Lumina Home Goods', st: 'unassigned' };

        await db.execute("INSERT INTO guest_submissions (session_id, contact_email, business_name, status) VALUES (?, ?, ?, ?);", [dummy1.s, dummy1.e, dummy1.b, dummy1.st]);
        await db.execute("INSERT INTO guest_submissions (session_id, contact_email, business_name, status, assigned_developer_id) VALUES (?, ?, ?, ?, ?);", [dummy2.s, dummy2.e, dummy2.b, dummy2.st, dummy2.d]);
        await db.execute("INSERT INTO guest_submissions (session_id, contact_email, business_name, status, assigned_developer_id) VALUES (?, ?, ?, ?, ?);", [dummy3.s, dummy3.e, dummy3.b, dummy3.st, dummy3.d]);
        await db.execute("INSERT INTO guest_submissions (session_id, contact_email, business_name, status) VALUES (?, ?, ?, ?);", [dummy4.s, dummy4.e, dummy4.b, dummy4.st]);

        console.log('Dummy projects perfectly injected based on physical DB schema limits!');
    } catch(e) {
        console.error('Injection Error:', e);
    }
    process.exit();
}
run();
