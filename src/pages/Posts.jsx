import { useEffect, useRef, useState } from "react";
import { usePosts } from "../hooks/usePosts";
import { useFetching } from "../hooks/useFetching";
import { getPageCount } from "../utils/pages";
import MyButton from "../components/UI/button/MyButton";
import Loader from "../components/UI/loader/Loader";
import Pagination from "../components/UI/pagination/Pagination";
import MyModal from "../components/UI/Mymodal/MyModal";
import PostService from "../API/PostService";
import PostForm from "../components/PostForm";
import PostFilter from "../components/PostFilter"

import PostList from "../components/PostList"
import '../styles/App.css'
import { useObserver } from "../hooks/useObserver";
import MySelect from "../components/UI/select/MySelect";

function Posts() {
  const [posts, setPosts] = useState([]);

  const [filter, setFilter] = useState({ sort: "", query: "" });
  const [modal, setModal] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const sortedAndSearchedPosts = usePosts(posts, filter.sort, filter.query);
  const lastElement = useRef()
  console.log(lastElement)

  const [fetchPosts, isPostsLoading, postError] = useFetching(
    async (limit, page) => {
      const response = await PostService.getAll(limit, page);
      setPosts([...posts, ...response.data]);
      const totalCount = response.headers["x-total-count"];
      setTotalPages(getPageCount(totalCount, limit));
    }
  );
  useObserver(lastElement, page < totalPages, isPostsLoading, () => {
  setPage(page + 1)
})

  useEffect(() => {
    fetchPosts(limit, page);
  }, [page, limit]);

  const createPost = (newPost) => {
    setPosts([...posts, newPost]);
    setModal(false);
  };

  const removePost = (post) => {
    setPosts(posts.filter((p) => p.id !== post.id));
  };

  const changePage = (page) => {
    setPage(page);
  };

  return (
    <div className="App">
      <MyButton style={{ marginTop: 30 }} onClick={() => setModal(true)}>
        Створити користувача
      </MyButton>
      <MyModal visible={modal} setVisible={setModal}>
        <PostForm create={createPost} />
      </MyModal>

      <hr style={{ margin: "15px 0" }}></hr>
      <PostFilter filter={filter} setFilter={setFilter} />

      <MySelect
        value={limit}
        onChange={value => setLimit(value)}
        defaultValue={"Кількість елементів на сторінці"}
        options={[
        {value: 5, name: "5"},
        {value: 10, name: "10"},
        {value: 25, name: "25"},
          { value: -1, name: "Показати всі" },
      ]} />
      {postError && <h1>Виникла помилка {postError}</h1>}
      <PostList remove={removePost} posts={sortedAndSearchedPosts} title="Пости про React" />
      <div ref={lastElement} style={{height: 20, background: "red"}}></div>
      {isPostsLoading && 
        <div style={{ display: "flex", justifyContent: "center", marginTop: "50px",}}><Loader /></div>
      }
      <Pagination page={page} changePage={changePage} totalPages={totalPages} />
    </div>
  );
}

export default Posts;
