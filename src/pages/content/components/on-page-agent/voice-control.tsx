import { useRef, useState, useEffect } from "react";
import { OpenAIService } from "@src/services/open-ai";
const { transcribeAudio } = new OpenAIService();

interface VoiceControlProps {
  onInput: (text: string) => void;
}

export const VoiceControl = ({ onInput }: VoiceControlProps) => {
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
      onInput?.(text);
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

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === "Space" && !isRecording) {
        startRecording();
      }
    };

    const handleKeyUp = (event) => {
      if (event.code === "Space" && isRecording) {
        stopRecording();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isRecording]);

  return null; // No UI element to render since it's all controlled by the space key
};
