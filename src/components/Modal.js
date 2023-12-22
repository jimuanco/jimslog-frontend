import axios from "axios";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

const Modal = (props) => {
  
  const email = useRef("");
  const password = useRef("");
  const navigate = useNavigate();
  
  const login = () => {
    axios.post("/api/auth/login", {
      email: email.current,
      password: password.current
    })
      .then((response) => {
        props.setAccessToken(response.data.data.accessToken);
        props.setUserRole(response.data.data.role);
        props.setModal(false);
        // navigate("/")
      })
  }

  return (
    <div className="modal-background" onClick={() => { props.setModal(false) }}>
      <div className="modal-content" onClick={(e) => { e.stopPropagation() }}>
        <h1>Jimslog</h1>
        <div>
          <div>
            <label htmlFor="email">이메일</label>
            <input id="email" type="email" placeholder="이메일을 입력하세요." required autoFocus onInput={(e) => {email.current = e.target.value}}/>
          </div>
          <div>
            <label htmlFor="password">비밀번호</label>
            <input id="password" type="password" placeholder="비밀번호를 입력하세요." minLength="8" maxLength="16" onInput={(e) => {password.current = e.target.value}}/>
          </div>
          <button onClick={login}>로그인</button>
        </div>
        <button onClick={() => {
          props.setModal(false);
          navigate("/signup");}}>회원가입</button>
        <span className="modal-close" onClick={() => { props.setModal(false) }}>X</span>
      </div>
    </div>
  )
}

export default Modal;