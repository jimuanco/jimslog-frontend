import axios from "axios";
import { useEffect, useState } from "react"
import { Link } from "react-router-dom";

const Home = (props) => {

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get("/api/posts?page=1&size=5")
      .then((response) => {
        setPosts(response.data.data);
      });
  }, []);

  return (
    <div>
      <ul>
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
      { props.userRole === "ADMIN" && <Link to="write">글 작성</Link> }
    </div>
  )
}

export default Home;