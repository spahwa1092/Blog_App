import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import "./request.css";
import { useLocation, useHistory } from "react-router";
import { Link } from "react-router-dom";
import { Context } from "../../context/Context";

export default function RequestPage() {
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const { user } = useContext(Context);
  const history = useHistory();

  const fetchPosts = async () => {
    try {
      const res = await axios.get("/access/?admin=false",
    );
      setPosts(res.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleApprove = async (postId) => {
    try {
      await axios.put(`/access/${postId}`, { admin: true });
      console.log("Post approved");
      fetchPosts();
    } catch (error) {
      console.error("Error approving post:", error);
    }
  };

  const handleDecline = async (postId) => {
    try {
      await axios.delete(`/access/${postId}`);
      console.log("Post declined");
      fetchPosts();
    } catch (error) {
      console.error("Error declining post:", error);
    }
  };
  

  return (
    <div>
      <h1>Request Page</h1>
      {posts.map((post) => (
        <div key={post._id} className="post-container">
          <h2 className="post-title">{post.title}</h2>
          <p className="post-content">{post.body}</p>
          <div className="button-container">
            <button className="approve-button" onClick={() => handleApprove(post._id)}>
              Approve
            </button>
            <button className="decline-button" onClick={() => handleDecline(post._id)}>
              Decline
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
