import { useRef, useState } from "react";
import { OpenAIService } from "@src/services/open-ai";
const { transcribeAudio } = new OpenAIService();

export const VoiceControl = ({
  onVoiceInput,
}: {
  onInput: (text: string) => void;
}) => {
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
      onVoiceInput?.(text);
      audioChunksRef.current = []; // Clear the chunks after using them
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = (onVoiceInput) => {
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
        <button onClick={startRecording}>⬤ </button>
      )}
    </div>
  );
};
