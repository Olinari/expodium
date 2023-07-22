import React, { useEffect } from "react";

import "@pages/newtab/Newtab.css";
import "@pages/newtab/Newtab.scss";

import GithubService from "@src/services/github-service";

export const Connections = () => {
  console.log("DF");
  return (
    <div className="App">
      <DeveloppersTools>
        <GithubConnector />
      </DeveloppersTools>
    </div>
  );
};

const DeveloppersTools = (props) => <div {...props} className="font-size-s" />;
const GithubConnector = () => {
  console.log("Df");
  useEffect(() => {
    const data = GithubService.getRepos();
    console.log(data);
  }, []);

  return <div></div>;
};
