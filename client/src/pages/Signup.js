import React from 'react';
import { useState } from "react";
import { useSignup } from "../hooks/useSignup";

const Signup = () => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { signup, isLoading, isSubmitting, error } = useSignup()

    const handleSubmit = async (e) => {
        e.preventDefault();
        await signup(username, email, password);
    };

    return (
        <form className="signup" onSubmit={handleSubmit}>
            <img
                src="/auth.png"
                alt="auth"
                style={{ width: '120px', height: '35px' }}
            />
            <h3>SIGN UP</h3>

            <label htmlFor="username">Username</label>
            <input
                id="username"
                type="text"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                disabled={isSubmitting}
            />
           <label htmlFor="email">Email</label>
            <input
                id="email"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                disabled={isSubmitting}
            />
             <label htmlFor="password">Password</label>
            <input
                id="password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                disabled={isSubmitting}
            />

            {/* // disable button while a request is happening */}
            <button disabled={isLoading}>Sign up</button>
            {error && <div className="error">{error}</div>}
        </form>
    )
}

export default Signup