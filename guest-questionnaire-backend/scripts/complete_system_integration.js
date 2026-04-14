const mysql = require('mysql2/promise');
require('dotenv').config();

async function integrateFullSystem() {
    console.log('🚀 Starting End-to-End System Integration...');
    
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || '127.0.0.1',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || '',
        database: process.env.DB_NAME || 'guest_questionnaire_db',
        port: process.env.DB_PORT || 3306,
    });

    try {
        console.log('1. Creating Specialized Relational Tables...');
        const tableStatements = [
            `CREATE TABLE IF NOT EXISTS project_benchmarks (
                id INT AUTO_INCREMENT PRIMARY KEY,
                submission_id INT NOT NULL,
                type ENUM('preferred', 'competitor', 'inspired') NOT NULL,
                url VARCHAR(500) NOT NULL,
                FOREIGN KEY (submission_id) REFERENCES guest_submissions(id) ON DELETE CASCADE
            );`,
            `CREATE TABLE IF NOT EXISTS project_social_links (
                id INT AUTO_INCREMENT PRIMARY KEY,
                submission_id INT NOT NULL,
                platform VARCHAR(100) NOT NULL,
                url VARCHAR(500) NOT NULL,
                FOREIGN KEY (submission_id) REFERENCES guest_submissions(id) ON DELETE CASCADE
            );`,
            `CREATE TABLE IF NOT EXISTS project_team_members (
                id INT AUTO_INCREMENT PRIMARY KEY,
                submission_id INT NOT NULL,
                name VARCHAR(255) NOT NULL,
                role VARCHAR(255) NOT NULL,
                FOREIGN KEY (submission_id) REFERENCES guest_submissions(id) ON DELETE CASCADE
            );`,
            `CREATE TABLE IF NOT EXISTS project_reviews (
                submission_id INT PRIMARY KEY,
                count VARCHAR(50),
                source VARCHAR(100),
                top_testimonial TEXT,
                FOREIGN KEY (submission_id) REFERENCES guest_submissions(id) ON DELETE CASCADE
            );`,
            `CREATE TABLE IF NOT EXISTS developer_checklists (
                id INT AUTO_INCREMENT PRIMARY KEY,
                submission_id INT NOT NULL,
                label VARCHAR(255) NOT NULL,
                is_completed BOOLEAN DEFAULT FALSE,
                category ENUM('Identity', 'Technical', 'Content', 'Handover') DEFAULT 'Content',
                FOREIGN KEY (submission_id) REFERENCES guest_submissions(id) ON DELETE CASCADE
            );`,
            `CREATE TABLE IF NOT EXISTS project_selections (
                id INT AUTO_INCREMENT PRIMARY KEY,
                submission_id INT NOT NULL,
                selection_type ENUM('product', 'service', 'usp', 'brand_vibe') NOT NULL,
                value VARCHAR(255) NOT NULL,
                is_high_impact BOOLEAN DEFAULT FALSE,
                is_custom BOOLEAN DEFAULT FALSE,
                FOREIGN KEY (submission_id) REFERENCES guest_submissions(id) ON DELETE CASCADE
            );`
        ];

        for (const sql of tableStatements) {
            await connection.query(sql);
        }

        console.log('2. Provisioning Hierarchical Master Types...');
        const [types] = await connection.query(`SELECT id FROM master_types WHERE name IN ('BusinessCategory', 'BusinessSubCategory', 'BusinessOffering', 'BusinessUSP')`);
        
        if (types.length === 0) {
            await connection.query(`INSERT INTO master_types (name, description) VALUES 
                ('BusinessCategory', 'High-level industries'),
                ('BusinessSubCategory', 'Specific industry branches'),
                ('BusinessOffering', 'Products or Services provided'),
                ('BusinessUSP', 'Unique Selling Propositions')`);
        }

        // Get IDs
        const [rows] = await connection.query(`SELECT id, name FROM master_types WHERE name IN ('BusinessCategory', 'BusinessSubCategory', 'BusinessOffering', 'BusinessUSP')`);
        const typeMap = rows.reduce((acc, row) => ({ ...acc, [row.name]: row.id }), {});

        console.log('3. Seeding Hierarchical Category Data...');
        // Clear old ones to prevent duplicates in seed
        await connection.query(`SET FOREIGN_KEY_CHECKS = 0;`);
        await connection.query(`DELETE FROM master_values WHERE master_type_id IN (?, ?, ?, ?)`, [typeMap.BusinessCategory, typeMap.BusinessSubCategory, typeMap.BusinessOffering, typeMap.BusinessUSP]);
        await connection.query(`SET FOREIGN_KEY_CHECKS = 1;`);

        const categories = [
            { name: 'Real Estate', subs: [
                { name: 'Residential Sales', products: ['Luxury Villas', 'Gated Plots', 'Affordable Apartments'], usps: ['RERA Approved', 'Prime Locations'] },
                { name: 'Commercial Leasing', products: ['Office Spaces', 'Retail Outlets'], usps: ['High ROI', 'prime Strategic Hubs'] }
            ]},
            { name: 'Food & Beverage', subs: [
                { name: 'Fine Dining', products: ['Gourmet Platters', 'Wine Selection'], usps: ['Chef Authenticated', 'Ambient Decor'] },
                { name: 'Cloud Kitchen', products: ['Family Combos', 'Meal Kits'], usps: ['30-min Delivery', 'Hygienic Prep'] }
            ]}
        ];

        for (const cat of categories) {
            const [cRes] = await connection.query(`INSERT INTO master_values (master_type_id, value, label) VALUES (?, ?, ?)`, [typeMap.BusinessCategory, cat.name, cat.name]);
            const catId = cRes.insertId;

            for (const sub of cat.subs) {
                const [sRes] = await connection.query(`INSERT INTO master_values (master_type_id, parent_id, value, label) VALUES (?, ?, ?, ?)`, [typeMap.BusinessSubCategory, catId, sub.name, sub.name]);
                const subId = sRes.insertId;

                for (const prod of sub.products) {
                    await connection.query(`INSERT INTO master_values (master_type_id, parent_id, value, label) VALUES (?, ?, ?, ?)`, [typeMap.BusinessOffering, subId, prod, prod]);
                }
                for (const usp of sub.usps) {
                    await connection.query(`INSERT INTO master_values (master_type_id, parent_id, value, label) VALUES (?, ?, ?, ?)`, [typeMap.BusinessUSP, subId, usp, usp]);
                }
            }
        }

        console.log('✨ System Core Integrated Successfully.');
    } catch (err) {
        console.error('Integration failed:', err.message);
    } finally {
        await connection.end();
    }
}

integrateFullSystem();
