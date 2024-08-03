import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";

const Login = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const { login, error, isLoading } = useLogin();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Login form submitted');
        console.log('Username:', username);
        console.log('Email:', email);
        console.log('Password:', password);
        
        await login(username, email, password);
    };

    const handleForgotPasswordClick = (e) => {
        e.preventDefault();
        console.log('Forgot Password link clicked');
        console.log('Current location:', window.location.href);
        console.log('Navigating to /forgot-password');
        
        // Add a delay to ensure navigation completes before logging
        setTimeout(() => {
            console.log('Navigation to /forgot-password completed');
            console.log('Current location after navigation:', window.location.href);
        }, 500); // Adjust the delay if needed

        navigate('/forgot-password');
    };

    return (
        <form className="login" onSubmit={handleSubmit}>
            <img
                src="/auth.png"
                alt="auth"
                style={{ width: '120px', height: '35px' }}
            />
            <h3>LOGIN</h3>

            <label>Username</label>
            <input
                type="text"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
            />
            <label>Email</label>
            <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
            />
            <label>Password</label>
            <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
            />

            <button disabled={isLoading}>Login</button>
            {error && <div className="error">{error}</div>}

            <a 
                href="/forgot-password"
                onClick={handleForgotPasswordClick}
            >
                Forgot Password?
            </a>
        </form>
    );
};

export default Login;
