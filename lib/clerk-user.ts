import { clerkClient,auth } from "@clerk/nextjs/server";
import { readStore,writeStore } from "./store";
export async function getOrCreateUser(clerkId:string){
 const client=await clerkClient(); const cu=await client.users.getUser(clerkId);
 const email=cu.emailAddresses.find(e=>e.id===cu.primaryEmailAddressId)?.emailAddress?.toLowerCase();
 const s=await readStore(); let u=s.users.find(x=>x.clerkId===clerkId);
 if(!u && email) u=s.users.find(x=>x.email?.toLowerCase()===email);
 if(!u){const username="clerk-"+clerkId.slice(-8);u={id:"clerk-"+clerkId,username,clerkId,email,entries:[]};s.users.push(u);await writeStore(s)}
 else if(u.clerkId!==clerkId || (email && u.email!==email)){u.clerkId=clerkId;if(email)u.email=email;await writeStore(s)}
 return {id:u.id,username:u.username,email:u.email,clerkId};
}
export async function getCurrentUser(){const {userId}=await auth();return userId?getOrCreateUser(userId):null}