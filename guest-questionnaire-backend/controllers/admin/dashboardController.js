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
        // Since Developer is mocked and only Admins exist in DB right now, 
        // we'll fetch the unique admins and provide hardcoded expected mock values for the rest as per MVP reqs
        const [adminsResult] = await db.execute('SELECT COUNT(*) as total FROM admins');
        const totalAdmins = adminsResult[0].total;
        
        // 5. Recent Submissions 
        const [recentProjects] = await db.execute(`
            SELECT id, email, created_at, answers
            FROM guest_submissions 
            ORDER BY created_at DESC 
            LIMIT 5
        `);

        // Format recent projects safely to extract business name from the JSON blob
        const formattedProjects = recentProjects.map(p => {
            const parsedAnswers = typeof p.answers === 'string' ? JSON.parse(p.answers) : p.answers;
            return {
                id: p.id,
                email: p.email,
                businessName: parsedAnswers?.businessName || 'Unknown Business',
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
                    developers: 1, // Mock metric representing developer role profile
                    guests: totalProjects // Assuming 1 guest = 1 project
                }
            },
            recentProjects: formattedProjects
        });

    } catch (err) {
        console.error('Error fetching dashboard overview:', err);
        res.status(500).json({ message: 'Server error while aggregating metrics.' });
    }
};
