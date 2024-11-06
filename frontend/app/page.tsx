import { InputPanel } from "@/components/inputPanel/inputPanel";
import { Request } from "@/components/Message/Request/request";
import { MessageProvider } from "@/contexts/messageContext";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <MessageProvider>
        <Request/>
        <InputPanel/>
      </MessageProvider>
    </div>
  );
}
