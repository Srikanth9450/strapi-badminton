import React, { memo,useEffect,useState } from 'react';
// import PropTypes from 'prop-types';
import pluginId from '../../pluginId';
import {request} from "strapi-helper-plugin"


const HomePage = () => {
  
  return (
    <div>
      <h1>{pluginId}&apos;s HomePage</h1> 
      <p>love coding</p>
    </div>
  );
  };
export default memo(HomePage);
