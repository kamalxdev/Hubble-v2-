import ChatAreaTemplate from "@/components/templates/chatarea";
import FriendsTemplate from "@/components/templates/friends";
import SidebarTemplate from "@/components/templates/sidebar";
import Image from "next/image";

export default function Home() {
  // const friends = [
  //   {
  //     name: "Virat Kholi",
  //     username: "vkholi",
  //     last_message: "hello, how are you?",
  //     time: "09:45 pm",
  //     avatar: null,
  //   },
  //   {
  //     name: "Rohit Sharma",
  //     username: "rosharma",
  //     last_message: "hello",
  //     time: "01:25 am",
  //     avatar: null,
  //   },
  //   {
  //     name: "Virat Kholi",
  //     username: "vkholi",
  //     last_message: "hello, how are you?",
  //     time: "09:45 pm",
  //     avatar: null,
  //   },
  //   {
  //     name: "Rohit Sharma",
  //     username: "rosharma",
  //     last_message: "hello",
  //     time: "01:25 am",
  //     avatar: null,
  //   },
  //   {
  //     name: "Virat Kholi",
  //     username: "vkholi",
  //     last_message: "hello, how are you?",
  //     time: "09:45 pm",
  //     avatar: null,
  //   },
  //   {
  //     name: "Rohit Sharma",
  //     username: "rosharma",
  //     last_message: "hello",
  //     time: "01:25 am",
  //     avatar: null,
  //   },
  //   {
  //     name: "Virat Kholi",
  //     username: "vkholi",
  //     last_message: "hello, how are you?",
  //     time: "09:45 pm",
  //     avatar: null,
  //   },
  //   {
  //     name: "Rohit Sharma",
  //     username: "rosharma",
  //     last_message: "hello",
  //     time: "01:25 am",
  //     avatar: null,
  //   },
  //   {
  //     name: "Virat Kholi",
  //     username: "vkholi",
  //     last_message: "hello, how are you?",
  //     time: "09:45 pm",
  //     avatar: null,
  //   },
  //   {
  //     name: "Rohit Sharma",
  //     username: "rosharma",
  //     last_message: "hello",
  //     time: "01:25 am",
  //     avatar: null,
  //   },
  //   {
  //     name: "Virat Kholi",
  //     username: "vkholi",
  //     last_message: "hello, how are you?",
  //     time: "09:45 pm",
  //     avatar: null,
  //   },
  //   {
  //     name: "Rohit Sharma",
  //     username: "rosharma",
  //     last_message: "hello",
  //     time: "01:25 am",
  //     avatar: null,
  //   },
  //   {
  //     name: "Virat Kholi",
  //     username: "vkholi",
  //     last_message: "hello, how are you?",
  //     time: "09:45 pm",
  //     avatar: null,
  //   },
  //   {
  //     name: "Rohit Sharma",
  //     username: "rosharma",
  //     last_message: "hello",
  //     time: "01:25 am",
  //     avatar: null,
  //   },
  //   {
  //     name: "Virat Kholi",
  //     username: "vkholi",
  //     last_message: "hello, how are you?",
  //     time: "09:45 pm",
  //     avatar: null,
  //   },
  //   {
  //     name: "Rohit Sharma",
  //     username: "rosharma",
  //     last_message: "hello",
  //     time: "01:25 am",
  //     avatar: null,
  //   },
  // ];

  return (
    <section className="flex flex-nowrap bg-slate-950">
      <section className="relative border border-slate-800">
        <SidebarTemplate />
      </section>
      <section className="realtive w-full h-dvh text-white grid grid-cols-[25%_75%] ">
        <div className="relative h-dvh grid grid-rows-[7%_93%] border border-slate-800 pb-4">
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
