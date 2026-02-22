import { createStore, combineReducers } from "redux";

// Actions
export const addPost = (post) => ({ type: "ADD_POST", payload: post });
export const likePost = (postId) => ({ type: "LIKE_POST", payload: postId });
export const addComment = (postId, comment) => ({
  type: "ADD_COMMENT",
  payload: { postId, comment },
});
export const followUser = (userId) => ({
  type: "FOLLOW_USER",
  payload: userId,
});
export const setPosts = (posts) => ({ type: "SET_POSTS", payload: posts });
export const setUsers = (users) => ({ type: "SET_USERS", payload: users });

// Reducers
const postsReducer = (state = [], action) => {
  switch (action.type) {
    case "SET_POSTS":
      return action.payload;
    case "ADD_POST":
      return [action.payload, ...state];
    case "LIKE_POST":
      return state.map((post) =>
        post.id === action.payload
          ? { ...post, likes: (post.likes || 0) + 1 }
          : post,
      );
    case "ADD_COMMENT":
      return state.map((post) =>
        post.id === action.payload.postId
          ? {
              ...post,
              comments: [...(post.comments || []), action.payload.comment],
            }
          : post,
      );
    default:
      return state;
  }
};

const usersReducer = (state = [], action) => {
  switch (action.type) {
    case "SET_USERS":
      return action.payload;
    case "FOLLOW_USER":
      return state.map((user) =>
        user.id === action.payload ? { ...user, followed: true } : user,
      );
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  posts: postsReducer,
  users: usersReducer,
});

const store = createStore(rootReducer);

export default store;
