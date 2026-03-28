const db = require('../../config/db');

exports.getOverviewMetrics = async (req, res) => {
    try {
        const developerId = req.user.id; // From authMiddleware

        const [poolResult] = await db.execute('SELECT COUNT(*) as total FROM guest_submissions WHERE status = "unassigned"');
        const [myResult] = await db.execute('SELECT COUNT(*) as total FROM guest_submissions WHERE assigned_developer_id = ?', [developerId]);
        const [compResult] = await db.execute('SELECT COUNT(*) as total FROM guest_submissions WHERE assigned_developer_id = ? AND status = "completed"', [developerId]);

        res.status(200).json({
            poolSize: poolResult[0].total,
            myProjects: myResult[0].total,
            completedProjects: compResult[0].total
        });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching dev metrics' });
    }
};

exports.getPoolProjects = async (req, res) => {
    try {
        const [projects] = await db.execute(`
            SELECT id, business_name as businessName, started_at as createdAt, status 
            FROM guest_submissions 
            WHERE status = "unassigned" AND assigned_developer_id IS NULL 
            ORDER BY started_at ASC
        `);
        res.status(200).json(projects);
    } catch (err) { res.status(500).json({ message: 'Error fetching pool projects' }); }
};

exports.getMyProjects = async (req, res) => {
    try {
        const developerId = req.user.id;
        const [projects] = await db.execute(`
            SELECT id, contact_email as email, business_name as businessName, started_at as createdAt, status, answers 
            FROM guest_submissions 
            WHERE assigned_developer_id = ? 
            ORDER BY started_at DESC
        `, [developerId]);
        // Safe parse
        const formatted = projects.map(p => ({
           id: p.id, email: p.email, businessName: p.businessName, createdAt: p.createdAt, status: p.status, answers: typeof p.answers === 'string' ? JSON.parse(p.answers) : p.answers
        }));
        res.status(200).json(formatted);
    } catch (err) { res.status(500).json({ message: 'Error fetching my projects' }); }
};

exports.claimProject = async (req, res) => {
    try {
        const developerId = req.user.id;
        const { id } = req.params;
        await db.execute('UPDATE guest_submissions SET assigned_developer_id = ?, status = "assigned" WHERE id = ? AND assigned_developer_id IS NULL', [developerId, id]);
        res.status(200).json({ message: 'Project Claimed Successfully' });
    } catch (err) { res.status(500).json({ message: 'Error claiming project' }); }
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
