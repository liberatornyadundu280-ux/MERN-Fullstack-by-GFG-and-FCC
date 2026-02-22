import React, { useEffect } from "react"; // Add import
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../store/index.js";
import { cssJokePosts } from "../data/mockSocialData.js";

export const usePosts = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(setPosts(cssJokePosts));
  }, [dispatch]);

  return posts;
};
