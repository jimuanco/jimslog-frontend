import axios from "axios";
import { useEffect, useState } from "react"
import { Link } from "react-router-dom";

const Home = (props) => {

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get("/api/posts?page=1&size=5")
      .then((response) => {
        setPosts(response.data.data);
        props.setCountPosts(response.data.data.length);
      });
  }, []);

  return (
    <div className="main-post">
      <h3 className="main-post-title">전체글({props.countPosts})</h3>
      <ul className="main-post-lists">
          {posts.length > 0 && posts.map((post) => 
            <li key={post.id} >
              <div>
                <Link to={`/read/${post.id}`}>
                  <h3>{post.title}</h3>
                </Link>
              </div>
              <div>
                {post.content}
              </div>
            </li>
          )}
      </ul>
      { props.userRole === "ADMIN" && <Link className="write-post-button" to="write">글 작성</Link> }
    </div>
  )
}

export default Home;