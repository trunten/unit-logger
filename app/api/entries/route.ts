import {NextResponse} from "next/server";
import {getCurrentUser} from "../../../lib/clerk-user";
import {readStore,writeStore} from "../../../lib/store";

export const runtime="nodejs";

async function me(){return getCurrentUser()}

export async function GET(){
  const user=await me();
  if(!user)return NextResponse.json({error:"Unauthorised"},{status:401});
  const s=await readStore();const u=s.users.find(x=>x.id===user.id);
  return NextResponse.json({entries:u?.entries||[]});
}

export async function POST(req:Request){
  const user=await me();
  if(!user)return NextResponse.json({error:"Unauthorised"},{status:401});
  const body=await req.json();const units=Number(body.units);
  if(!body.name||!Number.isFinite(units)||units<=0||units>100)return NextResponse.json({error:"Please enter a valid drink and units."},{status:400});
  const at=new Date(body.at);
  if(Number.isNaN(at.getTime()))return NextResponse.json({error:"Invalid date."},{status:400});
  const s=await readStore();const u=s.users.find(x=>x.id===user.id);
  if(!u)return NextResponse.json({error:"Account not found"},{status:404});
  u.entries.push({id:crypto.randomUUID(),at:at.toISOString(),name:String(body.name).slice(0,80),units:Math.round(units*10)/10});
  await writeStore(s);return NextResponse.json({entries:u.entries});
}

export async function DELETE(req:Request){
  const user=await me();
  if(!user)return NextResponse.json({error:"Unauthorised"},{status:401});
  const id=new URL(req.url).searchParams.get("id");const s=await readStore();const u=s.users.find(x=>x.id===user.id);
  if(!u)return NextResponse.json({error:"Account not found"},{status:404});
  u.entries=u.entries.filter(e=>e.id!==id);await writeStore(s);
  return NextResponse.json({entries:u.entries});
}