const pool = require('../../config/db');

// ---- Master Types ----

exports.getAllMasterTypes = async (req, res) => {
    try {
        const [types] = await pool.query('SELECT * FROM master_types ORDER BY name ASC');
        res.status(200).json(types);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving master types' });
    }
};

exports.createMasterType = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name) return res.status(400).json({ message: 'Name is required' });

        const [result] = await pool.query(
            'INSERT INTO master_types (name, description) VALUES (?, ?)',
            [name, description || null]
        );
        res.status(201).json({ id: result.insertId, name, description });
    } catch (error) {
        console.error(error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Master type with this name already exists' });
        }
        res.status(500).json({ message: 'Error creating master type' });
    }
};

// ---- Master Values ----

exports.getMasterValues = async (req, res) => {
    try {
        const { type_id, parent_id } = req.query;
        let query = 'SELECT * FROM master_values WHERE 1=1';
        const params = [];

        if (type_id) {
            query += ' AND master_type_id = ?';
            params.push(type_id);
        }
        if (parent_id) {
            query += ' AND parent_id = ?';
            params.push(parent_id);
        }

        query += ' ORDER BY list_order ASC, label ASC';

        const [values] = await pool.query(query, params);
        res.status(200).json(values);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving master values' });
    }
};

exports.createMasterValue = async (req, res) => {
    try {
        const { master_type_id, parent_id, value, label, image_url, is_active, list_order } = req.body;
        
        if (!master_type_id || !value || !label) {
            return res.status(400).json({ message: 'master_type_id, value, and label are required' });
        }

        const [result] = await pool.query(
            `INSERT INTO master_values 
            (master_type_id, parent_id, value, label, image_url, is_active, list_order) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                master_type_id, 
                parent_id || null, 
                value, 
                label, 
                image_url || null, 
                is_active !== undefined ? is_active : true,
                list_order || 0
            ]
        );

        res.status(201).json({ id: result.insertId, master_type_id, value, label });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating master value' });
    }
};

exports.updateMasterValue = async (req, res) => {
    try {
        const { id } = req.params;
        const { parent_id, value, label, image_url, is_active, list_order } = req.body;
        
        await pool.query(
            `UPDATE master_values 
            SET parent_id = ?, value = ?, label = ?, image_url = ?, is_active = ?, list_order = ?
            WHERE id = ?`,
            [
                parent_id || null, 
                value, 
                label, 
                image_url || null, 
                is_active !== undefined ? is_active : true,
                list_order || 0,
                id
            ]
        );
        
        res.status(200).json({ message: 'Updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating master value' });
    }
};

exports.deleteMasterValue = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM master_values WHERE id = ?', [id]);
        res.status(200).json({ message: 'Deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting master value' });
    }
};
