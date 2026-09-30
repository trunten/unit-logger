import {getCurrentUser} from "../lib/clerk-user";
import Login from "./ui/Login";
import Dashboard from "./ui/Dashboard";

export const dynamic="force-dynamic";

export default async function Page(){
  const user=await getCurrentUser();
  if(!user)return <Login/>;
  return <Dashboard user={{...user,clerkId:user.clerkId||""}}/>;
}