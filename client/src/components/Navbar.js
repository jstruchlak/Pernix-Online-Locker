import { Link } from 'react-router-dom'

const Navbar = () => {

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
                                style={{ width: '120px', height: '39px', verticalAlign: 'middle', padding: '0 3px', marginTop: '-4px' }}
                            />
                            - Online Locker
                        </h1>
                        <h3>Your Info, Your Safe Place.</h3>
                    </span>
                </Link>
                <nav>
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