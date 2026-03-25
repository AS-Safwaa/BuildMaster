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

exports.completeSubmission = async (req, res) => {
    try {
        const { session_id } = req.params;
        const { contact_email, contact_phone, business_name } = req.body;

        await pool.query(
            `UPDATE guest_submissions 
            SET status = 'completed', completed_at = CURRENT_TIMESTAMP, 
                contact_email = ?, contact_phone = ?, business_name = ?
            WHERE session_id = ?`,
            [contact_email || null, contact_phone || null, business_name || null, session_id]
        );

        res.status(200).json({ message: 'Submission completed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error completing submission' });
    }
};

// Placeholder for Google Drive Upload functionality
exports.uploadFile = async (req, res) => {
    try {
        // Here you would use multer to get req.file, 
        // Then use googleapis to upload to Google Drive,
        // And return the generic WebViewLink
        res.status(501).json({ message: 'File upload not fully integrated yet' });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading file' });
    }
};
