import {cookies} from "next/headers";
import {createHash,randomBytes} from "node:crypto";
import {readStore,writeStore} from "./store";

const COOKIE="unit_logger_session";
const MAX_AGE=60*60*24*365*5;

function hash(token:string){return createHash("sha256").update(token).digest("hex")}

export async function getCurrentSessionUserId(){
  const token=(await cookies()).get(COOKIE)?.value;
  if(!token)return null;
  const s=await readStore();
  const hashValue=hash(token);
  const session=s.sessions?.find(x=>x.tokenHash===hashValue);
  if(!session)return null;
  if(session.expiresAt<=Date.now()){
    s.sessions=s.sessions?.filter(x=>x.tokenHash!==hashValue);
    await writeStore(s);
    return null;
  }
  return session.userId;
}

export async function createSession(userId:string){
  const token=randomBytes(32).toString("base64url");
  const s=await readStore();
  const now=Date.now();
  s.sessions=(s.sessions||[]).filter(x=>x.expiresAt>now);
  s.sessions.push({tokenHash:hash(token),userId,expiresAt:now+MAX_AGE*1000});
  await writeStore(s);
  (await cookies()).set(COOKIE,token,{httpOnly:true,secure:true,sameSite:"lax",path:"/",maxAge:MAX_AGE});
}

export async function clearSession(){
  const jar=await cookies();
  const token=jar.get(COOKIE)?.value;
  if(token){
    const s=await readStore();
    s.sessions=(s.sessions||[]).filter(x=>x.tokenHash!==hash(token));
    await writeStore(s);
  }
  jar.set(COOKIE,"",{httpOnly:true,secure:true,sameSite:"lax",path:"/",maxAge:0});
}