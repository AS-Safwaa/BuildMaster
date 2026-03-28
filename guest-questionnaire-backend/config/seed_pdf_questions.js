const mysql = require('mysql2/promise');
require('dotenv').config();

async function seed16Questions() {
    console.log('Connecting to MySQL Server to execute 16-Step PDF Seed...');
    
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || '127.0.0.1',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || '',
        database: process.env.DB_NAME || 'guest_questionnaire_db',
        port: process.env.DB_PORT || 3306,
    });

    try {
        await connection.query(`SET FOREIGN_KEY_CHECKS = 0;`);
        await connection.query(`TRUNCATE TABLE form_question_options;`);
        await connection.query(`TRUNCATE TABLE form_questions;`);
        await connection.query(`TRUNCATE TABLE form_steps;`);
        await connection.query(`TRUNCATE TABLE master_values;`);
        await connection.query(`TRUNCATE TABLE master_types;`);
        await connection.query(`SET FOREIGN_KEY_CHECKS = 1;`);

        console.log('1. Seeding Master Types for Categories...');
        await connection.query(`INSERT INTO master_types (id, name, description) VALUES 
            (1, 'BusinessCategory', 'Main business categories'),
            (2, 'SubCategory', 'Sub-categories'),
            (3, 'Specialisation', 'Specialisations'),
            (4, 'Services', 'Suggested services based on specialization'),
            (5, 'USP', 'Unique Selling Points'),
            (6, 'WebsiteGoals', 'Goals for the website'),
            (7, 'CTA', 'Call to Action choices'),
            (8, 'Tone', 'Brand Tone preferences'),
            (9, 'Focus', 'Brand Focus'),
            (10, 'TaglineStyle', 'Tagline style'),
            (11, 'BrandPersonality', 'Logo personality traits'),
            (12, 'LogoStyle', 'Logo format preference'),
            (13, 'LogoDesignDirection', 'Logo aesthetic direction'),
            (14, 'LogoUsage', 'Where will logo be used'),
            (15, 'WebsiteStyle', 'Overall theme vibe');
        `);

        // Seed some basic Master Values for Category just so dropdowns aren't empty
        await connection.query(`INSERT INTO master_values (master_type_id, value, label) VALUES 
            (1, 'Healthcare', 'Healthcare & Medical'),
            (1, 'Tech', 'Technology & Software'),
            (2, 'Clinic', 'Local Clinic'),
            (8, 'Professional', 'Professional'),
            (8, 'Friendly', 'Friendly & Welcoming'),
            (9, 'Trust', 'Trust & Reliability'),
            (10, 'Short', 'Short & Punchy'),
            (15, 'Dark', 'Dark & Premium'),
            (15, 'Light', 'Light & Minimal');
        `);

        console.log('2. Seeding Form Steps (1 to 16)...');
        const steps = [
            [1, 'BUSINESS ESSENTIALS', '', 1],
            [2, 'DOMAIN, HOSTING & CONTACT SETUP', '', 2],
            [3, 'BUSINESS CATEGORY', '', 3],
            [4, 'SERVICES / PRODUCTS', '', 4],
            [5, 'UNIQUE SELLING POINTS (USP)', '', 5],
            [6, 'WEBSITE GOALS', '', 6],
            [7, 'CALL TO ACTION (CTA)', '', 7],
            [8, 'TAGLINE', '', 8],
            [9, 'LOGO SECTION', '', 9],
            [10, 'WEBSITE STYLE', '', 10],
            [11, 'IMAGES', '', 11],
            [12, 'TEAM SECTION', '', 12],
            [13, 'TESTIMONIALS', '', 13],
            [14, 'SOCIAL MEDIA', '', 14],
            [15, 'COMPETITOR / INSPIRATION', '', 15],
            [16, 'ADDITIONAL NOTES', '', 16]
        ];
        
        for (const s of steps) {
            await connection.query(`INSERT INTO form_steps (id, title, description, step_order) VALUES (?, ?, ?, ?)`, s);
        }

        console.log('3. Seeding Exact Questions...');
        // Format: [id, step_id, master_type_id, text, type, required, placeholder, depends_q, depends_v, order]
        const questions = [
            // STEP 1
            [1, 1, null, 'Business Name', 'text', true, 'Example: HeartCare Advanced Clinic', null, null, 1],
            [2, 1, null, 'Years of Establishment', 'yearpicker', false, 'YYYY', null, null, 2],
            [3, 1, null, 'Contact Person Name', 'text', true, 'John Doe', null, null, 3],
            [4, 1, null, 'Contact Phone Number', 'phone', true, '+1 555-0000', null, null, 4],
            [5, 1, null, 'Email Address', 'email', true, 'info@heartcareclinic.com', null, null, 5],
            [6, 1, null, 'Business Address (Line 1, City, State, PIN, Country)', 'textarea', true, 'Full detailed address helps local SEO', null, null, 6],
            [7, 1, null, 'Service Areas', 'text', false, 'Example: Chennai & Nearby Areas', null, null, 7],

            // STEP 2 (1A)
            [8, 2, null, 'Do you already have a domain (website name)?', 'radio', true, '', null, null, 1],
            [9, 2, null, 'Enter your domain name', 'text', false, 'www.heartcareclinic.com', 8, 'Yes', 2],
            [10, 2, null, 'Preferred domain name (optional)', 'text', false, 'heartcareclinic.in', 8, 'No', 3],
            [11, 2, null, 'Do you already have hosting for your website?', 'radio', true, '', null, null, 4],
            [12, 2, null, 'Hosting provider name', 'text', false, 'GoDaddy / Hostinger', 11, 'Yes', 5],
            [13, 2, null, 'Do you want a Contact Us form on your website?', 'radio', true, '', null, null, 6],
            
            // STEP 3 Category
            [14, 3, 1, 'Select Main Category', 'dropdown', true, 'Select from options...', null, null, 1],
            [15, 3, 2, 'Select Sub Category', 'dropdown', true, 'Select sub-category...', null, null, 2],
            [16, 3, 3, 'Select Specialisation', 'dropdown', true, 'Select specialisation...', null, null, 3],

            // STEP 4 Services
            [17, 4, 4, 'Select Your Services / Products', 'multiselect', true, 'Custom entry allowed', null, null, 1],

            // STEP 5 USP
            [18, 5, 5, 'What makes your business special? (USP)', 'multiselect', true, 'Custom entry allowed', null, null, 1],

            // STEP 6 GOALS
            [19, 6, 6, 'What do you want your website to achieve?', 'multiselect', true, 'Choose goals', null, null, 1],

            // STEP 7 CTA
            [20, 7, 7, 'What action should users take on your website?', 'multiselect', true, 'Select CTAs', null, null, 1],

            // STEP 8 TAGLINE
            [21, 8, null, 'Do you already have a tagline?', 'radio', true, '', null, null, 1],
            [22, 8, null, 'Enter your tagline', 'text', false, 'Healthy Hearts, Happy Lives', 21, 'Yes', 2],
            [23, 8, 5, 'What makes your business different from competitors?', 'multiselect', false, '', 21, 'No', 3],
            [24, 8, 8, 'Which tone do you prefer?', 'multiselect', false, '', 21, 'No', 4],
            [25, 8, 9, 'What should your tagline focus on?', 'dropdown', false, '', 21, 'No', 5],
            [26, 8, 10, 'Preferred tagline style', 'dropdown', false, '', 21, 'No', 6],

            // STEP 9 LOGO
            [27, 9, null, 'Do you have an existing logo?', 'radio', true, '', null, null, 1],
            [28, 9, null, 'Upload Logo (Google Drive Link)', 'text', false, 'Drive link', 27, 'Yes_AsIs', 2],
            [29, 9, null, 'Upload Current Logo (Google Drive Link)', 'text', false, 'Drive link', 27, 'Yes_Improve', 3],
            [30, 9, null, 'What would you like to improve?', 'multiselect', false, 'Select options', 27, 'Yes_Improve', 4],
            [31, 9, null, 'What do you like in your current logo?', 'textarea', false, 'I like the colors...', 27, 'Yes_Improve', 5],
            [32, 9, 11, 'Brand Personality', 'multiselect', false, '', 27, 'No', 6],
            [33, 9, 12, 'Logo Style Preference', 'dropdown', false, '', 27, 'No', 7],

            // STEP 10 WEBSITE STYLE
            [34, 10, 15, 'Select preferred website style', 'dropdown', true, 'Dark/Light/Minimal', null, null, 1],

            // STEP 11 IMAGES
            [35, 11, null, 'Do you want business photos on website?', 'radio', true, '', null, null, 1],
            [36, 11, null, 'Upload Business Photos', 'text', false, 'Drive link', 35, 'Yes', 2],

            // STEP 12 TEAM
            [37, 12, null, 'Do you want to show team members?', 'radio', true, '', null, null, 1],
            [38, 12, null, 'Team Member Details (Name, Role, Bio, LinkedIn)', 'textarea', false, 'Team info here...', 37, 'Yes', 2],

            // STEP 13 TESTIMONIALS
            [39, 13, null, 'Do you want to display customer testimonials?', 'radio', true, '', null, null, 1],
            [40, 13, null, 'Testimonial Details (Name, Role, Text, Rating)', 'textarea', false, 'Testimonial contents...', 39, 'Existing', 2],

            // STEP 14 SOCIAL
            [41, 14, null, 'Do you want to show social media links?', 'radio', true, '', null, null, 1],
            [42, 14, null, 'Social Links (FB, IG, LinkedIn, etc)', 'textarea', false, 'Paste links here...', 41, 'Yes', 2],

            // STEP 15 COMPETITORS
            [43, 15, null, 'Competitor websites', 'textarea', false, 'URLs...', null, null, 1],
            [44, 15, null, 'Inspiration websites', 'textarea', false, 'URLs...', null, null, 2],

            // STEP 16 NOTES
            [45, 16, null, 'Anything else youd like to add?', 'textarea', false, 'Additional info...', null, null, 1]
        ];

        for (const q of questions) {
            await connection.query(
                `INSERT INTO form_questions (id, step_id, master_type_id, question_text, input_type, is_required, placeholder, depends_on_question_id, depends_on_value, question_order) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, q
            );
        }

        console.log('4. Seeding Radio Options for logic...');
        const options = [
            // Domain
            [1, 8, 'Yes', 'Yes', 1], [2, 8, 'No, I need help', 'No', 2],
            // Hosting
            [3, 11, 'Yes', 'Yes', 1], [4, 11, 'No', 'No', 2], [5, 11, 'Not sure', 'Not sure', 3],
            // Tagline
            [6, 21, 'Yes', 'Yes', 1], [7, 21, 'No, help me create one', 'No', 2],
            // Logo
            [8, 27, 'Yes, I want to use it as-is', 'Yes_AsIs', 1],
            [9, 27, 'Yes, but I want to improve/redesign it', 'Yes_Improve', 2],
            [10, 27, 'No, I don\'t have a logo', 'No', 3],
            // Logo Improve Checks
            [11, 30, 'Make it more modern', 'Modern', 1],
            [12, 30, 'Improve readability', 'Readable', 2],
            [13, 30, 'Better colors', 'Colors', 3],
            // Images
            [14, 35, 'Yes', 'Yes', 1], [15, 35, 'No', 'No', 2],
            // Team
            [16, 37, 'Yes', 'Yes', 1], [17, 37, 'No', 'No', 2],
            // Testimonials
            [18, 39, 'Not required', 'No', 1], [19, 39, 'I have testimonials', 'Existing', 2], [20, 39, 'Generate generic', 'Generic', 3],
            // Social
            [21, 41, 'Yes', 'Yes', 1], [22, 41, 'No', 'No', 2]
        ];

        for (const opt of options) {
            await connection.query(`INSERT INTO form_question_options (id, question_id, label, value, option_order) VALUES (?, ?, ?, ?, ?)`, opt);
        }

        // Keep question 999 for the backwards-compatible JSON dump React prototype integration
        await connection.query(`INSERT INTO form_questions (id, step_id, question_text, input_type, question_order) VALUES (999, 16, 'System State Dump', 'json', 99);`);

        console.log('Seed Complete! 🚀 16 Sections exactly matching the PDF injected.');
    } catch (err) {
        console.error('Migration failed:', err.message);
    } finally {
        await connection.end();
    }
}

seed16Questions();
