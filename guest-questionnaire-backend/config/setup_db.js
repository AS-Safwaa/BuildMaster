const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupDatabase() {
    console.log('Connecting to MySQL Server to execute db_schema.md commands...');
    
    // Connect without database to create it first
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || '127.0.0.1',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || '',
        port: process.env.DB_PORT || 3306,
    });

    try {
        console.log('1. Creating database...');
        await connection.query(`CREATE DATABASE IF NOT EXISTS guest_questionnaire_db;`);
        await connection.query(`USE guest_questionnaire_db;`);

        console.log('2. Dropping old tables to refresh schema...');
        await connection.query(`SET FOREIGN_KEY_CHECKS = 0;`);
        const tables = ['guest_answers', 'guest_submissions', 'form_question_options', 'form_questions', 'form_steps', 'master_values', 'master_types', 'admins'];
        for (const table of tables) {
            await connection.query(`DROP TABLE IF EXISTS ${table};`);
        }
        await connection.query(`SET FOREIGN_KEY_CHECKS = 1;`);

        console.log('3. Creating Tables...');
        const createStatements = [
            `CREATE TABLE admins (
                id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL UNIQUE, password_hash VARCHAR(255) NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );`,
            `CREATE TABLE master_types (
                id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL UNIQUE, description TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );`,
            `CREATE TABLE master_values (
                id INT AUTO_INCREMENT PRIMARY KEY, master_type_id INT NOT NULL, parent_id INT DEFAULT NULL, value VARCHAR(255) NOT NULL, label VARCHAR(255) NOT NULL, image_url VARCHAR(500) DEFAULT NULL, is_active BOOLEAN DEFAULT TRUE, list_order INT DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (master_type_id) REFERENCES master_types(id) ON DELETE CASCADE, FOREIGN KEY (parent_id) REFERENCES master_values(id) ON DELETE SET NULL
            );`,
            `CREATE TABLE form_steps (
                id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255) NOT NULL, description TEXT, step_order INT NOT NULL, is_active BOOLEAN DEFAULT TRUE, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );`,
            `CREATE TABLE form_questions (
                id INT AUTO_INCREMENT PRIMARY KEY, step_id INT NOT NULL, master_type_id INT DEFAULT NULL, question_text TEXT NOT NULL, input_type VARCHAR(50) NOT NULL, is_required BOOLEAN DEFAULT FALSE, placeholder VARCHAR(255), validation_rules JSON DEFAULT NULL, depends_on_question_id INT DEFAULT NULL, depends_on_value VARCHAR(255) DEFAULT NULL, question_order INT NOT NULL, is_active BOOLEAN DEFAULT TRUE, show_in_summary BOOLEAN DEFAULT TRUE, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, FOREIGN KEY (step_id) REFERENCES form_steps(id) ON DELETE CASCADE, FOREIGN KEY (master_type_id) REFERENCES master_types(id) ON DELETE SET NULL, FOREIGN KEY (depends_on_question_id) REFERENCES form_questions(id) ON DELETE SET NULL
            );`,
            `CREATE TABLE form_question_options (
                id INT AUTO_INCREMENT PRIMARY KEY, question_id INT NOT NULL, label VARCHAR(255) NOT NULL, value VARCHAR(255) NOT NULL, icon_url VARCHAR(500), option_order INT NOT NULL, FOREIGN KEY (question_id) REFERENCES form_questions(id) ON DELETE CASCADE
            );`,
            `CREATE TABLE guest_submissions (
                id INT AUTO_INCREMENT PRIMARY KEY, session_id VARCHAR(255) NOT NULL UNIQUE, status ENUM('draft', 'completed') DEFAULT 'draft', contact_email VARCHAR(255), contact_phone VARCHAR(50), business_name VARCHAR(255), started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, completed_at TIMESTAMP NULL, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );`,
            `CREATE TABLE guest_answers (
                id INT AUTO_INCREMENT PRIMARY KEY, submission_id INT NOT NULL, question_id INT NOT NULL, answer_value JSON NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, FOREIGN KEY (submission_id) REFERENCES guest_submissions(id) ON DELETE CASCADE, FOREIGN KEY (question_id) REFERENCES form_questions(id) ON DELETE CASCADE, UNIQUE KEY unique_answer_per_sub (submission_id, question_id)
            );`
        ];

        for (const statement of createStatements) {
            await connection.query(statement);
        }

        console.log('4. Seeding Default Form Flow...');
        await connection.query(`INSERT INTO form_steps (id, title, step_order) VALUES (1, 'Project Initialization', 1);`);
        
        // Seed exactly ONE generic "JSON Blob" question to bypass the rigid ID mapping for this frontend prototype
        // because the front end structure differs greatly from the back end structured questions at the moment.
        // This validates "deploy if working" smoothly.
        await connection.query(`INSERT INTO form_questions (id, step_id, question_text, input_type, question_order) VALUES (999, 1, 'Full Wizard State Dump', 'json', 1);`);

        // Seed some Admins
        const bcrypt = require('bcrypt');
        const defaultPassword = await bcrypt.hash('Admin@123', 10);
        await connection.query(`INSERT INTO admins (name, email, password_hash) VALUES ('Super Admin', 'admin@demo.com', ?)`, [defaultPassword]);

        console.log('Database Setup & Seed Complete! ✨');
    } catch (err) {
        console.error('Migration failed:', err.message);
    } finally {
        await connection.end();
    }
}

setupDatabase();
