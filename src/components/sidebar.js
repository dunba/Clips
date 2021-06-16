import React, { useState, useEffect, useRef } from "react";
import ShareIcon from "@material-ui/icons/Share";
import CommentIcon from "@material-ui/icons/Comment";
import { useAuth } from "../AuthContext";
import "../feed.css";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import ClipLoader from 'react-spinners/ClipLoader'
import CloseIcon from '@material-ui/icons/Close';

const Sidebar = ({ currentvid }) => {
  const commentRef = useRef();
  const currentUser = useAuth();

  const [iscommentvisible, setIscommentvisible] = useState(false);
  const commentHandler = () => {
    if (iscommentvisible === false) {
      setIscommentvisible(true);
      console.log("comments open");
    } else {
      setIscommentvisible(false);
    }
  };



  const [islikesvisible, setIslikesvisible] = useState(false);
  const showLikes = () => {
    if (islikesvisible === false) {
      setIslikesvisible(true);
      console.log("showing likes");
    } else {
      setIslikesvisible(false);
      console.log("hiding likes");
    }
  };
  //this section handles the like button on the side and top panel
  const [isliked, setIsLiked] = useState(false);
  // this function handles the state once the like button is pressed
  const likeHandler = () => {
    if (isliked) {
      setIsLiked(false);
      console.log("unliked");

    } else {
      setIsLiked(true);
      console.log("liked");
    }
  };

  const [loading, setLoading] = useState(false);

  const shareHandler = () => {
    let urlbase = 'localhost:300/watch/'
    let fullurl = urlbase + currentvid[0].id
    console.log('sharing video')
    console.log(fullurl)
    alert(fullurl)
  }

  if (loading) return <ClipLoader />

  return (
    <div>
      {currentvid[0] ?
        <div>
          <div className="descriptionsection"> {currentvid[0] && (currentvid[0].description)}</div>
          <div>{currentUser.email}</div>
          <div>
            {" "}
            <h3>{currentvid[0].scorer}</h3>
            <h3>{currentvid[0].team}</h3>
            <p> {currentvid[0].views.length} Views</p>
            <p onClick={showLikes}>
              {" "}
              <strong>{currentvid[0].likes.length}</strong> Likes
            </p>
            {islikesvisible ? (
              <p>
                Liked by{" "}
                <strong>

                  {currentvid[0].likes[Math.floor(Math.random() * currentvid[0].likes.length)].user}
                </strong>{" "}
                and <strong>{currentvid[0].likes.length - 1}</strong> others{" "}
              </p>
            ) : (
              ""
            )}
          </div>

          <div className="sidebar_icons">
            <div className="social_controls">
              {isliked ? (
                <FavoriteIcon id="iconn" onClick={likeHandler} fontSize="large" />
              ) : (
                <FavoriteBorderIcon
                  onClick={likeHandler}
                  id="iconn"
                  fontSize="large"
                />
              )}
              <ShareIcon id="iconn" fontSize="large" onClick={shareHandler} />
              <CommentIcon id="iconn" fontSize="large" onClick={commentHandler} />
              <strong>{currentvid[0].comments.length}</strong> Comments
            </div>
            <div className="commentssection">
              {iscommentvisible ? (
                <p>
                  <h1>Comments</h1><CloseIcon fontSize='large' onClick={() => setIscommentvisible(false)} />
                  {currentvid[0].comments.length == 0 ? '0 Comments' : 'Comments'}

                  {currentvid[0].comments.map(comment => (
                    <div className="comments">
                      <p>
                        <strong>{comment.name}. </strong>
                        {comment.posting}
                        <hr />{" "}
                      </p>
                    </div>
                  ))}{" "}
                  <div>
                    Add Commment...
                    <input ref={commentRef} type="text"></input>
                    <button>Post</button>
                  </div>
                </p>
              ) : (
                ""
              )}
            </div>
          </div>
        </div> : <ClipLoader />}
    </div>
  );
};

export default Sidebar;
