import MDEditor, { commands, executeCommand, selectWord } from "@uiw/react-md-editor";
import axios from "axios";
import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom";
import rehypeSanitize from "rehype-sanitize";
import { PC } from "../components/ResponsiveConfig";
import ReactTextareaAutosize from "react-textarea-autosize";

const Write = (props) => {
  console.log("tlqkf")

  const [post, setPost] = useState({post:"", content:""});
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const cursorPosition = useRef(0);
  const [selectorModal, setSelectorModal] = useState(false);
  const selectedMenu = useRef(0);

  const write = (menuId) => {
    axios.post("/api/posts", {
      title: post.title,
      content: post.content,
      menuId: menuId
    }, {headers: {Authorization: `Bearer ${props.accessToken}`}})
      .then(() => {
        navigate("/", {replace: true});
      });
  }

  const saveImage = () => {
    const file = fileInputRef.current.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const contentBeforeCursor = post.content.substring(0, cursorPosition.current);
      const contentAfterCursor = post.content.substring(cursorPosition.current);
      setPost({...post, content: contentBeforeCursor + `\n![image](https://cfnimage.commutil.kr/phpwas/restmb_allidxmake.php?pp=002&idx=3&simg=2022111116425800738539a63f16412114122486.jpg&nmt=18)\n` + contentAfterCursor});
    }
    fileInputRef.current.value = null;
  }

  const image = {
    name: 'image',
    keyCommand: 'image',
    shortcuts: 'ctrlcmd+k',
    prefix: '![image](',
    suffix: ')',
    buttonProps: { 'aria-label': 'Add image (ctrl + k)', title: 'Add image (ctrl + k)' },
    icon: (
      <svg width="13" height="13" viewBox="0 0 20 20">
        <path
          fill="currentColor"
          d="M15 9c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4-7H1c-.55 0-1 .45-1 1v14c0 .55.45 1 1 1h18c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm-1 13l-6-5-2 2-4-5-4 8V4h16v11z"
        />
      </svg>
    ),
    execute: async (state, api) => {
      cursorPosition.current = document.querySelector(".w-md-editor-text-input").selectionStart;
      fileInputRef.current.click();
    },
  };

  const handlePreviewScroll = () => {
    const previewBox = document.querySelector(".w-md-editor-preview");
    previewBox && (previewBox.scrollTop = previewBox.scrollHeight);
  }

  const handleMenuChange = (e) => {
    selectedMenu.current = e.target.value;
  }

  return (
    <div>
      <div className="write-view">
        <div className="write-view-title">
          <ReactTextareaAutosize className="write-input-title" placeholder="제목을 입력해주세요." onInput={e => setPost({...post, title: e.target.value})} onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }} />
          <PC>
            <div className="write-render-title">
              {post.title}
            </div>
          </PC>
        </div>
        <div className="write-view-content">
          <MDEditor
            value={post.content}
            onChange={e => {
              setPost({...post, content: e});
              handlePreviewScroll();
            }}
            previewOptions={{
              allowedElements: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'span', 'br', 'ul', 'ol', 'li', 'strong' ,'hr', 'em', 'del', 'table', 'thead', 'th', 'tbody', 'tr', 'td', 'blockquote', 'code', 'pre', 'img'],
            }}
            preview={props.isPcScreen ? "live" : "edit"}
            commands={[commands.bold, commands.italic, commands.strikethrough, commands.hr, commands.group([commands.title1, commands.title2, commands.title3, commands.title4, commands.title5, commands.title6], {
              name: 'title',
              groupName: 'title',
              buttonProps: { 'aria-label': 'Insert title'}
            }), commands.divider, commands.link, commands.quote, commands.code, commands.codeBlock, image, commands.table, commands.divider, commands.unorderedListCommand, commands.orderedListCommand, commands.divider, commands.help]}
            height="100%"
          />
          <input style={{display: "none"}} ref={fileInputRef} type="file" accept="image/*" onChange={saveImage}/>
        </div>
        <div className="write-view-footer">
          {/* <button type="button" className="submit-post-button" onClick={write}>글 작성 완료</button> */}
          <button type="button" className="submit-post-button" onClick={() => {
            if(props.menus.length === 0) {
              write(0);
              return;
            }
            setSelectorModal(true);
          }}>글 작성 완료</button>
        </div>
      </div>
      {
        selectorModal && <MenuSelectorModal setSelectorModal={setSelectorModal} menus={props.menus} handleMenuChange={handleMenuChange} selectedMenu={selectedMenu} write={write} />
      }
    </div>
  )
}

const MenuSelectorModal = (props) => {

  const createPost = () => {
    if(props.selectedMenu.current === 0) {
      if(props.menus[0].children.length === 0) {
        props.selectedMenu.current = props.menus[0].id; 
      } else {
        props.selectedMenu.current = props.menus[0].children[0].id;
      }
    }
    props.write(props.selectedMenu.current);
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
                  <option value={menu.id}>{menu.name}</option>
                ) : (
                  <>
                    <option value={menu.id} disabled>{menu.name}</option>
                    {menu.children.map((subMenu, subIndex) => (
                      <option value={subMenu.id}>{subMenu.name}</option>
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

export default Write;