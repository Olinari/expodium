import { IApiProvider, ApiProvider } from "../api-provider";

interface IBardService {
  analyzeImage: (image: File | Blob, prompt: string) => Promise<string>;
}

export class BardService implements IBardService {
  public api: IApiProvider;

  constructor() {
    this.api = new ApiProvider({
      baseURL: `https://127.0.0.1:8000`,
    });
  }

  analyzeImage = async (
    image: File | Blob,
    prompt: string
  ): Promise<string> => {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("prompt", prompt);

    try {
      const response = await this.api.post("/analyze_image", formData);
      return response?.text;
    } catch (error) {
      console.error("Error analyzing image:", error);
      throw error;
    }
  };
}
