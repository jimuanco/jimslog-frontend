import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
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
import MenuChnage from './views/MenuChangeView';

function App() {
  console.log("렌더링됐어용")

  const JWT_EXPIRY_TIME = 30 * 60 * 1000;

  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [accessToken, setAccessToken] = useState();
  const [userRole, setUserRole] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const [isPcScreen, setIsPcScreen] = useState(window.innerWidth >= 1024);
  const isWritePage = location.pathname === '/write' || location.pathname.startsWith('/edit/');
  const isWritePageOnPc = isPcScreen && isWritePage;

  const [countPosts, setCountPosts] = useState();

  const [menus, setMenus] = useState([]);

  const mainStylesForPcWritePage = {
    width: isWritePageOnPc && '96%',
    maxWidth: isWritePageOnPc && '1536px',
    // marginTop: isWritePageOnPc && '50px',
  };

  const mainContentStylesForPcWritePage = {
    width: isWritePageOnPc && '100%',
    marginLeft: isWritePageOnPc  && '0',
  };

  useEffect(() => {
    fetchMenus()
  }, [location.pathname]);

  useEffect(() => {
    refresh();
  },[]);

  useEffect(() => {
    const handleResize = () => {
      setIsPcScreen(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const fetchMenus = () => {
    axios.get("/api/menus")
      .then((response) => {
        setMenus(response.data.data);
        console.log(response.data.data);
      });
  }

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
      
      <header className="header" style={{display: isWritePage && "none"}}>
        <div className="header-content">
          <h1 className="header-title" onClick={() => {
            location.pathname == "/" ? navigate("/", {replace: true}) : navigate("/");
            fetchMenus();
          }
          }>
            Jimslog
          </h1>
        </div>
      </header>
      
      <Mobile>
        <SideBar width={280} isWritePage={isWritePage}>
          <Menu isLoading={isLoading} accessToken={accessToken} setModal={setModal} setAccessToken={setAccessToken} setUserRole={setUserRole} countPosts={countPosts} menus={menus} navigate={navigate} location={location} />
        </SideBar>
      </Mobile>

      <main className="main" style={mainStylesForPcWritePage}>
        {!isWritePage && 
          <PC>
            <nav className="main-menu-pc">
              <Menu isLoading={isLoading} accessToken={accessToken} setModal={setModal} setAccessToken={setAccessToken} setUserRole={setUserRole} countPosts={countPosts} menus={menus} navigate={navigate} location={location} />
            </nav>
          </PC>
        }
        <article className="main-content" style={mainContentStylesForPcWritePage}>
          <Routes>
            <Route path="/" element={ <Home userRole={userRole} countPosts={countPosts} setCountPosts={setCountPosts} />} />
            <Route path="/write" element={ userRole === "ADMIN" ? <Write accessToken={accessToken} isPcScreen={isPcScreen} /> : null } />
            <Route path="/read/:postId" element={ <Read accessToken={accessToken} userRole={userRole} /> } />
            <Route path="/edit/:postId" element={ <Edit accessToken={accessToken} isPcScreen={isPcScreen} /> } />
            <Route path="/menu-change" element={ <MenuChnage menus={menus} /> } />
            
            <Route path="/signup" element={ <Signup /> } />
          </Routes>
        </article>
      </main>
      {
        !isWritePage && 
        <footer className="footer">
          <div className="footer-content">
            <strong className="copyright">
              © jimuanco
            </strong>
          </div>
        </footer>
      }
    </div>
  );
}

const Menu = (props) => {
  return (
    <div className="main-menu-content">
      <h1>전체보기({props.countPosts})</h1>
      <div className="main-menu-lists">
        {props.menus.length > 0 && props.menus.map((menu, index) => 
          <div className="main-menu-item" key={index}>
            <h2>{menu.name}</h2>
            <div className="sub-menu-lists">
              <ul>
                {
                  menu.children.length > 0 &&
                  menu.children.map((subMenu, index) => 
                    <li key={index}>{subMenu.name}</li>
                  )
                }
              </ul>
            </div>
          </div>
        )}
      </div>
      <button type="button" className="new-menu-button" onClick={() => {
        props.location.pathname == "/menu-change" ? props.navigate("/menu-change", {replace: true}) : props.navigate("/menu-change");
      }}>+</button>
      {props.isLoading ? null : props.accessToken == null ? <LoginBtn setModal={props.setModal} toggleMenu={props.toggleMenu} /> : <LogoutBtn setAccessToken={props.setAccessToken} setUserRole={props.setUserRole} />}
    </div>
  )
}

const SideBar = ({width, children, isWritePage}) => {
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
      <div className="side-bar-content" onClick={(e) => e.stopPropagation()} style={{ width: `${width}px`, transform: `translateX(${-xPosition}px)`}}>
        <div>{cloneElement(children, { toggleMenu: toggleMenu })}</div>
      </div>
      <button className="side-bar-button" onClick={toggleMenu} style={{display: isWritePage && "none"}}></button>
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
    <button className="login-button" onClick={() => {
      toggleMenu && toggleMenu();
      props.setModal(true);
    }}>
      로그인
    </button>
  )
}

const LogoutBtn = (props) => {
  return (
    <button className="logout-button" onClick={() => {
      logout(props.setUserRole);
      props.setAccessToken();
    }}>
      로그아웃
    </button>
  )
}

export default App;
