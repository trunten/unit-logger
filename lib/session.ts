import {cookies} from "next/headers";
import {readStore,writeStore} from "./store";

const COOKIE="unit_logger_session";
const MAX_AGE=60*60*24*365*5;

async function hash(token:string){
  const data=new TextEncoder().encode(token);
  const digest=await crypto.subtle.digest("SHA-256",data);
  return Array.from(new Uint8Array(digest)).map(x=>x.toString(16).padStart(2,"0")).join("");
}

function randomToken(){
  const bytes=new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map(x=>x.toString(16).padStart(2,"0")).join("");
}

export async function getCurrentSessionUserId(){
  const token=(await cookies()).get(COOKIE)?.value;
  if(!token)return null;
  const s=await readStore();
  const hashValue=await hash(token);
  const session=s.sessions?.find(x=>x.tokenHash===hashValue);
  if(!session)return null;
  if(session.expiresAt<=Date.now()){
    s.sessions=(s.sessions||[]).filter(x=>x.tokenHash!==hashValue);
    await writeStore(s);
    return null;
  }
  return session.userId;
}

export async function createSession(userId:string){
  const token=randomToken();
  const s=await readStore();
  const now=Date.now();
  const sessions=(s.sessions||[]).filter(x=>x.expiresAt>now);
  sessions.push({tokenHash:await hash(token),userId,expiresAt:now+MAX_AGE*1000});
  s.sessions=sessions;
  await writeStore(s);
  (await cookies()).set(COOKIE,token,{httpOnly:true,secure:true,sameSite:"lax",path:"/",maxAge:MAX_AGE});
}

export async function clearSession(){
  const jar=await cookies();
  const token=jar.get(COOKIE)?.value;
  if(token){
    const s=await readStore();
    const hashValue=await hash(token);
    s.sessions=(s.sessions||[]).filter(x=>x.tokenHash!==hashValue);
    await writeStore(s);
  }
  jar.set(COOKIE,"",{httpOnly:true,secure:true,sameSite:"lax",path:"/",maxAge:0});
}