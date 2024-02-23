import axios from "axios";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {

  const name = useRef("");
  const email = useRef("");
  const password = useRef("");
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const signup = async () => {
    await axios.post("/api/auth/signup", {
      name: name.current,
      email: email.current,
      password: password.current
    })
      .then(() => {
        navigate("/login", {replace: true});
      })
      .catch(() => {

      })
  }

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await signup();
    setIsSubmitting(false);
  }

  return (
    <div className="signup-view">
      <div className="signup-content">
        <div className="name-box">
          <input id="name" type="text" placeholder="이름" autoFocus onInput={(e) => {name.current = e.target.value}}/>
        </div>
        <div className="email-box">
          <input id="email" type="email" placeholder="이메일" required onInput={(e) => {email.current = e.target.value}}/>
        </div>
        <div className="password-box">
          <input id="password" type="password" placeholder="비밀번호" maxLength="16" onInput={(e) => {password.current = e.target.value}}/>
        </div>
      </div>
      <button disabled={isSubmitting} onClick={handleSubmit}>
        가입하기
      </button>
    </div>
  )
}

export default Signup;