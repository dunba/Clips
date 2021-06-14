import React, { useState, useEffect } from 'react'
import '../feed.css'
import { Link } from 'react-router-dom';


const Picholder = ({ goalvids, clickHandler, servervideos }) => {

    return (
        <div>

            Playlist<div className='sidepanelholder'>
                {servervideos.map(pic => (<div className='sidepanel'><Link to={`/watch/${pic.id}`}><img alt={pic.description} onClick={clickHandler} mycustomattribute={pic.id} id='thumbnail' src={pic.thumbnail} /></Link>
                    <div class="overlay">
                        <div class="text">{pic.scorer}</div>

                    </div></div>

                ))}

            </div>
        </div>
    )
}

export default Picholder
