import ChatAreaTemplate from "@/components/templates/chatarea";
import FriendsTemplate from "@/components/templates/friends";
import SidebarTemplate from "@/components/templates/sidebar";

export default function Home() {
  // const isChatSelected=useAppSelector((state)=>state.chat.currentChatAreaUserID)
  // console.log("isChatSelected: ", isChatSelected);
  
  return (
    <section className="flex flex-nowrap bg-slate-950">
      <section className="relative border border-slate-800">
        <SidebarTemplate />
      </section>
      <section className="realtive w-full h-dvh text-white grid grid-cols-[25%_75%] ">
        <div className="relative h-dvh grid grid-rows-[8%_92%] border border-slate-800 pb-4">
          <h1 className="text-2xl font-semibold opacity-80 border-b border-slate-800 p-4">
            Messages
          </h1>
          <div className="relative overflow-y-scroll overflow-hidden px-4">
            <div className="relative">
              <FriendsTemplate/>
            </div>
          </div>
        </div>
        <ChatAreaTemplate/>
      </section>
    </section>
  );
}
