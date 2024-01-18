import axios from "axios";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

const Login = (props) => {
  
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
        navigate("/", {replace: true})
      })
  }

  return (
    <div className="login-view">
      <div className="login-content">
        <div className="email-box">
          <input id="email" type="email" placeholder="이메일" autoFocus onInput={(e) => {email.current = e.target.value}}/>
        </div>
        <div className="password-box">
          <input id="password" type="password" placeholder="비밀번호" maxLength="16" onInput={(e) => {password.current = e.target.value}}/>
        </div>
      </div>
      <div className="button-box">
        <button className="login-button" onClick={login}>로그인</button>
        <button className="signup-button" onClick={() => navigate("/signup")}>회원가입</button>
      </div>
    </div>
  )
}

export default Login;