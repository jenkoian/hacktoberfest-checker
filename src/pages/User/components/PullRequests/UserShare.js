import React from 'react';

const UserShare = () => {

  return <React.Fragment>
    <Twitter/>,
    <FbRoot/>,
    <Facebook/>
  </React.Fragment>
};


const FbRoot = () => { 
  console.log('yep')
  return <div id="fb-root"></div>;
}

const Twitter = () => {
   window.twttr = (function (d, s, id) {
    var js,
      fjs = d.getElementsByTagName(s)[0],
      t = window.twttr || {};
    if (d.getElementById(id)) return t;
    js = d.createElement(s);
    js.id = id;
    js.src = 'https://platform.twitter.com/widgets.js';
    fjs.parentNode.insertBefore(js, fjs);

    t._e = [];
    t.ready = function (f) {
      t._e.push(f);
    };
    return t;
  })(document, 'script', 'twitter-wjs');
  return null;
};

const Facebook = () => {
  (function (d, s, id) {
    var js,
      fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = '//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.10';
    fjs.parentNode.insertBefore(js, fjs);
  })(document, 'script', 'facebook-jssdk');
  return null;
};

export default UserShare;
