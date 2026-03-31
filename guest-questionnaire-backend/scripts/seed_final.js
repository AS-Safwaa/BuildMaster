const pool = require('../config/db');
const bcrypt = require('bcrypt');

async function seed() {
    try {
        console.log('Seeding Users...');
        const devPassword = await bcrypt.hash('Developer@123', 10);
        const adminPassword = await bcrypt.hash('Admin@123', 10);

        // 1. Seed Developers
        await pool.query("INSERT IGNORE INTO users (name, email, password_hash, role) VALUES ('Lead Developer', 'developer@demo.com', ?, 'developer')", [devPassword]);
        await pool.query("INSERT IGNORE INTO users (name, email, password_hash, role) VALUES ('UI Specialist', 'ui@demo.com', ?, 'developer')", [devPassword]);
        await pool.query("INSERT IGNORE INTO users (name, email, password_hash, role) VALUES ('Backend Engineer', 'backend@demo.com', ?, 'developer')", [devPassword]);
        
        // 2. Seed Admin (if not there)
        await pool.query("INSERT IGNORE INTO users (name, email, password_hash, role) VALUES ('System Admin', 'admin@demo.com', ?, 'admin')", [adminPassword]);

        console.log('Seeding Dummy Projects...');
        const dummy1 = JSON.stringify({ businessName: 'Neon Digital Edge', tagline: 'The future of Web3 architectures.', contactName: 'Alice Neon' });
        const dummy2 = JSON.stringify({ businessName: 'Apex Health Systems', tagline: 'Live stronger, smarter.', contactName: 'Dr. John Apex' });

        await pool.query("INSERT INTO guest_submissions (email, lead_source, answers, status) VALUES ('alice@neon.com', 'self', ?, 'unassigned')", [dummy1]);
        await pool.query("INSERT INTO guest_submissions (email, lead_source, answers, status) VALUES ('dr@apex.com', 'referral', ?, 'assigned')", [dummy2]);

        console.log('Seeding Complete.');
    } catch (err) {
        console.error('Seed Error:', err);
    }
    process.exit();
}

seed();
