import React, { useState } from "react"; // Update import
import { useDispatch } from "react-redux";
import { likePost, addComment } from "../store/index.js";

export default function Post({ post }) {
  const dispatch = useDispatch();
  const [commentText, setCommentText] = useState("");

  const handleLike = () => {
    dispatch(likePost(post.id));
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentText) {
      dispatch(addComment(post.id, commentText));
      setCommentText("");
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-4 mb-4 rounded">
      <h3 className="font-bold">{post.title}</h3>
      <p>{post.body}</p>
      <button onClick={handleLike} className="bg-green-500 text-white p-1 mr-2">
        Like ({post.likes || 0})
      </button>
      <form onSubmit={handleCommentSubmit}>
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add comment"
          className="border p-1 bg-white text-black dark:bg-gray-700 dark:text-white"
        />
        <button type="submit" className="bg-blue-500 text-white p-1">
          Comment
        </button>
      </form>
      <ul>
        {post.comments?.map((c, i) => (
          <li key={i}>{c}</li>
        ))}
      </ul>
    </div>
  );
}
