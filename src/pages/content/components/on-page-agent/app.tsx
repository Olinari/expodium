import {
  ScreenShotProvider,
  useScreenShotContext,
} from "@pages/content/components/on-page-agent/screenshot-context";
import { ChatProvider } from "@pages/content/components/on-page-agent/chat-provider";
import { VoiceControl } from "@pages/content/components/on-page-agent/voice-control";
import { actions } from "@pages/content/actions";
import { OpenAIService } from "@src/services/open-ai";
import { UiHelpersProvider } from "@pages/content/components/on-page-agent/ui-helpers-context";
const openAi = new OpenAIService();

export default function App() {
  return (
    <UiHelpersProvider>
      <ChatProvider>
        <ScreenShotProvider>
          <VoiceControlComponent />
        </ScreenShotProvider>
      </ChatProvider>
    </UiHelpersProvider>
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
