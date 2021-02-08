import React, { useState } from "react";
import useFetchJobs from "./useFetchJobs";
import { Container } from "react-bootstrap";
import Job from "./components/Job";
import JobPagination from "./components/JobPagination";
import SearchForm from "./components/SearchForm";

function App() {
  const [params, setparams] = useState({});
  const [page, setpage] = useState(1);
  const { jobs, loading, error, hasNextPage } = useFetchJobs(params, page);

  const handelParamChange = (e) => {
    const param = e.target.name;
    const value = e.target.value;
    setpage(1);
    setparams((prevParams) => {
      return { ...prevParams, [param]: value };
    });
  };
  return (
    <Container className="my-4">
      <h1 className="mb-4">GitHub Jobs </h1>
      <SearchForm
        params={params}
        onParamChange={handelParamChange}
      ></SearchForm>
      <JobPagination
        page={page}
        setPage={setpage}
        hasNextPage={hasNextPage}
      ></JobPagination>
      {loading && <h1>Loading...</h1>}
      {error && <h1>Error.Try refreshing.</h1>}
      {jobs.map((job) => {
        return <Job key={job.id} job={job}></Job>;
      })}
      <JobPagination
        page={page}
        setPage={setpage}
        hasNextPage={hasNextPage}
      ></JobPagination>
    </Container>
  );
}

export default App;
