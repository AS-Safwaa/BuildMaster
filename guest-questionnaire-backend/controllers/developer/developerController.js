const db = require('../../config/db');

exports.getOverviewMetrics = async (req, res) => {
    try {
        const developerId = req.user.id;
        const [poolResult] = await db.execute('SELECT COUNT(*) as total FROM guest_submissions WHERE assigned_developer_id IS NULL AND status IN ("completed", "unassigned")');
        const [myResult] = await db.execute('SELECT COUNT(*) as total FROM guest_submissions WHERE assigned_developer_id = ?', [developerId]);
        const [compResult] = await db.execute('SELECT COUNT(*) as total FROM guest_submissions WHERE assigned_developer_id = ? AND status = "completed"', [developerId]);

        res.status(200).json({
            poolSize: poolResult[0].total,
            myProjects: myResult[0].total,
            completedProjects: compResult[0].total
        });
    } catch (err) {
        console.error('Metrics Error:', err);
        res.status(500).json({ message: 'Error fetching dev metrics' });
    }
};

exports.getPoolProjects = async (req, res) => {
    try {
        const [projects] = await db.execute(`
            SELECT id, business_name as businessName, started_at as createdAt, status, contact_phone as phone
            FROM guest_submissions 
            WHERE assigned_developer_id IS NULL AND status IN ("completed", "unassigned")
            ORDER BY started_at ASC
        `);
        res.status(200).json(projects);
    } catch (err) { 
        console.error('Pool Fetch Error:', err);
        res.status(500).json({ message: 'Error fetching pool projects' }); 
    }
};

exports.getMyProjects = async (req, res) => {
    try {
        const developerId = req.user.id;
        const [projects] = await db.execute(`
            SELECT id, business_name as businessName, started_at as createdAt, status, contact_phone as phone
            FROM guest_submissions 
            WHERE assigned_developer_id = ? 
            ORDER BY started_at DESC
        `, [developerId]);
        res.status(200).json(projects);
    } catch (err) { 
        console.error('MyProjects Fetch Error:', err);
        res.status(500).json({ message: 'Error fetching my projects' }); 
    }
};

exports.getProjectDetails = async (req, res) => {
    try {
        const { id } = req.params;
        
        // 1. Core Info
        const [core] = await db.execute('SELECT * FROM guest_submissions WHERE id = ?', [id]);
        if (core.length === 0) return res.status(404).json({ message: 'Project not found' });
        
        // 2. Specialized relational details
        const [selections] = await db.execute('SELECT * FROM project_selections WHERE submission_id = ?', [id]);
        const [benchmarks] = await db.execute('SELECT * FROM project_benchmarks WHERE submission_id = ?', [id]);
        const [socials] = await db.execute('SELECT * FROM project_social_links WHERE submission_id = ?', [id]);
        const [checklist] = await db.execute('SELECT * FROM developer_checklists WHERE submission_id = ?', [id]);
        const [team] = await db.execute('SELECT * FROM project_team_members WHERE submission_id = ?', [id]);
        const [reviews] = await db.execute('SELECT * FROM project_reviews WHERE submission_id = ?', [id]);

        // 3. Raw Wizard State (for fallback)
        const [answers] = await db.execute('SELECT answer_value FROM guest_answers WHERE submission_id = ? AND question_id = 999', [id]);

        res.status(200).json({
            ...core[0],
            details: {
                selections,
                benchmarks,
                socials,
                checklist,
                team,
                reviews: reviews[0] || null,
                wizardState: answers[0]?.answer_value || {}
            }
        });
    } catch (error) {
        console.error('ProjectDetails Error:', error);
        res.status(500).json({ message: 'Error fetching project details' });
    }
};

exports.claimProject = async (req, res) => {
    try {
        const { id } = req.params;
        const developerId = req.user.id;
        await db.execute('UPDATE guest_submissions SET assigned_developer_id = ?, status = "assigned" WHERE id = ?', [developerId, id]);
        res.status(200).json({ message: 'Project claimed' });
    } catch (err) {
        res.status(500).json({ message: 'Error claiming project' });
    }
};

exports.unclaimProject = async (req, res) => {
    try {
        const { id } = req.params;
        const developerId = req.user.id;
        await db.execute('UPDATE guest_submissions SET assigned_developer_id = NULL, status = "unassigned" WHERE id = ? AND assigned_developer_id = ?', [id, developerId]);
        res.status(200).json({ message: 'Project released' });
    } catch (err) {
        res.status(500).json({ message: 'Error releasing project' });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const developerId = req.user.id;
        await db.execute('UPDATE guest_submissions SET status = ? WHERE id = ? AND assigned_developer_id = ?', [status, id, developerId]);
        res.status(200).json({ message: 'Status updated' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating status' });
    }
};

exports.toggleChecklistItem = async (req, res) => {
    try {
        const { id } = req.params; // submission_id
        const { checklist_id } = req.body;
        const developerId = req.user.id;

        // Verify ownership
        const [sub] = await db.execute('SELECT id FROM guest_submissions WHERE id = ? AND assigned_developer_id = ?', [id, developerId]);
        if (sub.length === 0) return res.status(403).json({ message: 'Forbidden' });

        await db.execute('UPDATE developer_checklists SET is_completed = NOT is_completed WHERE id = ? AND submission_id = ?', [checklist_id, id]);
        res.status(200).json({ message: 'Toggled' });
    } catch (err) {
        res.status(500).json({ message: 'Error toggling' });
    }
};

exports.toggleSelectionItem = async (req, res) => {
    try {
        const { id } = req.params; // submission_id
        const { selection_id } = req.body;
        const developerId = req.user.id;

        const [sub] = await db.execute('SELECT id FROM guest_submissions WHERE id = ? AND assigned_developer_id = ?', [id, developerId]);
        if (sub.length === 0) return res.status(403).json({ message: 'Forbidden' });

        await db.execute('UPDATE project_selections SET is_completed = NOT is_completed WHERE id = ? AND submission_id = ?', [selection_id, id]);
        res.status(200).json({ message: 'Toggled Selection' });
    } catch (err) {
        res.status(500).json({ message: 'Error toggling selection' });
    }
};
