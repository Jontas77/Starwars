import React from "react";
import { Link } from "react-router-dom";

const PeopleItem = ({ person, id }) => {
  const { name } = person;
  return (
    <div className="card card-body mb-3">
      <div className="row">
        <div className="col-md-9">
          <h4>
            Name:{"  "} <span className="text-success">{name}</span>
          </h4>
        </div>
        <div className="col-md-3">
          <Link to={`/people/${id}`} className="btn btn-secondary">
            People Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PeopleItem;
