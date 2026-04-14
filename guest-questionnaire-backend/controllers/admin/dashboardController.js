const db = require('../../config/db');

exports.getOverviewMetrics = async (req, res) => {
    try {
        // 1. Total Guest Submissions (Projects)
        const [projectsResult] = await db.execute('SELECT COUNT(*) as total FROM guest_submissions');
        const totalProjects = projectsResult[0].total;

        // 2. Total Form Questions
        const [questionsResult] = await db.execute('SELECT COUNT(*) as total FROM form_questions');
        const totalQuestions = questionsResult[0].total;

        // 3. Total Master Categories
        const [categoriesResult] = await db.execute('SELECT COUNT(*) as total FROM master_types');
        const totalCategories = categoriesResult[0].total;

        // 4. Role Overview (Admins & Developers)
        const [adminsResult] = await db.execute('SELECT COUNT(*) as total FROM users WHERE role = "admin"');
        const totalAdmins = adminsResult[0].total;
        
        const [devsResult] = await db.execute('SELECT COUNT(*) as total FROM users WHERE role = "developer"');
        const totalDevs = devsResult[0].total;
        
        // 5. Recent Submissions 
        const [recentProjects] = await db.execute(`
            SELECT id, contact_email AS email, started_at AS created_at, business_name
            FROM guest_submissions 
            ORDER BY started_at DESC 
            LIMIT 5
        `);

        // Format recent projects
        const formattedProjects = recentProjects.map(p => {
            return {
                id: p.id,
                email: p.email || 'No email',
                businessName: p.business_name || 'Incomplete Draft',
                createdAt: p.created_at
            };
        });

        res.json({
            kpis: {
                totalProjects,
                totalQuestions,
                totalCategories,
                roles: {
                    admins: totalAdmins,
                    developers: totalDevs,
                    guests: totalProjects
                }
            },
            recentProjects: formattedProjects
        });

    } catch (err) {
        console.error('Error fetching dashboard overview:', err);
        res.status(500).json({ message: 'Server error while aggregating metrics.' });
    }
};

exports.getDevelopers = async (req, res) => {
    try {
        const [devs] = await db.execute('SELECT id, name, email FROM users WHERE role = "developer"');
        res.status(200).json(devs);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching developers' });
    }
};

exports.assignProject = async (req, res) => {
    try {
        const { project_id, developer_id } = req.body;
        const status = developer_id ? 'assigned' : 'unassigned';
        await db.execute('UPDATE guest_submissions SET assigned_developer_id = ?, status = ? WHERE id = ?', [developer_id || null, status, project_id]);
        res.status(200).json({ message: 'Project assignment updated successfully.' });
    } catch (err) {
        console.error('Assign Error:', err);
        res.status(500).json({ message: 'Error assigning project' });
    }
};

exports.getAllProjects = async (req, res) => {
    try {
        const [projects] = await db.execute(`
            SELECT gs.id, gs.contact_email as email, gs.business_name as businessName, gs.status, gs.started_at as createdAt, u.name as developerName, gs.assigned_developer_id
            FROM guest_submissions gs
            LEFT JOIN users u ON gs.assigned_developer_id = u.id
            ORDER BY gs.started_at DESC
        `);
        res.status(200).json(projects);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching projects' });
    }
};

exports.getProjectDetails = async (req, res) => {
    try {
        const { id } = req.params;
        
        // 1. Core Submission Info
        const [core] = await db.execute('SELECT * FROM guest_submissions WHERE id = ?', [id]);
        if (core.length === 0) return res.status(404).json({ message: 'Project not found' });
        
        // 2. Specialized relational details
        const [selections] = await db.execute('SELECT * FROM project_selections WHERE submission_id = ?', [id]);
        const [benchmarks] = await db.execute('SELECT * FROM project_benchmarks WHERE submission_id = ?', [id]);
        const [socials] = await db.execute('SELECT * FROM project_social_links WHERE submission_id = ?', [id]);
        const [checklist] = await db.execute('SELECT * FROM developer_checklists WHERE submission_id = ?', [id]);
        const [team] = await db.execute('SELECT * FROM project_team_members WHERE submission_id = ?', [id]);
        const [reviews] = await db.execute('SELECT * FROM project_reviews WHERE submission_id = ?', [id]);

        // 3. Raw Wizard State (for fallback/manual debugging)
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
