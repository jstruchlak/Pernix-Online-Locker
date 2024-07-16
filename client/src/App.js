import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import Modal from  'react-modal'

// pages and componenets
import Home from './pages/Home';
import Login  from './pages/Login'
import Signup  from './pages/Signup'
import Navbar from './components/Navbar';
import { useAuthContext } from './hooks/useAuthContext';

Modal.setAppElement('#root');

function App() {
  const { user } = useAuthContext()

  return (
    <div className="App">
      <BrowserRouter>
      <Navbar/>
        <div className="pages">
          <Routes>
            <Route
            // redirect user based on authentication from Auth hook
              path="/"
              element={user ? <Home/> : <Navigate to="/login" /> }
            />
            <Route
              path="/login"
              element={!user ? <Login/> : <Navigate to="/" />}
            />
            <Route
              path="/signup"
              element={!user ? <Signup/> : <Navigate to="/" />}
            />
          </Routes>
        </div>
      </BrowserRouter>

    </div>
  );
}

export default App;
