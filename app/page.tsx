import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSessionUser } from "../lib/auth";
import Login from "./ui/Login";
import Dashboard from "./ui/Dashboard";
export default async function Page(){const session=await getSessionUser();if(!session)return <Login/>;return <Dashboard user={session}/>}