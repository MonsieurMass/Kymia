import {timingSafeEqual} from 'node:crypto';
export function authorized(req){const secret=process.env.OPERATIONS_SECRET;if(!secret||secret.length<32)return false;const value=req.headers.get('authorization')||'';const expected='Bearer '+secret;return value.length===expected.length&&timingSafeEqual(Buffer.from(value),Buffer.from(expected));}
