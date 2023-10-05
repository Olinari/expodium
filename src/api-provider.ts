import axios, { AxiosInstance } from "axios";

export interface IApiProvider {
  get: (path: string) => Promise<any>;
  post: (path: string, payload: any) => Promise<any>;
  put: (path: string, payload: any) => Promise<any>;
  delete: (path: string) => Promise<any>;
  search?: (path: string, searchTerm: string) => Promise<any>;
}

export class ApiProvider implements IApiProvider {
  public client: AxiosInstance;

  constructor({
    baseURL,
    authorization,
  }: {
    baseURL: string;
    authorization?: string;
  }) {
    this.client = axios.create({
      baseURL,
      headers: {
        Authorization: authorization,
        "Content-Type": "application/json",
      },
    });
  }

  get(path: string) {
    return this.client.get(path).then((response) => response.data);
  }

  post(path: string, payload: any) {
    const config: { headers?: any } = {};

    console.log(this.client.defaults.headers);

    if (payload instanceof FormData) {
      config.headers = {
        ...this.client.defaults.headers,
        "Content-Type": undefined,
      };
    }

    return this.client
      .post(path, payload, config)
      .then((response) => response.data);
  }
  put(path: string, payload: any) {
    return this.client.put(path, payload).then((response) => response.data);
  }

  delete(path: string) {
    return this.client.delete(path).then((response) => response.data);
  }
}
