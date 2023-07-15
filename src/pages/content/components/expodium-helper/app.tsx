import { useLocation, Router } from "react-router";
import { useEffect, useState } from "react";

export default function App() {
  return (
    <Router location={location} navigator={undefined}>
      <ExpodiumHelper />
    </Router>
  );
}

const ExpodiumHelper = () => {
  const baseUrl = useBaseUrl();
  console.log(baseUrl);
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
