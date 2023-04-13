import React from "react";

function Card({ title, image, description }) {
  return (
    <div className="card">
      <div className="card-image" style={{ backgroundImage: `url(${image})` }} />
      <div className="card-body">
        <h4 className="card-title">{title}</h4>
        <p className="card-description">{description}</p>
      </div>
    </div>
  );
}

export default Card;