import { useState } from "react";
import { useLogin } from "../hooks/useLogin";

const Login = () => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    // invoke login function 
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

            <label>Username</label>
            <input
                type="username"
                // (e) event targeting the input text value
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

            <a href="/forgot-password">Forgot Password?</a>
        </form>
    )
}

export default Login