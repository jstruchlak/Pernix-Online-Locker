import { Link } from 'react-router-dom'
import { useLogout } from '../hooks/useLogout'

const Navbar = () => {
    // invoke logout function from the useLogout hook
    const { logout } = useLogout()

    const handleClick = () => {
        logout()
    }

    return (
        <header>
            <div className="container">
            <Link to="/">
                    <span>
                        <h1>
                            {/* add small custom Pernix image for global nav bar */}
                            <img
                                src="/pernix-custom.png"
                                alt="logo"
                                style={{ width: '150px', height: '103px', verticalAlign: 'middle', padding: '0 px', marginTop: '-3px' }}
                            />
                            - Online Locker
                        </h1>
                        <h3>Your Info, Your Safe Place.</h3>
                    </span>
                </Link>
                <nav>
                    <div>
                        <button onClick={handleClick}>Log Out</button>
                    </div>
                    <div>
                        <Link to="/login">Login</Link>
                        <Link to="/signup">Signup</Link>
                    </div>
                </nav>
            </div>
        </header>
    )
}

export default Navbar