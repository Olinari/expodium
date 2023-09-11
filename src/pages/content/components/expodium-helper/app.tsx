import { useRef, useState } from "react";
import { actions } from "@pages/content/components/expodium-helper/execute-commands";
import { OpenAIService } from "@src/services/open-ai";

const { generateCodeFromText, transcribeAudio } = new OpenAIService();

const App = () => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current);
      const text = await transcribeAudio(audioBlob);

      const { key, args } = await generateCodeFromText({
        transcription: text,
        actions: stringifyActions(actions),
        html: document.documentElement.outerHTML,
      });
      console.log(key, args);
      actions[key](...args);

      audioChunksRef.current = []; // Clear the chunks after using them
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div>
      {isRecording ? (
        <button onClick={stopRecording}>Stop </button>
      ) : (
        <button onClick={startRecording}>Start </button>
      )}
    </div>
  );
};

const stringifyActions = (obj) =>
  JSON.stringify(obj, (key, value) => {
    if (typeof value === "function") {
      return value.toString();
    }
    return value;
  });

export default App;
