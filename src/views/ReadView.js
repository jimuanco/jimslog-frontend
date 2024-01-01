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

  useEffect(() => {
    window.scrollTo(0, 0);
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
    <div className="read-view">
      <h1>{post.title}</h1>
      <div className="read-view-info">
        <strong className="writer">Jim</strong>
        <span className="post-date">2024-01-01</span>
        <div className="read-view-buttons">
          {props.userRole === "ADMIN" && <button className="edit-button" type="button" onClick={moveToEdit}>수정</button>}
          {props.userRole === "ADMIN" && <button className="delete-button" type="button" onClick={deletePost}>삭제</button>}
        </div>
      </div>
      <div>
        <MDEditor.Markdown source={post.content} />
      </div>
    </div>
  )
}

export default Read;