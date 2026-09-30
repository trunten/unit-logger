import {get,list,put} from "@vercel/blob";
export type Entry={id:string,at:string,name:string,units:number};export type User={id:string,username:string,passwordHash:string,entries:Entry[]};type Store={users:User[]};const PATH="unit-logger/store.json";
async function blob(){const r=await list({prefix:PATH,limit:10});return r.blobs.find(b=>b.pathname===PATH)}
export async function readStore():Promise<Store>{const b=await blob();if(!b)return {users:[]};const r=await get(b.url,{access:"private"});if(!r?.stream)return {users:[]};return JSON.parse(await new Response(r.stream).text()) as Store}
export async function writeStore(store:Store){await put(PATH,JSON.stringify(store),{access:"private",addRandomSuffix:false,contentType:"application/json",cacheControlMaxAge:0})}