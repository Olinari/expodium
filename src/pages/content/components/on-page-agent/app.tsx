import { actions } from "@pages/content/components/on-page-agent/actions";
import { OpenAIService } from "@src/services/open-ai";
import { VoiceToText } from "@pages/content/components/on-page-agent/voice-to-text";
import Screenshot from "@pages/content/components/on-page-agent/screenshot";
const { generateCodeFromText } = new OpenAIService();

const stringifyActions = (obj) =>
  JSON.stringify(obj, (key, value) => {
    if (typeof value === "function") {
      return value.toString();
    }
    return value;
  });

export default function App() {
  document.addEventListener("keypress", async () => {
    fetch("https://127.0.0.1:8000/analyze_image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Your payload here
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
  const handleUserRequest = async (text) => {
    const { key, args } = await generateCodeFromText({
      transcription: text,
      actions: stringifyActions(actions),
    });
    actions[key](...args);
  };

  return (
    <>
      <VoiceToText onInput={handleUserRequest} />
      <Screenshot />
    </>
  );
}
