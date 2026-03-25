const pool = require('../../config/db');

// ---- Form Steps ----

exports.getFormSteps = async (req, res) => {
    try {
        const [steps] = await pool.query('SELECT * FROM form_steps ORDER BY step_order ASC');
        res.status(200).json(steps);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving form steps' });
    }
};

exports.createFormStep = async (req, res) => {
    try {
        const { title, description, step_order, is_active } = req.body;
        if (!title || step_order === undefined) {
            return res.status(400).json({ message: 'Title and step_order are required' });
        }

        const [result] = await pool.query(
            'INSERT INTO form_steps (title, description, step_order, is_active) VALUES (?, ?, ?, ?)',
            [title, description || null, step_order, is_active !== undefined ? is_active : true]
        );
        res.status(201).json({ id: result.insertId, title, step_order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating form step' });
    }
};

exports.updateFormStep = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, step_order, is_active } = req.body;

        await pool.query(
            'UPDATE form_steps SET title = ?, description = ?, step_order = ?, is_active = ? WHERE id = ?',
            [title, description || null, step_order, is_active !== undefined ? is_active : true, id]
        );
        res.status(200).json({ message: 'Form step updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating form step' });
    }
};

exports.deleteFormStep = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM form_steps WHERE id = ?', [id]);
        res.status(200).json({ message: 'Form step deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting form step' });
    }
};

// ---- Form Questions ----

exports.getFormQuestions = async (req, res) => {
    try {
        const { step_id } = req.query;
        let query = 'SELECT * FROM form_questions';
        const params = [];

        if (step_id) {
            query += ' WHERE step_id = ?';
            params.push(step_id);
        }
        
        query += ' ORDER BY question_order ASC';

        const [questions] = await pool.query(query, params);
        res.status(200).json(questions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving form questions' });
    }
};

exports.createFormQuestion = async (req, res) => {
    try {
        const {
            step_id, master_type_id, question_text, input_type, is_required,
            placeholder, validation_rules, depends_on_question_id, depends_on_value,
            question_order, is_active, show_in_summary
        } = req.body;

        if (!step_id || !question_text || !input_type || question_order === undefined) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const [result] = await pool.query(
            `INSERT INTO form_questions 
            (step_id, master_type_id, question_text, input_type, is_required, placeholder, validation_rules, depends_on_question_id, depends_on_value, question_order, is_active, show_in_summary) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                step_id, master_type_id || null, question_text, input_type,
                is_required || false, placeholder || null,
                validation_rules ? JSON.stringify(validation_rules) : null,
                depends_on_question_id || null, depends_on_value || null,
                question_order,
                is_active !== undefined ? is_active : true,
                show_in_summary !== undefined ? show_in_summary : true
            ]
        );

        res.status(201).json({ id: result.insertId, question_text });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating form question' });
    }
};

exports.updateFormQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            step_id, master_type_id, question_text, input_type, is_required, placeholder,
            validation_rules, depends_on_question_id, depends_on_value, question_order, is_active, show_in_summary
        } = req.body;

        await pool.query(
            `UPDATE form_questions SET 
                step_id = ?, master_type_id = ?, question_text = ?, input_type = ?, is_required = ?, 
                placeholder = ?, validation_rules = ?, depends_on_question_id = ?, depends_on_value = ?, 
                question_order = ?, is_active = ?, show_in_summary = ?
            WHERE id = ?`,
            [
                step_id, master_type_id || null, question_text, input_type,
                is_required || false, placeholder || null,
                validation_rules ? JSON.stringify(validation_rules) : null,
                depends_on_question_id || null, depends_on_value || null,
                question_order, is_active !== undefined ? is_active : true,
                show_in_summary !== undefined ? show_in_summary : true,
                id
            ]
        );

        res.status(200).json({ message: 'Question updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating question' });
    }
};

exports.deleteFormQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM form_questions WHERE id = ?', [id]);
        res.status(200).json({ message: 'Question deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting question' });
    }
};

// ---- Question Options (Static) ----

exports.createQuestionOption = async (req, res) => {
    try {
        const { question_id } = req.params;
        const { label, value, icon_url, option_order } = req.body;

        const [result] = await pool.query(
            'INSERT INTO form_question_options (question_id, label, value, icon_url, option_order) VALUES (?, ?, ?, ?, ?)',
            [question_id, label, value, icon_url || null, option_order || 0]
        );

        res.status(201).json({ id: result.insertId, label, value });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating question option' });
    }
};

exports.deleteQuestionOption = async (req, res) => {
    try {
        const { option_id } = req.params;
        await pool.query('DELETE FROM form_question_options WHERE id = ?', [option_id]);
        res.status(200).json({ message: 'Option deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting question option' });
    }
};
