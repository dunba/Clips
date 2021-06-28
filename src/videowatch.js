import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import ClipLoader from 'react-spinners/ClipLoader'
import firebase from './firebase'
import { useAuth } from './AuthContext'
import './feed.css'
import Nav2 from './Nav2'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Video from './video'

import Picholder from './components/picholder'
import Sidebar from './components/sidebar'
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import VolumeMuteIcon from '@material-ui/icons/VolumeMute';


//this main feed displays video & information from database
const VideoWatch = ({ match }) => {
    const history = useHistory();
    const currentUser = useAuth();

    const videoId = match.params.id;

    const [servervideos, setServerVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const videosRef = firebase.firestore().collection("videos");





    const currentvid = servervideos.filter(video => video.id == videoId)

    const [currenttype, setCurrentType] = useState(null);
    const fetchCurrentType = (video) => {
        if (video.club === true) {
            // return 'club'
            console.log('club')
        } else if (video.international) {
            //  return 'international'
            console.log('international')
        } else if (video.interview) {
            //  return 'interview'
            console.log('interview')
        }
    }





    //this will fetch videos from the server
    const fetchDocs = () => {
        console.log(videosRef);
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
    const [userDisplayName, setUserDisplayName] = useState('')

    const fetchUserData = async (user) => {
        console.log('fetching user data')
        const userRef = usersRef.doc(`/${user.uid}`);
        const snapshot = await userRef.get()
        if (snapshot.exists) {
            console.log(snapshot.data().displayName)
            setUserDisplayName(snapshot.data().displayName)
            setLikeNum(snapshot.data().userlikes.length)
            //  history.push('/')
        }
        else {


        }
    }
    //this will run everytime the page loads to fetch user data
    useEffect(() => {
        fetchDocs();
        fetchUserData(currentUser.currentUser);
        console.log(currentvid)

    }, [])









    //this handles the playlist picture gallery, retrieves info from the DOM
    const clickHandler = (e) => {
        console.log(e)
        videoRef.current.pause();
        setPlaying(false);

        //console.log(e.target.attributes[1].value)
        //setIdnumber(e.target.attributes[1].value)
        // setCurrentVid(goalvids[idnumber])

    }



    const [likenum, setLikeNum] = useState(0)


    ///video stuff
    const [ismuted, setIsmuted] = useState(false)
    const onVolumePress = () => {
        if (ismuted) {
            videoRef.current.muted = false;
            setIsmuted(false)
            console.log('unmuted!')

        } else {
            videoRef.current.muted = true;
            setIsmuted(true)

            console.log('muted!')
        }
    }

    const [playing, setPlaying] = useState(false)

    const videoRef = useRef(null)

    const onVidPress = () => {
        if (playing) {
            videoRef.current.pause();
            setPlaying(false);
        } else {
            videoRef.current.play();
            setPlaying(true);
        }
    }
    if (loading) return <ClipLoader />

    return (

        <div className='flexcontainer'>
            <div onClick={() => history.push('/')} > <ArrowBackIcon />BACK</div>

            {/* <button className='backbutton' >Back</button> */}

            <div className='mediacontainer'>
                <div className='videoholder'>
                    {currentvid[0] ?
                        <video src={currentvid[0].url} loop onclick={onVidPress} ref={videoRef}>Cannot Render Video</video> : <ClipLoader />}

                    <div className='vid_controls'>

                        {playing ? <PauseIcon id='iconn' onClick={onVidPress} fontSize='large' /> : <PlayArrowIcon id='iconn' onClick={onVidPress} fontSize='large' />}
                        {ismuted ? <VolumeMuteIcon onClick={onVolumePress} id='iconn' fontSize='large' /> : <VolumeUpIcon onClick={onVolumePress} id='iconn' fontSize='large' />}
                    </div>

                </div>

                <div className='videosidebar'>
                    <Sidebar videoId={videoId} videosRef={videosRef} userDisplayName={userDisplayName} currentvid={currentvid} />
                </div>


            </div >

            <div className='picholder'> <Picholder servervideos={servervideos} currentvid={currentvid} clickHandler={clickHandler} /></div>
        </div >


    )
};
export default VideoWatch;
