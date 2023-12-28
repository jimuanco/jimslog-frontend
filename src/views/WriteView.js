import MDEditor from "@uiw/react-md-editor";
import axios from "axios";
import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom";
import rehypeSanitize from "rehype-sanitize";

const Write = (props) => {

  const [post, setPost] = useState({});
  const navigate = useNavigate();

  const write = () => {
    axios.post("/api/posts", {
      title: post.title,
      content: post.content
    }, {headers: {Authorization: `Bearer ${props.accessToken}`}})
      .then(() => {
        navigate("/", {replace: true});
      });
  }

  return (
    <div className="container">
      <div>
        <input type="test" placeholder="제목을 입력해주세요" onInput={e => setPost({...post, title: e.target.value})} />
      </div>
      <MDEditor
        value={post.content}
        onChange={e => setPost({...post, content: e})}
        previewOptions={{
          allowedElements: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'span', 'br', 'ul', 'ol', 'li', 'strong' ,'hr', 'em', 'del', 'table', 'thead', 'th', 'tbody', 'tr', 'td', 'blockquote', 'code', 'pre', 'input'],
        }}
        preview={props.isPcScreen ? "live" : "edit"}
      />
      <div className="container">
        <MDEditor.Markdown source="**Hello Markdown!**" />
      </div>
      <button onClick={write}>글 작성 완료</button>
    </div>
  )
}

export default Write;