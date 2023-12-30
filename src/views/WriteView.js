import MDEditor, { commands, executeCommand, selectWord } from "@uiw/react-md-editor";
import axios from "axios";
import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom";
import rehypeSanitize from "rehype-sanitize";
import { PC } from "../components/ResponsiveConfig";
import ReactTextareaAutosize from "react-textarea-autosize";

const Write = (props) => {

  const [post, setPost] = useState({post:"", content:""});
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const write = () => {
    axios.post("/api/posts", {
      title: post.title,
      content: post.content
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
      // setSavedImg(reader.result);
      setPost({...post, content: post.content + `\n![image](https://cfnimage.commutil.kr/phpwas/restmb_allidxmake.php?pp=002&idx=3&simg=2022111116425800738539a63f16412114122486.jpg&nmt=18)\n`});
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
      fileInputRef.current.click();
    },
  };

  return (
    <div className="write-view">
      <div className="write-view-title">
        <ReactTextareaAutosize className="write-input-title" placeholder="제목을 입력해주세요." onInput={e => setPost({...post, title: e.target.value})} onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}/>
        <PC>
          <div className="write-render-title">
            {post.title}
          </div>
        </PC>
      </div>
      <div className="write-view-content">
        <MDEditor
          value={post.content}
          onChange={e => setPost({...post, content: e})}
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
        <button type="button" className="submit-post-button" onClick={write}>글 작성 완료</button>
      </div>
    </div>
  )
}

export default Write;