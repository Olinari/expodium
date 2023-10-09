import {
  ScreenShotProvider,
  useScreenShotContext,
} from "@pages/content/components/on-page-agent/screen-shot/screenshot-context";
import {
  ChatProvider,
  useChatContext,
} from "@pages/content/components/on-page-agent/chat-provider";
import { VoiceControl } from "@pages/content/components/on-page-agent/voice-control";
import { actions } from "@pages/content/actions";
import { OpenAIService } from "@src/services/open-ai";
const openAi = new OpenAIService();

export default function App() {
  return (
    <ChatProvider>
      <ScreenShotProvider>
        <VoiceControlComponent />
      </ScreenShotProvider>
    </ChatProvider>
  );
}

function VoiceControlComponent() {
  const { viewDescription } = useScreenShotContext();

  const handleVoiceCommand = async (text) => {
    const { key, args } = await openAi.getActionFromText({
      transcription: text,
      actions: JSONstringifyWithFunctions(actions),
    });

    actions[key](viewDescription, ...args);
  };

  return <VoiceControl onInput={handleVoiceCommand} />;
}
