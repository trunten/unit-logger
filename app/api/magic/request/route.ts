import {NextResponse} from "next/server";import {createHash,randomBytes} from "crypto";import {Resend} from "resend";import {hashPassword} from "../../../../lib/auth";import {readStore,writeStore} from "../../../../lib/store";export const runtime="nodejs";
function hash(v:string){return createHash("sha256").update(v).digest("hex")}
export async function POST(req:Request){
 const email=String((await req.json().catch(()=>({}))).email||"").trim().toLowerCase();
 if(!email||!email.includes("@"))return NextResponse.json({error:"Enter a valid email address"},{status:400});
 const key=process.env.RESEND_API_KEY;
 if(!key)return NextResponse.json({error:"Email sign-in is not configured yet. Add RESEND_API_KEY in Vercel."},{status:503});
 const s=await readStore();
 let u=s.users.find(x=>x.email===email);
 let created=false;
 if(!u){
  let username="user-"+randomBytes(4).toString("hex");
  while(s.users.some(x=>x.username===username))username="user-"+randomBytes(4).toString("hex");
  u={id:randomBytes(12).toString("hex"),username,passwordHash:await hashPassword(randomBytes(32).toString("base64url")),email,entries:[]};
  s.users.push(u);
  created=true;
 }
 const token=randomBytes(32).toString("base64url");
 s.magicLinks=(s.magicLinks||[]).filter(x=>x.expiresAt>Date.now());
 s.magicLinks.push({tokenHash:hash(token),userId:u.id,expiresAt:Date.now()+15*60*1000});
 await writeStore(s);
 const from=process.env.RESEND_FROM_EMAIL||"Unit Logger <onboarding@resend.dev>";
 const link=new URL("/api/magic/verify",req.url);
 link.searchParams.set("token",token);
 const html='<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto"><h1>Unit Logger</h1><p>Use the button below to sign in. This link expires in 15 minutes and can only be used once.</p><p><a href="'+link.toString()+'" style="display:inline-block;padding:12px 18px;background:#111;color:#fff;text-decoration:none;border-radius:8px">Sign in to Unit Logger</a></p><p style="color:#666;font-size:13px">If you did not request this, you can ignore this email.</p></div>';
 const result=await new Resend(key).emails.send({from,to:email,subject:"Your Unit Logger sign-in link",html});
 if(result.error){
  console.error("Resend magic-link send failed",{name:result.error.name,message:result.error.message});
  if(created){s.users=s.users.filter(x=>x.id!==u!.id);s.magicLinks=(s.magicLinks||[]).filter(x=>x.userId!==u!.id);await writeStore(s)}
  return NextResponse.json({error:"We couldn't send the sign-in email. Check your Resend setup."},{status:502});
 }
 return NextResponse.json({ok:true});
}