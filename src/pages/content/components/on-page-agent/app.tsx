import { ScreenShotProvider } from "@pages/content/components/on-page-agent/screenshot-context";
import { ChatProvider } from "@pages/content/components/on-page-agent/chat-provider";
import { VoiceControl } from "@pages/content/components/on-page-agent/voice-control";
import { UiHelpersProvider } from "@pages/content/components/on-page-agent/ui-helpers-context";

export default function App() {
  return (
    <ChatProvider>
      <UiHelpersProvider>
        <ScreenShotProvider>
          <VoiceControl />
        </ScreenShotProvider>
      </UiHelpersProvider>
    </ChatProvider>
  );
}
