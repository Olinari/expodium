import ApiProvider, { IApiProvider } from "@src/api-provider/api-provider";

interface IGithubSerivce {
  getRepos: () => Promise<any>;
  searchRepos: (searchString: string) => Promise<any>;
  openPullRequest: (branchName: string) => Promise<any>;
}

class GithubService implements IGithubSerivce {
  public api: IApiProvider;

  constructor(api: IApiProvider) {
    this.api = api;
  }

  getRepos() {
    return this.api.get("/repos");
  }

  searchRepos(searchString: string) {
    return this.api.get(`/search/repositories?q=${searchString}`);
  }

  openPullRequest(branchName: string) {
    const repoFullName = "owner/repo"; // Replace with the actual owner and repository name
    const data = {
      title: "Pull Request Title",
      head: branchName,
      base: "master", // Replace with the target branch for the pull request
    };
    return this.api.post(`/repos/${repoFullName}/pulls`, data);
  }
}

const api = new ApiProvider({
  baseURL: import.meta.env.VITE_GITHUB_API_URL,
  token: import.meta.env.VITE_GITHUB_TOKEN,
});

const githubService = new GithubService(api.client);

export default githubService;
