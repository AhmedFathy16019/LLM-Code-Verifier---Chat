import { InputPanel } from "@/components/inputPanel/inputPanel";
import { Request } from "@/components/Message/Request/request";
import { Response } from "@/components/Message/Response/Response";
import { MessageProvider } from "@/contexts/messageContext";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen font-[family-name:var(--font-geist-sans)]">
      <MessageProvider>
      <div className="flex-1 overflow-y-auto max-h-[60vh] p-4">
          <Request />
          <Response />
        </div>
        <div className="flex-2 m-4 max-h-[25vh] w-5/6 items-center justify-center">
          <InputPanel />
        </div>
      </MessageProvider>
    </div>
  );
}
