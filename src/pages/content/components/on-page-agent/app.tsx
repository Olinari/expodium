import { actions } from "@pages/content/components/on-page-agent/actions";
import { OpenAIService } from "@src/services/open-ai";
import { VoiceControl } from "@pages/content/components/on-page-agent/voice-control";
import {
  ScreenShotProvider,
  useScreenShotContext,
} from "@pages/content/components/on-page-agent/screenshot-context";

const openAIServiceInstance = new OpenAIService();

export default function App() {
  return (
    <ScreenShotProvider>
      <VoiceControlComponent />
    </ScreenShotProvider>
  );
}

function VoiceControlComponent() {
  const { viewDescription } = useScreenShotContext();

  const handleVoiceCommand = async (text) => {
    const { key, args } = await openAIServiceInstance.getActionFromText({
      transcription: text,
      actions: JSONstringifyWithFunctions(actions),
    });

    actions[key](viewDescription, ...args);
  };

  return <VoiceControl onInput={handleVoiceCommand} />;
}
