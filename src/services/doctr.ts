import { IApiProvider, ApiProvider } from "../api-provider";
import { getByText } from "@src/utils/webpage-utils";

interface IAnalyzeResponse {
  text: string;
  confidence: number;
}

export class DoctrService {
  private api: IApiProvider;

  constructor(baseURL = `https://127.0.0.1:8000`) {
    this.api = new ApiProvider({ baseURL });
  }

  analyzeImage = async (
    image: File | Blob
  ): Promise<IAnalyzeResponse | null> => {
    console.log(image);

    const formData = new FormData();
    formData.append("file", image, "uploaded_image.png");

    try {
      console.log("Analyzing image...");
      const response = await this.api.post("/ocr", formData);
      console.log(response);
      return response.predictions;
    } catch (error) {
      console.error("Error analyzing image:", error);
      return null;
    }
  };
}
