import {
  generateCode,
  transcribeAudio,
} from "@pages/content/components/expodium-helper/text-to-code";
import { useRef, useState } from "react";
import { actions } from "@pages/content/components/expodium-helper/execute-commands";

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
      console.log(stringifyActions(actions));
      const codeKey = await generateCode({
        transcription: text,
        actions: stringifyActions(actions),
        html: document.documentElement.outerHTML,
      });
      console.log(codeKey);
      actions[codeKey]();

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
