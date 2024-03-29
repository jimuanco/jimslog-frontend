import axios from "axios";
import { useEffect, useRef, useState } from "react"
import Pagination from "react-js-pagination";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";

const Home = (props) => {
  const {mainMenuId, subMenuId} = useParams();
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const postTitleRefs = useRef([]);
  let matchThumbnail;

  const [searchParams] = useSearchParams();
  const[page, setPage] = useState(1);

  const handlePageChange = (page) => {
    if(page === 1) {
      searchParams.get("page") ? navigate("") : navigate("", {replace: true});
    } else {
      parseInt(searchParams.get("page")) === page ? navigate(`?page=${page}`, {replace: true}) : navigate(`?page=${page}`);
    }
  }
  
  const location = useLocation();

  useEffect(() => {
    searchParams.get("page") ? fetchPosts(parseInt(searchParams.get("page"))) : fetchPosts(1);
    window.scrollTo(0, 0);
  }, [location.key]);

  const fetchPosts = (page) => {
    let menuId = 0;
    if(subMenuId !== undefined) {
      menuId = subMenuId;
    } else if(mainMenuId !== undefined) {
      menuId = mainMenuId;
    }
    axios.get(process.env.REACT_APP_API_URL + `/posts?page=${page}&size=5&menu=${menuId}`)
      .then((response) => {
        setPosts(response.data.data);
        setPage(page);
      });
  }

  const addUnderlineToTitle = (index) => {
    postTitleRefs.current[index].style.textDecoration = "underline";
  }

  const deleteUnderlineToTiTle = (index) => {
    postTitleRefs.current[index].style.textDecoration = "none";
  }

  return (
    <div className="main-post">
      <h3 className="main-post-title">{props.postPageTitle}</h3>
      <ul className="main-post-lists">
          {posts.length > 0 && posts.map((post, index) => 
            <li key={post.id}>
              <div className="main-post-card" onClick={() => {
                navigate(`/read/${post.id}`);
              }} onMouseOver={() => addUnderlineToTitle(index)} onMouseOut={() => deleteUnderlineToTiTle(index)}>
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
                  <span className="post-date">{new Date(post.createdDateTime).toLocaleDateString()}</span>
                  <p className="post-content">
                    {post.content.replace(/\!\[(.*?)\]\((.*?)\)/g, '').replace(/<span[^>]*>(.*?)<\/span>/g, '$1')}
                  </p>
                </div>
              </div>
            </li>
          )}
      </ul>
      { props.userRole === "ADMIN" && props.menus.length > 0 && <Link className="write-post-button" to="/write">글 작성</Link> }
      <Pagination
        activePage={page}
        itemsCountPerPage={5}
        totalItemsCount={props.countPerMenu}
        pageRangeDisplayed={5}
        prevPageText={"‹"}
        nextPageText={"›"}
        onChange={handlePageChange}
      />
    </div>
  )
}

export default Home;