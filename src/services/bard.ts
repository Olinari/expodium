import { IApiProvider, ApiProvider } from "../api-provider";

interface IBardChat {
  create: () => Promise<IBardChat>;
  text: (message: string) => Promise<string>;
  image: (image: File | Blob, prompt: string) => Promise<any>;
  end: () => Promise<string>;
}

export class BardService {
  public api: IApiProvider;
  public chat: IBardChat;

  constructor() {
    this.api = new ApiProvider({
      baseURL: `https://127.0.0.1:8000`,
    });

    this.chat = {
      create: async (): Promise<IBardChat> => {
        const response = await this.api.post("/start_session");
        if (response.ok) {
          console.log("chat initialized!");
          return this.chat;
        } else {
          console.log(response);
          throw new Error(`Failed to initialize session`);
        }
      },
      text: async (message: string): Promise<string> => {
        try {
          console.log(`user: ${message}`);
          const response = await this.api.post("/chat", {
            type: "text",
            message: message,
          });
          console.log(`bot: ${response}`);
          return response;
        } catch (error) {
          console.error(error);
        }
      },
      image: async (
        image: File | Blob,
        prompt: string
      ): Promise<{ audio: any; response: string }> => {
        const formData = new FormData();
        formData.append("type", "image");
        formData.append("image", image);
        formData.append("prompt", prompt);

        try {
          console.log(`user: ${prompt} +attached image`);
          const response = await this.api.post("/chat", formData);
          console.log(`bot: ${response}`);
          return response as { audio: any; response: string };
        } catch (error) {
          console.error(error);
        }
      },
      end: async (): Promise<string> => {
        try {
          const response = await this.api.post("/end_session");
          if (response.status === 200) {
            return "Session ended successfully";
          } else {
            throw new Error("Failed to end session");
          }
        } catch (error) {
          console.log(error);
        }
      },
    };
  }
  analyzeImage = async (
    image: File | Blob,
    prompt: string
  ): Promise<string> => {
    console.log("analyze_image", { image });
    const formData = new FormData();
    formData.append("image", image);
    formData.append("prompt", prompt);

    try {
      console.log("Analyzing image...");
      const response = await this.api.post("/analyze_image", formData);
      return response;
    } catch (error) {
      console.error("Error analyzing image:", error);
    }
  };
}
