import { useRef, useState, useEffect } from "react";
import { OpenAIService } from "@src/services/open-ai";
import { useScreenShotContext } from "@pages/content/components/on-page-agent/screenshot-context";
import { actions } from "@pages/content/actions";
const { transcribeAudio } = new OpenAIService();

interface VoiceControlProps {
  onInput: (text: string) => void;
}

const VoiceControlComponent = ({ onInput }: VoiceControlProps) => {
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    const stopRecording = () => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
      }
    };
    const [_, setIsRecording] = useRecorderController(
      startRecording,
      stopRecording
    );

    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current);
      const text = await transcribeAudio(audioBlob);
      onInput?.(text);
      audioChunksRef.current = []; // Clear the chunks after using them
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  return null;
};

const useRecorderController = (startRecording, stopRecording) => {
  const [isRecording, setIsRecording] = useState(false);
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

  return [isRecording, setIsRecording] as const;
};

export function VoiceControl() {
  const { viewDescription } = useScreenShotContext();
  const openAi = new OpenAIService();

  const handleVoiceCommand = async (text) => {
    const { key, args } = await openAi.getActionFromText({
      transcription: text,
      actions: JSONstringifyWithFunctions(actions),
    });

    actions[key](viewDescription, ...args);
  };

  return <VoiceControlComponent onInput={handleVoiceCommand} />;
}
