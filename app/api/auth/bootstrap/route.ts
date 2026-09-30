import {NextResponse} from "next/server";
import {auth} from "@clerk/nextjs/server";
import {getOrCreateUser} from "../../../../lib/clerk-user";
import {createSession} from "../../../../lib/session";

export const runtime="nodejs";

export async function POST(){
  const {userId}=await auth();
  if(!userId)return NextResponse.json({error:"Sign-in could not be verified."},{status:401});
  const user=await getOrCreateUser(userId);
  await createSession(user.id);
  return NextResponse.json({ok:true});
}