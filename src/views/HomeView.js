import axios from "axios";
import { useEffect, useRef, useState } from "react"
import Pagination from "react-js-pagination";
import { Link, useNavigate } from "react-router-dom";

const Home = (props) => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const postTitleRefs = useRef([]);
  let matchThumbnail;

  const[page, setPage] = useState(1);

  const handlePageChange = (page) => {
    setPage(page);
  }

  useEffect(() => {
    axios.get("/api/posts?page=1&size=5")
      .then((response) => {
        setPosts(response.data.data);
        props.setCountPosts(response.data.data.length);
      });
  }, []);

  const addUnderlineToTitle = (index) => {
    postTitleRefs.current[index].style.textDecoration = "underline";
  }

  const deleteUnderlineTotile = (index) => {
    postTitleRefs.current[index].style.textDecoration = "none";
  }

  return (
    <div className="main-post">
      <h3 className="main-post-title">전체글({props.countPosts})</h3>
      <ul className="main-post-lists">
          {posts.length > 0 && posts.map((post, index) => 
            <li key={post.id}>
              <div className="main-post-card" onClick={() => {
                navigate(`/read/${post.id}`);
              }} onMouseOver={() => addUnderlineToTitle(index)} onMouseOut={() => deleteUnderlineTotile(index)}>
                <div className="thumbnail">
                  {
                    (() => {
                      matchThumbnail = post.content.match(/\!\[(.*?)\]\((.*?)\)/);
                      return (
                        <div style={{position: "absolute", top: "0", left: "0", width: "100%", height: "100%", backgroundColor: "#f0f0f0", backgroundImage: matchThumbnail && `url(${matchThumbnail[2]})`, backgroundPosition: matchThumbnail && "center center", backgroundRepeat: matchThumbnail && "no-repeat", backgroundSize: matchThumbnail && "cover"}}></div>
                      );
                    })()
                  }
                </div>
                <div className="main-post-text">
                  <div className="post-title">
                    <h3 ref={(el) => postTitleRefs.current[index] = el}>{post.title}</h3>
                  </div>
                  <p className="post-content">
                    {post.content.replace(/\!\[(.*?)\]\((.*?)\)/g, '').replace(/<span[^>]*>(.*?)<\/span>/g, '$1')}
                  </p>
                </div>
              </div>
            </li>
          )}
      </ul>
      { props.userRole === "ADMIN" && <Link className="write-post-button" to="write">글 작성</Link> }
      <Pagination
        activePage={page}
        itemsCountperPage={5}
        totalItemsCount={20}
        pageRangeDisplayed={5}
        prevPageText={"<"}
        nextPageText={">"}
        onChange={handlePageChange}
      />
    </div>
  )
}

export default Home;