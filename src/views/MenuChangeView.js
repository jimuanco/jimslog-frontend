import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const MenuChnage = (props) => {
  const[newMenus, setNewMenus] = useState(props.menus);
  const[clickedMainMenu, setClickedMainMenu] = useState([0, 0]);
  const[clickedSubMenu, setClickedSubMenu] = useState([0, 0]);
  const[mainMenuInput, setMainMenuInput] = useState(0);
  const[subMenuInput, setSubMenuInput] = useState(0);

  const navigate = useNavigate();

  const inputText = useRef("");

  useEffect(() => {
    inputText.current = "";
  }, [newMenus])

  const fetchChangeMenus = () => {
    axios.post(process.env.REACT_APP_API_URL + "/menus", newMenus, {headers: {Authorization: `Bearer ${props.accessToken}`}})
      .then(() => {
        navigate("/");
      });
  }

  const handleClickedMainMenu = (listOrder) => {
    setClickedSubMenu([0, 0]);
    setMainMenuInput(0);
    setSubMenuInput(0);
    if(clickedMainMenu[0] === listOrder && clickedMainMenu[1] === 0) {
      setClickedMainMenu([listOrder, 1]);
    } else if(clickedMainMenu[0] === listOrder && clickedMainMenu[1] === 1) {
      setClickedMainMenu([listOrder, 2]);
    } else {
      setClickedMainMenu([listOrder, 1]);
    }
  };

  const handleClickedSubMenu = (subListOrder, mainListOrder) => {    
    setClickedMainMenu([mainListOrder, 0]);
    setMainMenuInput(0);
    setSubMenuInput(0);
    if(clickedSubMenu[0] === subListOrder && clickedSubMenu[1] === 0) {
      setClickedSubMenu([subListOrder, 1]);
    } else if(clickedSubMenu[0] === subListOrder && clickedSubMenu[1] === 1 && clickedMainMenu[0] === mainListOrder) {
      setClickedSubMenu([subListOrder, 2]);
    } else {
      setClickedSubMenu([subListOrder, 1]);
    }
  }

  const addMainInput = () => {
    if(clickedMainMenu[0] === 0) {
      setMainMenuInput("new");
      setSubMenuInput(0);
    }

    if(clickedMainMenu[0] > 0 && clickedSubMenu[0] === 0) {
      setClickedMainMenu([0, 0]);
      setClickedSubMenu([0, 0]);
      setMainMenuInput(clickedMainMenu[0]);
      setSubMenuInput(0);
    }
  }

  const addSubInput = () => {
    if(clickedMainMenu[0] > 0 && clickedSubMenu[0] === 0) {
      setClickedMainMenu([clickedMainMenu[0], 1]);
      setMainMenuInput(clickedMainMenu[0]);
      let childrenLen = newMenus[clickedMainMenu[0] - 1].children.length;
      childrenLen > 0 ? setSubMenuInput(childrenLen) : setSubMenuInput("new");
    }

    if(clickedSubMenu[0] > 0) {
      setClickedSubMenu([0, 0]);
      setSubMenuInput(clickedSubMenu[0]);
      setMainMenuInput(clickedMainMenu[0]);
    }
  }

  const changeMenus = () => {
    if(mainMenuInput === 0 && subMenuInput === 0 && inputText.current !== "" && (clickedMainMenu[1] === 2 || clickedSubMenu[1] === 2)) {
      setNewMenus(prevMenus => {
        const changedMenus = [...prevMenus];

        if (clickedSubMenu[0] === 0) {
          changedMenus[clickedMainMenu[0] - 1] = { ...changedMenus[clickedMainMenu[0] - 1], name: inputText.current };
        } else {
          const parentMenu = { ...changedMenus[clickedMainMenu[0] - 1] };
          parentMenu.children[clickedSubMenu[0] - 1] = { ...parentMenu.children[clickedSubMenu[0] - 1], name: inputText.current };
          changedMenus[clickedMainMenu[0] - 1] = parentMenu;
        }
      
        return changedMenus;
      });
      setClickedMainMenu(clickedMainMenu[0], 1);
      setClickedSubMenu(clickedSubMenu[0], 1);
      return;
    }

    if(inputText.current === "") {
      return;
    }

    if(mainMenuInput === "new" || (mainMenuInput === newMenus.length && subMenuInput === 0)) {
      setMainMenuInput(0);
      setNewMenus([...newMenus, {listOrder: newMenus.length + 1, name: inputText.current, children: [], postCount: 0}]);
      return;
    }

    if(mainMenuInput > 0 && subMenuInput === 0) {
      setMainMenuInput(0);
      setNewMenus(prevMenus => [
        ...prevMenus.slice(0, mainMenuInput),
        {listOrder: mainMenuInput + 1, name: inputText.current, children: [], postCount: 0},
        ...prevMenus.slice(mainMenuInput).map(item => ({ ...item, listOrder: item.listOrder + 1 }))
      ]);
      return;
    }

    if((subMenuInput > 0 || subMenuInput === "new") && mainMenuInput > 0) {
      setMainMenuInput(0);
      setSubMenuInput(0);
      setNewMenus(prevMenus => {
        const changedMenus = [...prevMenus];
        const parentMenu = changedMenus[mainMenuInput - 1];

        if(subMenuInput === "new") {
          parentMenu.children.push({listOrder: 1, name: inputText.current, children: [], postCount: 0})
        } else {
          parentMenu.children = [
            ...parentMenu.children.slice(0, subMenuInput),
            {listOrder: subMenuInput + 1, name: inputText.current, children: [], postCount: 0},
            ...parentMenu.children.slice(subMenuInput).map(item => ({ ...item, listOrder: item.listOrder + 1 }))
          ];
        }
        return changedMenus;
      });
    }
  }
  
  const handleMoveUp = () => {
    if(mainMenuInput !== 0 || subMenuInput !== 0) return;
    if(clickedMainMenu[0] > 1 && clickedSubMenu[0] === 0) {
      const updatedMenus = [...newMenus];
      [updatedMenus[clickedMainMenu[0] - 2], updatedMenus[clickedMainMenu[0] - 1]] = [updatedMenus[clickedMainMenu[0] - 1], updatedMenus[clickedMainMenu[0] - 2]];

      [updatedMenus[clickedMainMenu[0] - 2].listOrder, updatedMenus[clickedMainMenu[0] - 1].listOrder] = [updatedMenus[clickedMainMenu[0] - 1].listOrder, updatedMenus[clickedMainMenu[0] - 2].listOrder];

      setClickedMainMenu([clickedMainMenu[0] - 1, clickedMainMenu[1]]);
      setNewMenus(updatedMenus);
    } else if(clickedSubMenu[0] > 1) {
      const updatedMenus = [...newMenus];
      [updatedMenus[clickedMainMenu[0] - 1].children[clickedSubMenu[0] - 2], updatedMenus[clickedMainMenu[0] - 1].children[clickedSubMenu[0] - 1]] = [updatedMenus[clickedMainMenu[0] - 1].children[clickedSubMenu[0] - 1], updatedMenus[clickedMainMenu[0] - 1].children[clickedSubMenu[0] - 2]];

      [updatedMenus[clickedMainMenu[0] - 1].children[clickedSubMenu[0] - 2].listOrder, updatedMenus[clickedMainMenu[0] - 1].children[clickedSubMenu[0] - 1].listOrder] = [updatedMenus[clickedMainMenu[0] - 1].children[clickedSubMenu[0] - 1].listOrder, updatedMenus[clickedMainMenu[0] - 1].children[clickedSubMenu[0] - 2].listOrder];

      setClickedSubMenu([clickedSubMenu[0] - 1, clickedSubMenu[1]]);
      setNewMenus(updatedMenus);
    }
  }

  const handleMoveDown = () => {
    if(mainMenuInput !== 0 || subMenuInput !== 0) return;
    if(clickedMainMenu[0] > 0 && clickedMainMenu[0] < newMenus.length && clickedSubMenu[0] === 0) {
      const updatedMenus = [...newMenus];
      [updatedMenus[clickedMainMenu[0] - 1], updatedMenus[clickedMainMenu[0]]] = [updatedMenus[clickedMainMenu[0]], updatedMenus[clickedMainMenu[0] - 1]];

      [updatedMenus[clickedMainMenu[0] - 1].listOrder, updatedMenus[clickedMainMenu[0]].listOrder] = [updatedMenus[clickedMainMenu[0]].listOrder, updatedMenus[clickedMainMenu[0] - 1].listOrder];

      setClickedMainMenu([clickedMainMenu[0] + 1, clickedMainMenu[1]]);
      setNewMenus(updatedMenus);
    } else if(clickedSubMenu[0] > 0 && clickedSubMenu[0] < newMenus[clickedMainMenu[0] - 1].children.length) {
      const updatedMenus = [...newMenus];
      [updatedMenus[clickedMainMenu[0] - 1].children[clickedSubMenu[0] - 1], updatedMenus[clickedMainMenu[0] - 1].children[clickedSubMenu[0]]] = [updatedMenus[clickedMainMenu[0] - 1].children[clickedSubMenu[0]], updatedMenus[clickedMainMenu[0] - 1].children[clickedSubMenu[0] - 1]];

      [updatedMenus[clickedMainMenu[0] - 1].children[clickedSubMenu[0] - 1].listOrder, updatedMenus[clickedMainMenu[0] - 1].children[clickedSubMenu[0]].listOrder] = [updatedMenus[clickedMainMenu[0] - 1].children[clickedSubMenu[0]].listOrder, updatedMenus[clickedMainMenu[0] - 1].children[clickedSubMenu[0] - 1].listOrder];

      setClickedSubMenu([clickedSubMenu[0] + 1, clickedSubMenu[1]]);
      setNewMenus(updatedMenus);
    }
  }

  const deleteMenu = () => {
    if(clickedMainMenu[0] > 0 && clickedSubMenu[0] === 0) {
      if(newMenus[clickedMainMenu[0]-1].postsCount > 0) {
        alert("게시글이 존재하는 메뉴는 삭제할 수 없습니다.");
        return;
      }
      setNewMenus(prevMenus => [
        ...prevMenus.slice(0, clickedMainMenu[0] - 1),
        ...prevMenus.slice(clickedMainMenu[0]).map(item => ({ ...item, listOrder: item.listOrder - 1 }))
      ]);
      return;
    }

    if(clickedSubMenu[0] > 0) {
      if(newMenus[clickedMainMenu[0]-1].children[clickedSubMenu[0]-1].postsCount > 0) {
        alert("게시글이 존재하는 메뉴는 삭제할 수 없습니다.");
        return;
      }
      setNewMenus(prevMenus => {
        const changedMenus = [...prevMenus];
        const parentMenu = changedMenus[clickedMainMenu[0] - 1];

        parentMenu.children = [
          ...parentMenu.children.slice(0, clickedSubMenu[0] - 1),
          ...parentMenu.children.slice(clickedSubMenu[0]).map(item => ({ ...item, listOrder: item.listOrder - 1 }))
        ];
      
        return changedMenus;
      });
    }
  }

  const cancelChanges = () => {
    const deepCopyMenu = (menu) => {
      return {
        ...menu,
        children: menu.children ? menu.children.map(deepCopyMenu) : []
      };
    };
    
    const copiedMenus = props.menus.map((menu) => {
      return {
        ...deepCopyMenu(menu)
      };
    });
    setNewMenus(copiedMenus);
    setClickedMainMenu([0, 0]);
    setClickedSubMenu([0, 0]);
    setMainMenuInput(0);
    setSubMenuInput(0);
  }
  
  return (
    <div className="menu-change-content">
      <div className="menu-change-lists">
        {newMenus.length > 0 && newMenus.map((menu, index) => 
          <div className="menu-change-item" key={index}>
            <h2 style={{ color: (clickedSubMenu[0] === 0 && clickedMainMenu[0] - 1 === index) && "#0081ff", display: (clickedMainMenu[0] - 1 !== index ||  clickedMainMenu[1] !== 2) ? "block" : "none" }} onClick={() => {handleClickedMainMenu(menu.listOrder)}}>{menu.name}</h2>
            <input key={menu.name} type="text" style={{ display: (clickedMainMenu[0] - 1 === index &&  clickedMainMenu[1] === 2) ? "block" : "none" }} defaultValue={menu.name} onChange={(e) => {inputText.current = e.target.value}} onKeyDown={(e) => {e.key === "Enter" && changeMenus()}} />
            <div className="sub-change-lists">
              <ul>
                {
                  menu.children.length > 0 &&
                  menu.children.map((subMenu, index) => 
                    <div key={index}>
                      <li style={{ color: (clickedSubMenu[0] - 1 === index && clickedMainMenu[0] === menu.listOrder) && "#0081ff", display: (clickedSubMenu[0] - 1 !== index ||  clickedSubMenu[1] !== 2 || clickedMainMenu[0] !== menu.listOrder) ? "block" : "none" }} onClick={() => {handleClickedSubMenu(subMenu.listOrder, menu.listOrder)}}>{subMenu.name}</li>
                      <input key={subMenu.name} type="text" style={{ display: (clickedSubMenu[0] - 1 === index &&  clickedSubMenu[1] === 2 && clickedMainMenu[0] === menu.listOrder) ? "block" : "none" }} defaultValue={subMenu.name} onChange={(e) => {inputText.current = e.target.value}} onKeyDown={(e) => {e.key === "Enter" && changeMenus()}} />
                      <input type="text" style={{ display: (subMenuInput - 1 === index && mainMenuInput === menu.listOrder) ? "block" : "none" }} onChange={(e) => {inputText.current = e.target.value}} onKeyDown={(e) => {e.key === "Enter" && changeMenus()}} />
                    </div>
                  )
                }
                {
                  subMenuInput === "new" && mainMenuInput === menu.listOrder &&
                  <input type="text" onChange={(e) => {inputText.current = e.target.value}} onKeyDown={(e) => {e.key === "Enter" && changeMenus()}} />
                }
              </ul>
            </div>
            <input type="text" style={{ display: (mainMenuInput - 1 === index && subMenuInput === 0) ? "block" : "none" }} onChange={(e) => {inputText.current = e.target.value}} onKeyDown={(e) => {e.key === "Enter" && changeMenus()}} />
          </div>
        )}
        {
          mainMenuInput === "new" &&
          <input type="text" onChange={(e) => {inputText.current = e.target.value}} onKeyDown={(e) => {e.key === "Enter" && changeMenus()}} />
        }
      </div>
      <div className="button-group">
        <div className="menu-controll-buttons">
          <button className="main-add-button" type="button" onClick={() => addMainInput()}>+</button>
          <button className="sub-add-button" type="button" onClick={() => addSubInput()}>+</button>
          <button type="button" onClick={() => changeMenus()}>✓</button>
          <button type="button" onClick={() => handleMoveUp()}>↑</button>
          <button type="button" onClick={() => handleMoveDown()}>↓</button>
          <button type="button" onClick={() => deleteMenu()}>✕</button>
        </div>
        <div className="action-buttons">
          <button type="button" onClick={() => fetchChangeMenus()}>적용</button>
          <button type="button" onClick={() => cancelChanges()}>취소</button>
        </div>
      </div>
    </div>
  ) 
}

export default MenuChnage;