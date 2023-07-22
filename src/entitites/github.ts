export interface GithubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string;
  company: string;
  location: string;
  email: string;
  bio: string;
}

export interface GithubOrganization extends GithubUser {
  description: string;
  blog: string;
  members_url: string;
}

export interface GithubRepository {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
}

export interface githubCommit {
  sha: string;
  contributors: GithubUser;
  reviewers: GithubUser[];
  reviews: {
    id: number;
    user: GithubUser;
    body: string;
    state: string;
    html_url: string;
  }[];

  commit: {
    date: string;
    message: string;
    diffLocaion: string;
  };
}

export interface githubBranch {
  name: string;
  commit: {
    sha: string;
    url: string;
  };
}

export interface GithubPullRequest {}

export interface GithubIssue {
  id: number;
  title: string;
  html_url: string;
  state: string;
  created_at: string;
  updated_at: string;
  closed_at: string;
}
