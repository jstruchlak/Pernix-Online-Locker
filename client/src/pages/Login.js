import { useState } from "react";
import { useLogin } from "../hooks/useLogin";

const Login = () => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { login, error, isLoading } = useLogin()

    const handleSubmit = async (e) => {
        e.preventDefault()
        await login(username, email, password)
    }

    return (
        <form className="login" onSubmit={handleSubmit}>
            <img
                src="/auth.png"
                alt="auth"
                style={{ width: '120px', height: '35px' }}
            />
            <h3>LOGIN</h3>

            <label htmlFor="username">Username</label>
            <input
                type="text"
                id="username"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
            />
            <label htmlFor="email">Email</label>
            <input
                type="email"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
            />
            <label htmlFor="password">Password</label>
            <input
                type="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
            />

            <button disabled={isLoading}>Login</button>
            {error && <div className="error">{error}</div>}

            <a href="/forgot-password">Forgot Password?</a>
        </form>
    )
}

export default Login
