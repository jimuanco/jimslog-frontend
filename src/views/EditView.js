import MDEditor from "@uiw/react-md-editor";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"

const Edit = (props) => {

  const {postId} = useParams();
  const [post, setPost] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/posts/${postId}`)
      .then((response) => {
        setPost(response.data.data);
      });
  },[]);

  const edit = () => {
    axios.patch(`/api/posts/${postId}`, {
      title: post.title,
      content: post.content
    }, {headers: {Authorization: `Bearer ${props.accessToken}`}})
      .then(() => {
        navigate("/", {replace: true});
      });
  }

  return (
    <div>
      <div>
        <input type="text" defaultValue={post.title} onInput={e => setPost({...post, title: e.target.value})} />
      </div>

      <MDEditor
        value={post.content}
        onChange={e => setPost({...post, content: e})}
        previewOptions={{
          allowedElements: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'span', 'br', 'ul', 'ol', 'li', 'strong' ,'hr', 'em', 'del', 'table', 'thead', 'th', 'tbody', 'tr', 'td', 'blockquote', 'code', 'pre', 'input'],
        }}
        preview={props.isPcScreen ? "live" : "edit"}
      />

      <button onClick={edit}>수정완료</button>
    </div>
  )
}

export default Edit;