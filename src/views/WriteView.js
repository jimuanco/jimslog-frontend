import axios from "axios";
import { useRef } from "react"
import { useNavigate } from "react-router-dom";

const Write = (props) => {

  const title = useRef("");
  const content = useRef("");
  const navigate = useNavigate();

  const write = () => {
    axios.post("/api/posts", {
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
        <input type="test" placeholder="제목을 입력해주세요" onInput={(e) => {title.current = e.target.value}} />
      </div>

      <div>
        <textarea rows="15" onInput={(e) => {content.current = e.target.value}} />
      </div>

      <button onClick={write}>글 작성 완료</button>
    </div>
  )
}

export default Write;