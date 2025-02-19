import React, { useState, useEffect, useRef } from "react";
import { Alert } from "react-bootstrap";
import HomeIcon from "@material-ui/icons/Home";
import { useHistory } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import firebase from "./firebase";
import { useAuth } from "./AuthContext";
import "./feed.css";
import Nav2 from "./Nav2";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Video from "./video";
import Videosection from "./videosection";
import Picholder from "./components/picholder";
import Sidebar from "./components/sidebar";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";
import VolumeMuteIcon from "@material-ui/icons/VolumeMute";
import StopIcon from "@material-ui/icons/Stop";
import { motion } from "framer-motion";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import Ticker from "react-ticker";
import ShareIcon from "@material-ui/icons/Share";
import InfoIcon from '@material-ui/icons/Info';

//this main feed displays video & information from database
const VideoWatch = ({ match }) => {
  const history = useHistory();
  const currentUser = useAuth();

  const videoId = match.params.id;

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [servervideos, setServerVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const videosRef = firebase.firestore().collection("videos");

  const currentvid = servervideos.filter(video => video.id == videoId);




  //this will fetch videos from the server
  const fetchDocs = () => {
    setIsHovering(true);

    setLoading(true);
    videosRef.onSnapshot(snapshot => {
      const items = [];
      snapshot.forEach(doc => {
        items.push(doc.data());
      });
      setServerVideos(items);
      setLoading(false);
    });
  };

  const usersRef = firebase.firestore().collection("users");

  //this runs to validate userdata everytime the page is visited. on the first time, it will prompt user to enter info.
  const [userDisplayName, setUserDisplayName] = useState("");

  const fetchUserData = async user => {
    console.log("fetching user data");
    const userRef = usersRef.doc(`/${user.uid}`);
    const snapshot = await userRef.get();
    if (snapshot.exists) {
      for (let i = 0; i < snapshot.data().userlikes.length; i++) {
        if (snapshot.data().userlikes[i].id === videoId) {
          setIsLiked(true);
        }
      }
      console.log(snapshot.data().displayName);
      setUserDisplayName(snapshot.data().displayName);
      setLikeNum(snapshot.data().userlikes.length);
      //  history.push('/')
    }
  };
  //this will run everytime the page loads to fetch user data
  useEffect(async () => {
    await setIsHovering(false);
    await fetchDocs();
    await fetchUserData(currentUser.currentUser);
    await console.log(currentvid);
  }, []);

  const [isliked, setIsLiked] = useState(false);

  const serverLike = async (user, videoId, currentvid) => {
    if (!user) return;
    const userRef = usersRef.doc(`/${user.uid}`);
    const snapshot = await userRef.get();
    if (snapshot.exists) {
      try {
        userRef.update({
          userlikes: firebase.firestore.FieldValue.arrayUnion({
            id: videoId,
            data: currentvid,
          }),
        });
        setSuccess("videoliked");
        await setTimeout(()=>setSuccess(null),3000)
      } catch {
        setError("Error liking video");
      }
    }
  };

  const serverUnlike = async (user, videoId, currentvid) => {
    if (!user) return;
    const userRef = usersRef.doc(`/${user.uid}`);
    const snapshot = await userRef.get();
    if (snapshot.exists) {
      try {
        userRef.update({
          userlikes: firebase.firestore.FieldValue.arrayRemove({
            id: videoId,
            data: currentvid,
          }),
        });
        setSuccess("videounliked");
        await setTimeout(()=>setSuccess(null),3000)
      } catch {
        setError("Error to unLike video");
      }
    }
  };

  const likeHandler = () => {
    if (isliked) {
      setIsLiked(false);
      console.log("unliked");
      console.log(videoId);
      serverUnlike(currentUser.currentUser, videoId, currentvid);
    } else {
      setIsLiked(true);
      console.log("liked");
      console.log(videoId);
      serverLike(currentUser.currentUser, videoId, currentvid);
    }
  };

  //this handles the playlist picture gallery, retrieves info from the DOM
  const clickHandler = e => {
    console.log(e);
    videoRef.current.pause();
    setPlaying(false);

    //console.log(e.target.attributes[1].value)
    //setIdnumber(e.target.attributes[1].value)
    // setCurrentVid(goalvids[idnumber])
  };

  const [likenum, setLikeNum] = useState(0);

  ///video stuff
  const [ismuted, setIsmuted] = useState(false);
  const onVolumePress = () => {
    if (ismuted) {
      videoRef.current.muted = false;
      setIsmuted(false);
      console.log("unmuted!");
    } else {
      videoRef.current.muted = true;
      setIsmuted(true);

      console.log("muted!");
    }
  };

  const [playing, setPlaying] = useState(false);

  const videoRef = useRef(null);

  const onVidPress = () => {
    if (playing) {
      videoRef.current.pause();
      setPlaying(false);
    } else {
      videoRef.current.play();
      setPlaying(true);
    }
  };
  const stopHandler = () => {
    console.log(videoRef.current.duration);
    setPlaying(false);
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
  };

  //update progress and timestamp
  const [vidInfo, setVidInfo] = useState({ currentTime: null, duration: null });

  const timeUpdateHandler = e => {
      setLoading(false)
    const current = e.target.currentTime;
    const duration = e.target.duration;

    setVidInfo({ ...vidInfo, currentTime: current, duration });
  };

  const getTime = time => {
    return (
      Math.floor(time / 60) + ":" + ("0" + Math.floor(time % 60)).slice(-2)
    );
  };

  const dragHandler = e => {
    videoRef.current.currentTime = e.target.value;
    setVidInfo({ ...vidInfo, currentTime: e.target.value });
  };
  const [isHovering, setIsHovering] = useState(true);

  const [fullscreen, setFullscreen] = useState(false);
  const [fullscreenMode, setFullscreenMode] = useState(false);
  const fullScreenHandler = () => {
    if (!fullscreen) {
      setFullscreen(true);
      // setFullscreenMode(true);
    } else {
      setFullscreen(false);
      // setFullscreenMode(false);
    }
  };

  const  shareHandler = async () => {
    let urlbase = 'localhost:300/watch/'
    let urlcode = currentvid[0].id
    console.log('sharing video')
    //alert(fullurl)
    const fullurl = `${window.location.hostname}/watch/${urlcode}`
    alert(fullurl)
    document.execCommand('copy')
    setSuccess('Link copied to clipboard!')
    await setTimeout(()=>setSuccess(''),3000)
  }

const [isPopped,setIsPopped]=useState(false)
const popupHandler =()=>{
    isPopped?setIsPopped(false):setIsPopped(true);
}
  if (loading) return <ClipLoader />;

  return (
    <div style={{ backgroundColor: "black" }}>
      {/* <div > BACK</div> */}
      <div className="mediacontainer">
        <div
          className="videoholder"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* poster={currentvid[0].header} */}
          {currentvid[0] ? (
            <video 
            onCanPlay={()=>setLoading(false)}
              id="fullscreenvideo"
              onLoadedMetadata={timeUpdateHandler}
              onTimeUpdate={timeUpdateHandler}
              src={currentvid[0].url}
              loop
              onclick={onVidPress}
              ref={videoRef}
            >
              <ClipLoader />
            </video>
          ) : (
            <ClipLoader />
          )}
          {isHovering && (
            <motion.div
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, duration: 2 }}
              className="vidcontrols"
            >
                <div className="vignette"></div>
<div className='videoheader'><div style={{color:'white', fontWeight:'bold'}}>VOLLEY</div>              <div
                style={{ color:"white" }}
                className="backbutton"
                onClick={() => history.goBack()}
              >
                <ArrowBackIcon />
                BACK
              </div><div style={{color:'white', fontWeight:'bold'}}><InfoIcon id='infoicon' onClick={popupHandler}/></div></div>

            {isPopped&&(
              <motion.div className='infopopup' exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, duration: 2 }}>
                  <span>{currentvid[0].description}</span>
                  <span>Player:{currentvid[0].scorer}</span>
                 <span>Team:{currentvid[0].team}</span>
                 <span>Copyright:{currentvid[0].copyright}</span>
                 
              </motion.div>
)}
              <div className="pvpcontrols">
                {playing ? (
                  <PauseIcon
                    id="iconn2"
                    onClick={onVidPress}
                    fontSize="large"
                  />
                ) : (
                  <PlayArrowIcon
                    id="iconn2"
                    onClick={onVidPress}
                    fontSize="large"
                  />
                )}
                {ismuted ? (
                  <VolumeMuteIcon
                    onClick={onVolumePress}
                    id="iconn2"
                    fontSize="large"
                  />
                ) : (
                  <VolumeUpIcon
                    onClick={onVolumePress}
                    id="iconn2"
                    fontSize="large"
                  />
                )}
                <StopIcon id="iconn2" fontSize="large" onClick={stopHandler} />
                {isliked ? (
                  <FavoriteIcon
                    id="iconn2"
                    onClick={likeHandler}
                    fontSize="large"
                  />
                ) : (
                  <FavoriteBorderIcon
                    onClick={likeHandler}
                    id="iconn2"
                    fontSize="large"
                  />
                )}
                <div className="alerts">
                  {" "}
                  {error && <Alert variant="danger">{error}</Alert>}
                  {success && <Alert variant="success">{success}</Alert>}
                </div>
              </div>
              <div className="sliderdiv">
                <div className='timestamps'>
                  <div>{getTime(vidInfo.currentTime)}</div><div>{getTime(vidInfo.duration)}</div>
                  
                </div>
                <div className='sliderholder'>                <input
                  type="range"
                  id="inputslider"
                  onChange={dragHandler}
                  min={0}
                  max={vidInfo.duration}
                  step="0.1"
                  value={vidInfo.currentTime}
                /></div>





              </div> 
                              {currentvid[0] &&(
                                  
                  <div className="tickerholder">
                      <div><ShareIcon id='shareicon' onClick={shareHandler}/></div>
                   <div className="tickerdiv">
                    <Ticker speed={5} mode='smooth'>
                      {({ index }) => (
                        <>
                          <p><strong>© {currentvid[0].copyright}</strong> - Provided Under Exclusive License</p>
                        </>
                      )}
                    </Ticker>
 </div>
 <div>0 Views</div>
                  </div>
                )}</motion.div> )}
                
        </div>
      </div>
    </div>
  );
};
export default VideoWatch;
