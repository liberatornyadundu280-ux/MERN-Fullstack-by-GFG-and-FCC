import React, { useEffect } from "react"; // Update import
import { useDispatch, useSelector } from "react-redux";
import { followUser } from "../store/index.js";
import ProfileCard from "../components/ProfileCard.jsx";
import ToDoList from "../components/ToDoList.jsx";

export default function Profile() {
  const users = useSelector((state) => state.users);
  const dispatch = useDispatch();

  useEffect(() => {
    // Users already fetched in Feed
  }, []);

  return (
    <div className="p-4">
      <h2>Profile</h2>
      <ToDoList />
      <h3>CSS Stories to Follow</h3>
      <div className="grid grid-cols-2 gap-4">
        {users.map((user) => (
          <div key={user.id}>
            <ProfileCard user={user} />
            <button
              onClick={() => dispatch(followUser(user.id))}
              className="bg-blue-500 text-white p-1"
              disabled={user.followed}
            >
              {user.followed ? "Followed" : "Follow"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
