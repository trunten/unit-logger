"use client";

import {SignInButton,useAuth} from "@clerk/nextjs";
import {useRouter} from "next/navigation";
import {useEffect,useRef,useState} from "react";

export default function Login(){
  const {isLoaded,isSignedIn}=useAuth();
  const router=useRouter();
  const bootstrapped=useRef(false);
  const [error,setError]=useState("");

  useEffect(()=>{
    if(!isLoaded||!isSignedIn||bootstrapped.current)return;
    bootstrapped.current=true;
    (async()=>{
      const r=await fetch("/api/auth/bootstrap",{method:"POST"});
      if(r.ok)router.refresh();
      else{setError("Could not finish sign-in. Please try again.");bootstrapped.current=false}
    })();
  },[isLoaded,isSignedIn,router]);

  return <main className="auth"><div className="card authCard"><div className="brandMark">UL</div><p className="eyebrow">PRIVATE • SIMPLE • SYNCED</p><h1>Unit Logger</h1><p className="muted">A calm way to keep track of your daily drinking units.</p><div className="credentials"><SignInButton mode="modal"><button disabled={!isLoaded}>{isSignedIn?"Signing in…":"Sign in"}</button></SignInButton>{error&&<p className="muted">{error}</p>}</div></div></main>;
}