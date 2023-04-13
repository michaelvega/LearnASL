import React from "react";
import "./BottomNav.css"
import {
  UserOutlined,
  SmileFilled,
  HomeOutlined,
  HomeFilled,
  GoldFilled,
  SettingFilled,
  ExperimentFilled,
} from "@ant-design/icons";



function BottomNav() {

  return (
    <div className={"bottomnavWrapper"}>
      <center>
        <div className="bottomnav">
          <a href="index.html"><HomeFilled /></a>
          <a href="about.html"><ExperimentFilled /></a>
          <a href="projects.html"><SmileFilled /></a>
          <a href="blog.html"><SettingFilled /></a>
        </div>
      </center>
    </div>

  );
}

export default BottomNav;
