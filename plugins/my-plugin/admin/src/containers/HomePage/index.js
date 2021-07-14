import React, { memo,useEffect,useState } from 'react';
// import PropTypes from 'prop-types';
import pluginId from '../../pluginId';
import axios from 'axios';



const HomePage = async() => {
  
  var x = await axios.get('http://localhost:1337/my-plugin/maximumslot')
  return (
    <div>
      <h1>{pluginId}&apos;s HomePage</h1> 
      <p>love coding{x}</p>
    </div>
  );
  };
export default memo(HomePage);
