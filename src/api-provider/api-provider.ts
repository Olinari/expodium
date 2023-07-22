import axios from "axios";

export interface IApiProvider {
  get: (path: string) => Promise<any>;
  post: (path: string, payload: any) => Promise<any>;
  put: (path: string, payload: any) => Promise<any>;
  delete: (path: string) => Promise<any>;
  search?: (path: string, searchTerm: string) => Promise<any>;
}

export default class ApiProvider implements IApiProvider {
  public client;

  constructor({ baseURL, token }: { baseURL: string; token: string }) {
    this.client = axios.create({
      baseURL,
      headers: {
        Authorization: `token: ${token}`,
        "Content-Type": "application/json",
      },
    });
  }

  get(path: string) {
    return this.client.get(path).then((response) => response.data);
  }

  post(path: string, payload: any) {
    return this.client.post(path, payload).then((response) => response.data);
  }

  put(path: string, payload: any) {
    return this.client.put(path, payload).then((response) => response.data);
  }

  delete(path: string) {
    return this.client.delete(path).then((response) => response.data);
  }
}
