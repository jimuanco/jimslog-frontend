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
        navigate("/", {replace: true});
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
    <div>
      <h1>회원가입</h1>
      <div>
        <label htmlFor="name">이름</label>
        <input id="name" type="text" placeholder="이름을 입력하세요." required autoFocus onInput={(e) => {name.current = e.target.value}}/>

        <label htmlFor="email">이메일</label>
        <input id="email" type="email" placeholder="이메일을 입력하세요." required onInput={(e) => {email.current = e.target.value}}/>
        
        <label htmlFor="password">비밀번호</label>
        <input id="password" type="password" placeholder="비밀번호를 입력하세요." minLength="8" maxLength="16" onInput={(e) => {password.current = e.target.value}}/>
        
        <button disabled={isSubmitting} onClick={handleSubmit}>
          가입하기
        </button>
      </div>
    </div>
  )
}

export default Signup;