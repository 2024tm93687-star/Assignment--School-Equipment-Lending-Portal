import {jwtVerify, createRemoteJWKSet} from 'jose';

const JWKS = createRemoteJWKSet(process.env.AUTH_JWKS_URL);

const authenticate  = async (req, res,)=>{
    const jwt = 0;
    const { payload, protectedHeader } = await jwtVerify(jwt, JWKS, {
        issuer: process.env.AUTH_ISSUER,
        audience: process.env.AUTH_AUDIENCE,
    });
    console.log(protectedHeader)
    console.log(payload)
};
export default authenticate;