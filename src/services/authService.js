const pool = require('../config/db');
const bcrypt = require('bcryptjs');

class AuthService {
    async registerUser({ firstName, lastName, email, phone, password }) {
        // Check if user exists
        const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            throw new Error('Email is already registered');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const fullName = `${firstName} ${lastName}`.trim();
        // Insert into database including first_name, last_name, phone
        const query = `
            INSERT INTO users (name, first_name, last_name, email, phone, password) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        await pool.query(query, [fullName, firstName, lastName, email, phone || null, hashedPassword]);

        return { email, firstName, lastName, name: fullName};
    }

    async loginUser({ email, password }) {
        const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            throw new Error('Invalid email or password');
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid email or password');
        }

        return { id: user.id, name: user.name, email: user.email };
    }
}

module.exports = new AuthService();