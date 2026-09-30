import {NextResponse} from "next/server";
import {clerkClient} from "@clerk/nextjs/server";
import {getOrCreateUser} from "../../../../lib/clerk-user";
import {createSession} from "../../../../lib/session";

export const runtime="nodejs";

export async function POST(req:Request){
  const body=await req.json().catch(()=>null);
  const token=typeof body?.token==="string"?body.token:"";
  if(!token)return NextResponse.json({error:"Missing sign-in token."},{status:401});
  const client=await clerkClient();
  const {isAuthenticated,userId}=await client.authenticateRequest(req,{
    token,
    tokenType:"session_token",
    authorizedParties:[new URL(req.url).origin],
  });
  if(!isAuthenticated||!userId)return NextResponse.json({error:"Sign-in could not be verified."},{status:401});
  const user=await getOrCreateUser(userId);
  await createSession(user.id);
  return NextResponse.json({ok:true});
}