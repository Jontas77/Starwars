import React from "react";
import { useQuery, gql } from "@apollo/client";
import Spinner from "./Spinner";
import PeopleItem from "./PeopleItem";
import NextPage from "./NextPage";

const PEOPLE_QUERY = gql`
  query PeoplesQuery {
    people {
      name
      height
      mass
      gender
      homeworld
    }
  }
`;

const StarWarsPeople = () => {
  const { loading, error, data } = useQuery(PEOPLE_QUERY);

  if (loading)
    return (
      <div className="d-flex align-items-center justify-content-center mt-5">
        <Spinner />
      </div>
    );
  if (error) console.log(error);

  return (
    <>
      <h1 className="display-4 my-3">StarWars People</h1>
      <>
        {data.people.map((person, idx) => (
          <PeopleItem key={idx + 1} person={person} id={idx + 1} />
        ))}
      </>
      <NextPage />
    </>
  );
};

export default StarWarsPeople;
