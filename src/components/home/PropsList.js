import React from "react";
import "./PropsList.css"
import {CheckCircleFilled} from "@ant-design/icons";
import { Link } from 'react-router-dom';

function PropsList({ props }) {
  return (
    <div className="list">
      {props.map((prop, index) => (
        <div key={index} className="list-item">
          <CheckCircleFilled style={{ color: "green" }}/>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Link to={`/practice/${prop.id}`}> <h3 className="title" >{prop.title}</h3> </Link>
            <p style={{ margin: 0 }}>{prop.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PropsList;