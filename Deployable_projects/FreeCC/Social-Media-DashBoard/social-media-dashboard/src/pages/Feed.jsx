import React, { Component } from "react"; // Update import
import { useDispatch, useSelector } from "react-redux";
import Post from "../components/Post.jsx";
import PostForm from "../components/PostForm.jsx";
import { setUsers } from "../store/index.js";
import { usePosts } from "../hooks/usePosts.js";
import { cssJokeUsers } from "../data/mockSocialData.js";

// Functional wrapper for hooks
function FeedContent() {
  const posts = usePosts();
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(setUsers(cssJokeUsers));

    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        console.log("Load more posts...");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dispatch]);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <PostForm />
      <div>
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

export default class Feed extends Component {
  componentDidMount() {
    this.interval = setInterval(() => {
      console.log("Checking for new posts...");
    }, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return <FeedContent />;
  }
}
