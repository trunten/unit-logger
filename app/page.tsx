import { auth } from "@clerk/nextjs/server";
import { getOrCreateUser } from "../lib/clerk-user";
import Login from "./ui/Login";
import Dashboard from "./ui/Dashboard";
export default async function Page(){const {userId}=await auth();if(!userId)return <Login/>;const user=await getOrCreateUser(userId);return <Dashboard user={user}/>}
