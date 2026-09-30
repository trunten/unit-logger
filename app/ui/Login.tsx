"use client";

import { SignInButton } from "@clerk/nextjs";

export default function Login() {
  return (
    <main className="auth">
      <div className="card authCard">
        <div className="brandMark">UL</div>
        <p className="eyebrow">PRIVATE • SIMPLE • SYNCED</p>
        <h1>Unit Logger</h1>
        <p className="muted">
          A calm way to keep track of your daily drinking units.
        </p>
        <div className="credentials">
          <h2>Welcome</h2>
          <p>
            Sign in securely with your email or one of the sign-in methods
            enabled for this app.
          </p>
          <SignInButton mode="modal">
            <button>Sign in</button>
          </SignInButton>
        </div>
      </div>
    </main>
  );
}
