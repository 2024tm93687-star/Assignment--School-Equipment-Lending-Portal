import fetch from 'node-fetch';
import logger from '../utils/logger.js';

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:8080';

const ROLE_ACCESS = {
    GET: ['admin', 'staff', 'student'],
    POST: ['admin'],
    PUT: ['admin'],
    DELETE: ['admin']
};

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || req.headers.Authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'Authorization header Missing' });
        }

        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return res.status(401).json({ error: 'Invalid Authorization header' });
        }

        const token = parts[1];
        
        const response = await fetch(`${AUTH_SERVICE_URL}/api/auth/validate`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const error = await response.json();
            return res.status(response.status).json({ error: error.message });
        }

        const userData = await response.json();

        req.user = userData;

        const method = req.method.toUpperCase();
        const allowedRoles = ROLE_ACCESS[method] || [];
        
        if (!userData.role) {
            return res.status(403).json({ error: 'User role not found' });
        }

        if (!allowedRoles.includes(userData.role.toLowerCase())) {
            return res.status(403).json({ 
                error: `Access denied. Required roles: ${allowedRoles.join(', ')}`
            });
        }
        else{
            logger.info({
                message: `User authorized`,
                user: userData.username,
                role: userData.role,
                method: method,
                path: req.originalUrl
            });
        }
        return next(); 
       
    } catch (error) {
        logger.error('Authentication error:', error);
        return res.status(500).json({ error: 'Internal server error during authentication' });
    }
};
export default authenticate;