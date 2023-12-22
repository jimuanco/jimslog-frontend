import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"

const Edit = (props) => {

  const {postId} = useParams();
  const [post, setPost] = useState([]);
  const title = useRef("");
  const content = useRef("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/posts/${postId}`)
      .then((response) => {
        title.current = response.data.data.title;
        content.current = response.data.data.content;
        setPost(response.data.data);
      });
  },[]);

  const edit = () => {
    axios.patch(`/api/posts/${postId}`, {
      title: title.current,
      content: content.current
    }, {headers: {Authorization: `Bearer ${props.accessToken}`}})
      .then(() => {
        navigate("/", {replace: true});
      });
  }

  return (
    <div>
      <div>
        <input type="text" defaultValue={post.title} onInput={(e) => {title.current = e.target.value}} />
      </div>

      <div>
        <textarea rows="15" defaultValue={post.content} onInput={(e) => {content.current = e.target.value}} />
      </div>

      <button onClick={edit}>수정완료</button>
    </div>
  )
}

export default Edit;