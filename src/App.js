import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import Home from './views/HomeView';
import Write from './views/WriteView';
import Read from './views/ReadView';
import Edit from './views/EditView';
import Signup from './views/SignupView';
import { cloneElement, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Mobile, PC } from './components/ResponsiveConfig';
import MenuChnage from './views/MenuChangeView';
import Login from './views/LoginView';

function App() {
  console.log("렌더링됐어용")

  const JWT_EXPIRY_TIME = 30 * 60 * 1000;

  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState();
  const [userRole, setUserRole] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const [isPcScreen, setIsPcScreen] = useState(window.innerWidth >= 1024);
  const isWritePage = location.pathname === '/write' || location.pathname.startsWith('/edit/');
  const isWritePageOnPc = isPcScreen && isWritePage;

  const [menus, setMenus] = useState([]);
  const [totalPostCount, setTotalPostCount] = useState(0);
  const [postPageTitle, setPostPageTitle] = useState("");
  const [countPerMenu, setCountPerMenu] = useState(0);

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
        if(response.data.count !== undefined && location.pathname === "/") {
          setTotalPostCount(response.data.count);
          setCountPerMenu(response.data.count);
        } else if(response.data.count === undefined && location.pathname === "/") {
          setTotalPostCount(0);
          setCountPerMenu(0);
        }
        location.pathname === "/" && (response.data.count !== undefined ? setPostPageTitle(`전체글(${response.data.count})`) : setPostPageTitle(`전체글(0)`))
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
          <Menu isLoading={isLoading} accessToken={accessToken} setAccessToken={setAccessToken} userRole={userRole} setUserRole={setUserRole} menus={menus} navigate={navigate} location={location} totalPostCount={totalPostCount} setPostPageTitle={setPostPageTitle} setCountPerMenu={setCountPerMenu} />
        </SideBar>
      </Mobile>

      <main className="main" style={mainStylesForPcWritePage}>
        {!isWritePage && 
          <PC>
            <nav className="main-menu-pc">
              <Menu isLoading={isLoading} accessToken={accessToken} setAccessToken={setAccessToken} userRole={userRole} setUserRole={setUserRole} menus={menus} navigate={navigate} location={location} totalPostCount={totalPostCount} setPostPageTitle={setPostPageTitle} setCountPerMenu={setCountPerMenu} />
            </nav>
          </PC>
        }
        <article className="main-content" style={mainContentStylesForPcWritePage}>
          <Routes>
            <Route path="/" element={ <Home userRole={userRole} postPageTitle={postPageTitle} menus={menus} countPerMenu={countPerMenu} />} />
            <Route path="/menu/:mainMenuId/:subMenuId?" element={ <Home userRole={userRole} postPageTitle={postPageTitle} menus={menus} countPerMenu={countPerMenu} />} />
            <Route path="/write" element={ userRole === "ADMIN" ? <Write accessToken={accessToken} isPcScreen={isPcScreen} menus={menus} /> : null } />
            <Route path="/read/:postId" element={ <Read accessToken={accessToken} userRole={userRole} /> } />
            <Route path="/edit/:postId" element={ <Edit accessToken={accessToken} isPcScreen={isPcScreen} menus={menus} /> } />
            <Route path="/menu-change" element={ <MenuChnage menus={menus} accessToken={accessToken} /> } />
            
            <Route path="/login" element={<Login setAccessToken={setAccessToken} refresh={refresh} setUserRole={setUserRole} />} />
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
  const navigate = useNavigate();
  const location = useLocation();

  let toggleMenu;
  <Mobile>
    {toggleMenu = props.toggleMenu}
  </Mobile>

  const entireListMenu = useRef();
  const menuTitleRefs = useRef([]);

  const addEffectToEntireListMenu = () => {
    entireListMenu.current.style.textDecoration = "underline";
    entireListMenu.current.style.fontWeight = "700";
  }

  const deleteEffectToEntireListMenu = () => {
    entireListMenu.current.style.textDecoration = "none";
    entireListMenu.current.style.fontWeight = "400";
  }

  const addEffectToMainMenu = (mainIndex) => {
    menuTitleRefs.current[mainIndex].main.style.textDecoration = "underline";
    menuTitleRefs.current[mainIndex].main.style.fontWeight = "700";
  }

  const deleteEffectToMainMenu = (mainIndex) => {
    menuTitleRefs.current[mainIndex].main.style.textDecoration = "none";
    menuTitleRefs.current[mainIndex].main.style.fontWeight = "400";
  }

  const addEffectToSubMenu = (mainIndex, subIndex) => {
    menuTitleRefs.current[mainIndex].sub[subIndex].style.fontWeight = "700";
  }

  const deleteEffectToSubMenu = (mainIndex, subIndex) => {
    menuTitleRefs.current[mainIndex].sub[subIndex].style.fontWeight = "400";
  }

  return (
    <div className="main-menu-content">
      <h1 ref={entireListMenu} onMouseOver={() => addEffectToEntireListMenu()} onMouseOut={() => deleteEffectToEntireListMenu()} onClick={() => {
        location.pathname == "/" ? navigate("/", {replace: true}) : navigate("/");
        props.setPostPageTitle(`전체글(${props.totalPostCount})`);
        props.setCountPerMenu(props.totalPostCount);
      }}>전체보기({props.totalPostCount})</h1>
      <div className="main-menu-lists">
        {props.menus.length > 0 && props.menus.map((menu, mainIndex) => 
          <div className="main-menu-item" key={mainIndex}>
            <h2 ref={(el) => menuTitleRefs.current[mainIndex] = {main: el, sub: []}} onMouseOver={() => addEffectToMainMenu(mainIndex)} onMouseOut={() => deleteEffectToMainMenu(mainIndex)} onClick={() => {
              location.pathname === `/menu/${menu.id}` ? navigate(`/menu/${menu.id}`, {replace: true}) : navigate(`/menu/${menu.id}`);
              props.setPostPageTitle(`${menu.name}(${menu.postsCount})`);
              props.setCountPerMenu(menu.postsCount);
            }}>{`${menu.name}(${menu.postsCount})`}</h2>
            <div className="sub-menu-lists">
              <ul>
                {
                  menu.children.length > 0 &&
                  menu.children.map((subMenu, subIndex) => 
                    <li ref={(el) => menuTitleRefs.current[mainIndex].sub.push(el)} key={subIndex} onMouseOver={() => addEffectToSubMenu(mainIndex, subIndex)} onMouseOut={() => deleteEffectToSubMenu(mainIndex, subIndex)} onClick={() => {
                      location.pathname === `/menu/${menu.id}/${subMenu.id}` ? navigate(`/menu/${menu.id}/${subMenu.id}`, {replace: true}) : navigate(`/menu/${menu.id}/${subMenu.id}`);
                      props.setPostPageTitle(`${subMenu.name}(${subMenu.postsCount})`);
                      props.setCountPerMenu(subMenu.postsCount);
                    }} >{`${subMenu.name}(${subMenu.postsCount})`}</li>
                  )
                }
              </ul>
            </div>
          </div>
        )}
      </div>
      {
        props.userRole === "ADMIN" && props.accessToken !== undefined &&
        <button type="button" className="new-menu-button" onClick={() => {
          props.location.pathname == "/menu-change" ? props.navigate("/menu-change", {replace: true}) : props.navigate("/menu-change");
          toggleMenu && toggleMenu();
        }}></button>
      }
      {props.accessToken !== undefined && <LogoutBtn setAccessToken={props.setAccessToken} setUserRole={props.setUserRole} />}
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
