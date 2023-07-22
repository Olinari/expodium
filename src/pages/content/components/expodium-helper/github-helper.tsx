import { useLocation } from "react-router";
import GithubService from "@src/services/github-service";
import { useSuspense } from "@src/api-provider/use-suspense";
import { useEffect } from "react";

export const GithubHelper = () => {
  const location = useLocation();

  const repos = useSuspense(GithubService.getRepos.bind(GithubService), []);
  console.log(repos);
  return null;
};
