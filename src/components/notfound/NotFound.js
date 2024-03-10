import React from 'react';
import "./NotFound.css"
import {Button} from "antd";
import {useNavigate} from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  const navigateLanding = () => {
    navigate('/landing');
  };


  return (
    <div className={"textWrapperHorizontalNotFound"}>
      <h1>404 Not Found  &#x1F50E;</h1>
      <p>The page you are looking for does not exist</p>
      <Button onClick={navigateLanding} type="primary" size={"large"}>Back to Website</Button>
    </div>
  );
};

export default NotFound;