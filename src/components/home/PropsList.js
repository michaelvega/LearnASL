import React from "react";
import "./PropsList.css"
import {CheckCircleFilled} from "@ant-design/icons";

function PropsList({ props }) {
  return (
    <div className="list">
      {props.map((prop, index) => (
        <div key={index} className="list-item">
          <CheckCircleFilled style={{ color: "green" }}/>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <a href={`/practice/${prop.id}`}> <h3 className="title" >{prop.title}</h3> </a>
            <p style={{ margin: 0 }}>{prop.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PropsList;