import { useLocation, Router } from "react-router";
import { Suspense, useEffect, useState } from "react";
import { GithubHelper } from "@pages/content/components/expodium-helper/github-helper";

export default function App() {
  return (
    <Router location={location} navigator={undefined}>
      <ExpodiumHelper />
    </Router>
  );
}

const ExpodiumHelper = () => {
  const baseUrl = useBaseUrl();

  switch (baseUrl) {
    case "https://github.com":
      return (
        <Suspense fallback={<div>Loading...</div>}>
          <GithubHelper />
        </Suspense>
      );
  }
  return null;
};

const useBaseUrl = () => {
  const location = useLocation();

  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    setBaseUrl(
      `${window.location.protocol}//${window.location.hostname}${
        window.location.port ? `:${window.location.port}` : ""
      }`
    );
  }, [location]);
  return baseUrl;
};
