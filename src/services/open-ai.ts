import { IApiProvider, ApiProvider } from "../api-provider";

interface IOpenAIService {
  transcribeAudio: (audioBlob: Blob) => Promise<string>;
  generateCodeFromText: ({
    transcription,
    html,
    actions,
  }: {
    transcription: string;
    html: string;
    actions: string;
  }) => Promise<any>;
  getEmbedding: ({ input }: { input: string }) => Promise<number[]>;
}

export class OpenAIService implements IOpenAIService {
  public api: IApiProvider;

  constructor() {
    this.api = new ApiProvider({
      baseURL: import.meta.env.VITE_OPENAI_API_URL as string,
      authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY as string}`,
    });
  }

  transcribeAudio = async (audioBlob: Blob): Promise<string> => {
    const data = new FormData();

    const file = new File([audioBlob], "recorded_audio.webm", {
      type: "audio/webm",
    });
    data.append("file", file);
    data.append("model", "whisper-1");
    data.append("language", "en");

    const response = await this.api.post("/v1/audio/transcriptions", data);

    return response?.text;
  };

  getActionFromText = async ({
    transcription,
    actions,
  }: {
    transcription: string;
    actions: string;
  }): Promise<any> => {
    const data = {
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an assistant that generates code snippets for the blind to surf the internet. Take a the JSON of functions, and the user's voice transcription. respond ONLY with an object of this structrue {key,args} where the key is the key of the correct answer function, and the args is a array of argument values declared in the function. a js object of the structure {key:string/*name of a function*/,args:string[]} and no more words.",
        },
        {
          role: "system",
          content: "the key-value pair object is " + actions,
        },
        {
          role: "user",
          content: "my request is" + transcription,
        },
      ],
    };

    const response = await this.api.post("/v1/chat/completions", data);

    console.log(response);

    return JSON.parse(response.choices[0].message.content);
  };

  getEmbedding = async ({ input }: { input: string }): Promise<number[]> => {
    const response = await this.api.post("v1/embeddings", {
      input,
      model: "text-embedding-ada-002",
    });

    return response.data[0].embedding as number[];
  };

  private async segmentHtmlByTokens(
    html: string,
    maxTokens = 8000
  ): Promise<string[]> {
    const segments: string[] = [];
    let currentSegment = "";
    let tokenCount = 0;
    console.log({ html });
    // Split the HTML into words/tags and iterate through them
    const parts = html.split(/\s+/);
    for (const part of parts) {
      const partTokens = part.length; // Rough estimate of tokens. A more precise method might be needed.

      if (tokenCount + partTokens > maxTokens) {
        segments.push(currentSegment.trim());
        currentSegment = "";
        tokenCount = 0;
      }

      currentSegment += part + " ";
      tokenCount += partTokens;
    }
    if (currentSegment.trim()) {
      segments.push(currentSegment.trim());
    }

    return segments;
  }
}
