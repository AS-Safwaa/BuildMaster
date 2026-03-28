const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function run() {
    const db = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    });

    console.log('Connected. Running Module 7 Migrations...');

    try {
        // 1. Rename table and add role
        await db.execute("ALTER TABLE admins RENAME TO users;");
        await db.execute("ALTER TABLE users ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'admin';");
        
        // 2. Add assignment tracking to submissions
        await db.execute("ALTER TABLE guest_submissions ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'unassigned';");
        await db.execute("ALTER TABLE guest_submissions ADD COLUMN assigned_developer_id INT NULL;");
        
        // Disable foreign key checks momentarily if there are index issues, or just add the FK normally.
        await db.execute("ALTER TABLE guest_submissions ADD FOREIGN KEY (assigned_developer_id) REFERENCES users(id) ON DELETE SET NULL;");

        // 3. Inject new Developers
        const devPassword = await bcrypt.hash('Developer@123', 10);
        await db.execute("INSERT INTO users (name, email, password_hash, role) VALUES ('Lead Developer', 'developer@demo.com', ?, 'developer');", [devPassword]);
        await db.execute("INSERT INTO users (name, email, password_hash, role) VALUES ('UI Specialist', 'ui@demo.com', ?, 'developer');", [devPassword]);
        await db.execute("INSERT INTO users (name, email, password_hash, role) VALUES ('Backend Engineer', 'backend@demo.com', ?, 'developer');", [devPassword]);

        // 4. Inject 4 unique robust dummy projects
        const mockVibeCards = JSON.stringify(["minimal", "dark"]);
        const dummy1 = JSON.stringify({
            businessName: 'Neon Digital Edge', 
            tagline: 'The future of Web3 architectures.', 
            contactName: 'Alice Neon',
            stylePreference: mockVibeCards,
            primaryServices: 'Blockchain Consulting, Smart Contracts'
        });
        const dummy2 = JSON.stringify({
            businessName: 'Apex Health Systems', 
            tagline: 'Live stronger, smarter.', 
            contactName: 'Dr. John Apex',
            primaryServices: 'Telemedicine, B2B Healthcare integrations'
        });
        const dummy3 = JSON.stringify({
            businessName: 'Velocity HyperMotors', 
            tagline: 'Speed defined by silence.', 
            contactName: 'Sarah Velocity',
            primaryServices: 'EV Manufacturing'
        });
        const dummy4 = JSON.stringify({
            businessName: 'Lumina Home Goods', 
            tagline: 'Brighten your absolute living space.', 
            contactName: 'Mark Lumina',
            primaryServices: 'E-commerce, Dropshipping'
        });

        await db.execute("INSERT INTO guest_submissions (email, lead_source, answers, status) VALUES ('alice@neon.com', 'self', ?, 'unassigned');", [dummy1]);
        await db.execute("INSERT INTO guest_submissions (email, lead_source, answers, status) VALUES ('dr@apex.com', 'referral', ?, 'assigned');", [dummy2]);
        await db.execute("INSERT INTO guest_submissions (email, lead_source, answers, status) VALUES ('sarah@velocity.com', 'self', ?, 'in_progress');", [dummy3]);
        await db.execute("INSERT INTO guest_submissions (email, lead_source, answers, status) VALUES ('mark@lumina.com', 'referral', ?, 'unassigned');", [dummy4]);

        // Assign one project to the new developer (assuming Lead Developer gets ID 2, since admin is 1)
        // Wait, let's just assign the 'assigned' and 'in_progress' to dev ID 2
        await db.execute("UPDATE guest_submissions SET assigned_developer_id = 2 WHERE status IN ('assigned', 'in_progress');");

        console.log('Migration Module 7 Complete.');
    } catch(e) {
        console.error('Migration Error:', e);
    }
    process.exit();
}
run();
