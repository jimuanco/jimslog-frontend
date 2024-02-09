const MenuSelectorModal = (props) => {

  const extractImageUrls = (text) => {
    const regex = /!\[.*?\]\((.*?)\)/g;
    const matches = [];
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      matches.push(match[1]);
    }
  
    return matches;
  };

  const createPost = () => {
    if(props.selectedMenu.current === 0) {
      if(props.menus[0].children.length === 0) {
        props.selectedMenu.current = props.menus[0].id; 
      } else {
        props.selectedMenu.current = props.menus[0].children[0].id;
      }
    }
    
    let finalPostImageUrls = extractImageUrls(props.content);
    let deleteImageUrls;
    if(props.newPostImageUrls) {
      deleteImageUrls = props.postImageUrls.concat(props.newPostImageUrls).filter(url => !finalPostImageUrls.includes(url));
      finalPostImageUrls = finalPostImageUrls.filter(url => !props.postImageUrls.includes(url));
    } else {
      deleteImageUrls = props.postImageUrls.filter(url => !finalPostImageUrls.includes(url));
    }

    props.write(props.selectedMenu.current, finalPostImageUrls, deleteImageUrls);
  }

  return (
    <div className="menu-selector-bg" onClick={() => { 
      props.selectedMenu.current = 0;
      props.setSelectorModal(false);
    }}>
      <div className="menu-selector-content" onClick={(e) => { e.stopPropagation() }}>
        <div className="menu-select-box">
          <label for="menu">메뉴를 선택해주세요.</label>
          <select id="menu" onChange={props.handleMenuChange}>
            {props.menus.map((menu, mainIndex) => (
              <>
                {menu.children.length === 0 ? (
                  <option key={mainIndex} value={menu.id}>{menu.name}</option>
                ) : (
                  <>
                    <option key={mainIndex} value={menu.id} disabled>{menu.name}</option>
                    {menu.children.map((subMenu, subIndex) => (
                      <option key={subIndex} value={subMenu.id}>{subMenu.name}</option>
                    ))}
                  </>
                )}
              </>
            ))}
          </select>
        </div>
        <div className="button-group">
          <button type="button" onClick={createPost}>등록</button>
          <button type="button" onClick={() => { 
            props.selectedMenu.current = 0;
            props.setSelectorModal(false);
          }}>취소</button>
        </div>
      </div>
    </div>
  )
}

export default MenuSelectorModal;