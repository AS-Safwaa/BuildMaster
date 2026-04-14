const pool = require('../../config/db');
const { v4: uuidv4 } = require('uuid');

// ---- Guest API (Public) ----

exports.getFormDefinition = async (req, res) => {
    try {
        // Fetch all active steps
        const [steps] = await pool.query('SELECT * FROM form_steps WHERE is_active = true ORDER BY step_order ASC');
        
        // Fetch all active questions
        const [questions] = await pool.query('SELECT * FROM form_questions WHERE is_active = true ORDER BY question_order ASC');

        // Fetch all static options
        const [options] = await pool.query('SELECT * FROM form_question_options ORDER BY option_order ASC');
        
        // Fetch necessary master data (only those tied to active questions)
        const [masterValues] = await pool.query(`
            SELECT mv.* FROM master_values mv
            JOIN master_types mt ON mt.id = mv.master_type_id
            WHERE mv.is_active = true
            ORDER BY mv.list_order ASC, mv.label ASC
        `);

        res.status(200).json({
            steps,
            questions,
            questionOptions: options,
            masterValues
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving form definition' });
    }
};

exports.startSubmission = async (req, res) => {
    try {
        const session_id = uuidv4();
        
        const [result] = await pool.query(
            'INSERT INTO guest_submissions (session_id, status) VALUES (?, ?)',
            [session_id, 'draft']
        );

        res.status(201).json({ 
            submission_id: result.insertId,
            session_id 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error initializing submission' });
    }
};

exports.saveAnswers = async (req, res) => {
    try {
        const { session_id } = req.params;
        const { answers } = req.body; // Expects array of { question_id, answer_value }

        if (!Array.isArray(answers)) {
            return res.status(400).json({ message: 'Answers must be an array' });
        }

        // Get submission ID
        const [subs] = await pool.query('SELECT id FROM guest_submissions WHERE session_id = ?', [session_id]);
        if (subs.length === 0) return res.status(404).json({ message: 'Submission not found' });
        
        const submission_id = subs[0].id;

        // Upsert answers
        for (const ans of answers) {
            const val = JSON.stringify(ans.answer_value);
            
            await pool.query(
                `INSERT INTO guest_answers (submission_id, question_id, answer_value) 
                 VALUES (?, ?, ?) 
                 ON DUPLICATE KEY UPDATE answer_value = ?`,
                [submission_id, ans.question_id, val, val]
            );
        }

        res.status(200).json({ message: 'Answers saved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error saving answers' });
    }
};

// Helper: Harvest JSON dump into relational tables for Admin/Dev viewing
const harvestDataToRelationalTables = async (submissionId, answers) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Project Selections (Products, USPs)
        if (Array.isArray(answers.products)) {
            for (const p of answers.products) {
                const isHighImpact = answers.highImpactProducts?.includes(p) || false;
                await connection.query(
                    'INSERT INTO project_selections (submission_id, selection_type, value, is_high_impact) VALUES (?, ?, ?, ?)',
                    [submissionId, 'product', p, isHighImpact]
                );
            }
        }
        if (Array.isArray(answers.usps)) {
            for (const u of answers.usps) {
                await connection.query(
                    'INSERT INTO project_selections (submission_id, selection_type, value) VALUES (?, ?, ?)',
                    [submissionId, 'usp', u]
                );
            }
        }

        // 2. Benchmarks
        const benchmarks = [
            { type: 'preferred', url: answers.preferredWebsite },
            { type: 'competitor', url: answers.competitorWebsite },
            { type: 'inspired', url: answers.inspiredWebsite }
        ].filter(b => b.url);
        for (const b of benchmarks) {
            await connection.query('INSERT INTO project_benchmarks (submission_id, type, url) VALUES (?, ?, ?)', [submissionId, b.type, b.url]);
        }

        // 3. Team Members
        if (Array.isArray(answers.teamMembersData)) {
            for (const m of answers.teamMembersData) {
                await connection.query('INSERT INTO project_team_members (submission_id, name, role) VALUES (?, ?, ?)', [submissionId, m.name, m.role]);
            }
        }

        // 4. Social Accounts
        if (Array.isArray(answers.socialAccounts)) {
            for (const s of answers.socialAccounts) {
                if (s.url) await connection.query('INSERT INTO project_social_links (submission_id, platform, url) VALUES (?, ?, ?)', [submissionId, s.platform, s.url]);
            }
        }

        // 5. Reviews
        if (answers.includeReviews) {
            await connection.query(
                'INSERT INTO project_reviews (submission_id, count, source, top_testimonial) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE count=?',
                [submissionId, answers.reviewsCount, answers.reviewsSource, answers.testimonials?.[0], answers.reviewsCount]
            );
        }

        // 6. Generate Developer Checklist
        const checklists = [
            { label: 'Review Brand Personality', category: 'Identity' },
            { label: 'Technical Setup (Domain/Hosting)', category: 'Technical' },
            { label: 'Check Reference Benchmarks', category: 'Technical' },
            { label: 'Ingest Team Media', category: 'Content' }
        ];
        for (const c of checklists) {
            await connection.query('INSERT INTO developer_checklists (submission_id, label, category) VALUES (?, ?, ?)', [submissionId, c.label, c.category]);
        }

        await connection.commit();
    } catch (error) {
        await connection.rollback();
        console.error('Data Harvesting Failed:', error);
    } finally {
        connection.release();
    }
};

exports.getHierarchy = async (req, res) => {
    try {
        const [categories] = await pool.query("SELECT id, value as name FROM master_values WHERE master_type_id = (SELECT id FROM master_types WHERE name = 'BusinessCategory')");
        const [subs] = await pool.query("SELECT id, parent_id, value as name FROM master_values WHERE master_type_id = (SELECT id FROM master_types WHERE name = 'BusinessSubCategory')");
        const [offerings] = await pool.query("SELECT id, parent_id, value as name FROM master_values WHERE master_type_id = (SELECT id FROM master_types WHERE name = 'BusinessOffering')");
        const [usps] = await pool.query("SELECT id, parent_id, value as name FROM master_values WHERE master_type_id = (SELECT id FROM master_types WHERE name = 'BusinessUSP')");

        res.status(200).json({ categories, subs, offerings, usps });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching hierarchy' });
    }
};

exports.completeSubmission = async (req, res) => {
    try {
        const { session_id } = req.params;
        const { contact_email, contact_phone, business_name } = req.body;

        // Fetch the data dump from answers (question 999)
        const [subs] = await pool.query('SELECT id FROM guest_submissions WHERE session_id = ?', [session_id]);
        if (subs.length === 0) return res.status(404).json({ message: 'Submission not found' });
        const subId = subs[0].id;

        const [ans] = await pool.query('SELECT answer_value FROM guest_answers WHERE submission_id = ? AND question_id = 999', [subId]);
        const wizardState = ans[0]?.answer_value || {};

        await pool.query(
            `UPDATE guest_submissions 
            SET status = 'unassigned', completed_at = CURRENT_TIMESTAMP, 
                contact_email = ?, contact_phone = ?, business_name = ?
            WHERE session_id = ?`,
            [contact_email || wizardState.email, contact_phone || wizardState.phone, business_name || wizardState.businessName, session_id]
        );

        // Run harvester in background (or await if you want accuracy over speed)
        await harvestDataToRelationalTables(subId, wizardState);

        res.status(200).json({ message: 'Submission fully integrated and finalized' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error completing submission' });
    }
};
