const authService = require('../services/authService');

class AuthController {
    async signup(req, res) {
        try {
            const { firstName, lastName, email, phone, password } = req.body;
            
            // Validate required fields
            if (!firstName || !lastName || !email || !password) {
                return res.status(400).json({ status: 'error', message: 'Required fields are missing' });
            }

            const newUser = await authService.registerUser({ 
                firstName, 
                lastName, 
                email, 
                phone, 
                password 
            });

            return res.status(201).json({
                status: 'success',
                message: 'User registered successfully',
                user: newUser
            });
        } catch (error) {
            return res.status(400).json({ status: 'error', message: error.message });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ status: 'error', message: 'Email and password are required' });
            }

            const user = await authService.loginUser({ email, password });
            return res.status(200).json({
                status: 'success',
                message: 'Login successful',
                user
            });
        } catch (error) {
            return res.status(400).json({ status: 'error', message: error.message });
        }
    }
}

module.exports = new AuthController();