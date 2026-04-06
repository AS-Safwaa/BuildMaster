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
            SELECT id, business_name as businessName, started_at as createdAt, status 
            FROM guest_submissions 
            WHERE assigned_developer_id IS NULL AND status IN ("completed", "unassigned")
            ORDER BY started_at ASC
        `);
        console.log(`Pool Fetch: Found ${projects.length} unassigned projects`);
        res.status(200).json(projects);
    } catch (err) { 
        console.error('Pool Fetch Error:', err);
        res.status(500).json({ message: 'Error fetching pool projects' }); 
    }
};

exports.getMyProjects = async (req, res) => {
    try {
        const developerId = req.user.id;
        console.log(`Fetching assignments for developer ID: ${developerId}`);
        const [projects] = await db.execute(`
            SELECT gs.id, gs.contact_email as email, gs.business_name as businessName, gs.started_at as createdAt, gs.status, ga.answer_value as answers 
            FROM guest_submissions gs
            LEFT JOIN guest_answers ga ON gs.id = ga.submission_id AND ga.question_id = 999
            WHERE gs.assigned_developer_id = ? 
            ORDER BY gs.started_at DESC
        `, [developerId]);

        console.log(`Assignments Fetch: Found ${projects.length} projects for dev ${developerId}`);
        res.status(200).json(projects);
    } catch (err) { 
        console.error('Assignments Fetch Error:', err);
        res.status(500).json({ message: 'Error fetching my projects' }); 
    }
};

exports.claimProject = async (req, res) => {
    try {
        const { id } = req.params;
        const developerId = req.user.id;

        await db.execute('UPDATE guest_submissions SET assigned_developer_id = ?, status = "assigned" WHERE id = ?', [developerId, id]);
        res.status(200).json({ message: 'Project claimed successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error claiming project' });
    }
};

exports.unclaimProject = async (req, res) => {
    try {
        const { id } = req.params;
        const developerId = req.user.id;

        // Ensure the developer actually owns the project before unclaiming
        const [rows] = await db.execute('SELECT id FROM guest_submissions WHERE id = ? AND assigned_developer_id = ?', [id, developerId]);
        
        if (rows.length === 0) {
            return res.status(403).json({ message: 'You can only unclaim your own projects' });
        }

        await db.execute('UPDATE guest_submissions SET assigned_developer_id = NULL, status = "completed" WHERE id = ?', [id]);
        res.status(200).json({ message: 'Project returned to pool' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error unclaiming project' });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const developerId = req.user.id;
        const { id } = req.params;
        const { status } = req.body;
        await db.execute('UPDATE guest_submissions SET status = ? WHERE id = ? AND assigned_developer_id = ?', [status, id, developerId]);
        res.status(200).json({ message: 'Status updated' });
    } catch (err) { res.status(500).json({ message: 'Error updating status' }); }
};
