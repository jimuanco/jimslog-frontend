import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import Home from './views/HomeView';
import Write from './views/WriteView';
import Read from './views/ReadView';
import Edit from './views/EditView';
import Signup from './views/SignupView';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from './components/Modal';

function App() {

  const JWT_EXPIRY_TIME = 30 * 60 * 1000;

  const [modal, setModal] = useState(false);
  const [accessToken, setAccessToken] = useState();
  const [userRole, setUserRole] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    refresh();
  },[]);

  const refresh = () => {
    axios.post("/api/auth/refresh")
      .then((response) => {
        (response.data && response.data.data.role == "ADMIN") && setUserRole("ADMIN");
        response.data && setAccessToken(response.data.data.accessToken);
        setTimeout(refresh, JWT_EXPIRY_TIME - 60000);
        setIsLoading(false);
      });
  }

  return (
    <div className="App">
      { modal && <Modal setModal={setModal} setAccessToken={setAccessToken} refresh={refresh} setUserRole={setUserRole} /> }
      <div className="container">
        <div className="row">
          <div className="col-3">
            <Link to="/">Home</Link>
            <h2>전체글()</h2>
            <div>
              <h3>부모카테고리()</h3>
              <ul>
                <li>자식카테고리()</li>
              </ul>
            </div>
            {isLoading ? null : accessToken == null ? <LoginBtn setModal={setModal} /> : <LogoutBtn setAccessToken={setAccessToken} setUserRole={setUserRole} />}
          </div>

          <div className="col-9">
            <Routes>
              <Route path="/" element={ <Home userRole={userRole} />} />
              <Route path="/write" element={ userRole === "ADMIN" ? <Write accessToken={accessToken} /> : null } />
              <Route path="/read/:postId" element={ <Read accessToken={accessToken} userRole={userRole} /> } />
              <Route path="/edit/:postId" element={ <Edit accessToken={accessToken} /> } />
              
              <Route path="/signup" element={ <Signup /> } />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

const logout = (setUserRole) => {
  axios.post("/api/auth/logout")
    .then(() => {
      setUserRole();
    })
}

const LoginBtn = (props) => {
  return (
    <button onClick={() => {props.setModal(true)}}>로그인</button>
  )
}

const LogoutBtn = (props) => {
  return (
    <button onClick={() => {
      logout(props.setUserRole);
      props.setAccessToken();
    }}>
      로그아웃
    </button>
  )
}

export default App;
