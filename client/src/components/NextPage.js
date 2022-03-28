import React, { useState } from "react";
// import { Link } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import Spinner from "./Spinner";

const PAGINATION_QUERY = gql`
  query NextPageQuery($afterCursor: String) {
    nextPeople(first: 10, afterCursor: $afterCursor) {
      totalCount
      pageInfo {
        startCursor
        endCursor
        hasNextPage
      }
      edges {
        node {
          name
          height
          mass
          gender
          homeworld
        }
        cursor
      }
    }
  }
`;

const NextPage = () => {
  const [page, setPage] = useState(1);

  const { loading, error, data, fetchMore } = useQuery(PAGINATION_QUERY, {
    variables: { afterCursor: null },
  });

  const fetchMoreData = () => {
    const { endCursor } = data.nextPeople.pageInfo;

    fetchMore({
      variables: { afterCursor: endCursor },
      updateQuery: (prevResult, { fetchMoreResult }) => {
        fetchMoreResult.nextPeople.edges = [
          ...prevResult.nextPeople.edges,
          ...fetchMoreResult.nextPeople.edges,
        ];
        return fetchMoreResult;
      },
    });
  };

  if (loading)
    return (
      <div className="d-flex align-items-center justify-content-center mt-5">
        <Spinner />
      </div>
    );
  if (error) console.log(error);

  return (
    <div className="d-flex justify-content-end">
      <button
        className="btn btn-secondary"
        onClick={() => {
          setPage((x) => x + 1);
          fetchMoreData();
        }}
      >
        Next
      </button>
    </div>
  );
};

export default NextPage;
