import { Link, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './views/HomeView';
import Write from './views/WriteView';
import Read from './views/ReadView';
import Edit from './views/EditView';
import Signup from './views/SignupView';
import { cloneElement, useEffect, useState } from 'react';
import axios from 'axios';
import LoginModal from './components/LoginModal';
import { Mobile, PC } from './components/ResponsiveConfig';

function App() {

  const JWT_EXPIRY_TIME = 30 * 60 * 1000;

  const [modal, setModal] = useState(false);
  const [accessToken, setAccessToken] = useState();
  const [userRole, setUserRole] = useState();
  const [isLoading, setIsLoading] = useState(true);

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
      { modal && <LoginModal setModal={setModal} setAccessToken={setAccessToken} refresh={refresh} setUserRole={setUserRole} /> }
      <header className="header">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="header-content">
                <h1 className="header-title">
                  Jimslog
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>
      <Mobile>
        <SideBar width={280}>
          <Menu isLoading={isLoading} accessToken={accessToken} setModal={setModal} setAccessToken={setAccessToken} setUserRole={setUserRole} />
        </SideBar>
      </Mobile>

      <div className="container">
        <div className="row">
          <div className="col-md-3">
            <PC>
              <Menu isLoading={isLoading} accessToken={accessToken} setModal={setModal} setAccessToken={setAccessToken} setUserRole={setUserRole} />
            </PC>
          </div>

          <div className="col-md-9">
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

const Menu = (props) => {
  return (
    <div>
      <Link to="/">Home</Link>
        <h2>전체글()</h2>
        <div>
          <h3>부모카테고리()</h3>
          <ul>
            <li>자식카테고리()</li>
          </ul>
        </div>
        {props.isLoading ? null : props.accessToken == null ? <LoginBtn setModal={props.setModal} toggleMenu={props.toggleMenu} /> : <LogoutBtn setAccessToken={props.setAccessToken} setUserRole={props.setUserRole} />}
    </div>
  )
}

const SideBar = ({width, children}) => {
  console.log("여기")
  const [isOpen, setIsOpen] = useState(false);
  const [xPosition, setXPosition] = useState(width);

  const toggleMenu= () => {
    if(xPosition > 0) {
      setXPosition(0);
      setIsOpen(true);
    } else {
      setXPosition(width);
      setIsOpen(false);
    }
  }

  return (
    <div className="side-bar-background" onClick={toggleMenu} style={{backgroundColor: isOpen && "rgba(255,255,255,0.5)", backdropFilter: isOpen && "blur(1px)", width: isOpen && "100%"}}>
      <div className="side-bar" onClick={(e) => e.stopPropagation()} style={{ width: `${width}px`, transform: `translateX(${-xPosition}px)`}}>
        <div>{cloneElement(children, { toggleMenu: toggleMenu })}</div>
      </div>
      <button className="side-bar-button" onClick={toggleMenu}></button>
    </div>
  )
}

const logout = (setUserRole) => {
  axios.post("/api/auth/logout")
    .then(() => {
      setUserRole();
    })
}

const LoginBtn = (props) => {

  let toggleMenu;

  <Mobile>
    {toggleMenu = props.toggleMenu}
  </Mobile>

  return (
    <button onClick={() => {
      toggleMenu && toggleMenu();
      props.setModal(true);
    }}>
      로그인
    </button>
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
