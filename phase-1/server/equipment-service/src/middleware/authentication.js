import {jwtVerify, createRemoteJWKSet} from 'jose';

const JWKS = createRemoteJWKSet(process.env.AUTH_JWKS_URL);

const authenticate  = async (req, res,)=>{
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header Missing' });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ error: 'Invalid Authorization header' });
    }
    const jwt = parts[1];
    const { payload, protectedHeader } = await jwtVerify(jwt, JWKS, {
        issuer: process.env.AUTH_ISSUER,
        audience: process.env.AUTH_AUDIENCE,
    });
    console.log(protectedHeader)
    console.log(payload)
};
export default authenticate;