import MDEditor from "@uiw/react-md-editor";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"

const Read = (props) => {

  const {postId} = useParams();
  const [post, setPost] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/posts/${postId}`)
      .then((response) => {
        setPost(response.data.data);
      });
  }, []);

  const moveToEdit = () => {
    navigate(`/edit/${postId}`);
  }

  const deletePost = () => {
    axios.delete(`/api/posts/${postId}`, {headers: {Authorization: `Bearer ${props.accessToken}`}})
      .then(() => {
        navigate("/", {replace: true});
      });
  }

  return (
    <div>
      <h2>{post.title}</h2>
      <div className="container">
        <MDEditor.Markdown source={post.content} />
      </div>
      {props.userRole === "ADMIN" && <button onClick={moveToEdit}>수정</button>}
      {props.userRole === "ADMIN" && <button onClick={deletePost}>삭제</button>}
    </div>
  )
}

export default Read;