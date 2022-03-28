import React from "react";
import { useQuery, gql } from "@apollo/client";
import { Link, useParams } from "react-router-dom";
import Spinner from "./Spinner";

const PEOPLE_QUERY = gql`
  query PeoplesQuery($id: Int!) {
    getPerson(id: $id) {
      name
      height
      mass
      gender
      homeworld
    }
  }
`;

const PeopleDetails = () => {
  let { id } = useParams();
  id = parseInt(id);

  const { loading, error, data } = useQuery(PEOPLE_QUERY, {
    variables: { id },
  });

  if (loading)
    return (
      <div className="d-flex align-items-center justify-content-center mt-5">
        <Spinner />
      </div>
    );
  if (error) console.log(error);

  const { name, height, mass, gender, homeworld } = data.getPerson;

  return (
    <div>
      <h1 className="display-4 my-3">
        <span className="text-dark">Name:</span>
        {name}
      </h1>
      <h4 className="mb-3">Person Details</h4>
      <ul className="list-group">
        <li className="list-group-item">
          Height: <span className="text-primary">{height}</span>
        </li>
        <li className="list-group-item">
          Mass: <span className="text-primary">{mass}</span>
        </li>
        <li className="list-group-item">
          Gender: <span className="text-primary">{gender}</span>
        </li>
        <li className="list-group-item">
          Homeworld: <span className="text-primary">{homeworld}</span>
        </li>
      </ul>
      <hr />
      <Link to="/" className="btn btn-secondary">
        Back
      </Link>
    </div>
  );
};

export default PeopleDetails;
