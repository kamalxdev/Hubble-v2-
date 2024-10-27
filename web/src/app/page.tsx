import SearchbarTemplate from "@/components/templates/searchbar";
import SidebarTemplate from "@/components/templates/sidebar";
import UserTemplate from "@/components/templates/user";
import Image from "next/image";

export default function Home() {
  const friends = [
    {
      name: "Virat Kholi",
      username: "vkholi",
      last_message: "hello, how are you?",
      time: "09:45 pm",
      avatar: null,
    },
    {
      name: "Rohit Sharma",
      username: "rosharma",
      last_message: "hello",
      time: "01:25 am",
      avatar: null,
    },
    {
      name: "Virat Kholi",
      username: "vkholi",
      last_message: "hello, how are you?",
      time: "09:45 pm",
      avatar: null,
    },
    {
      name: "Rohit Sharma",
      username: "rosharma",
      last_message: "hello",
      time: "01:25 am",
      avatar: null,
    },
    {
      name: "Virat Kholi",
      username: "vkholi",
      last_message: "hello, how are you?",
      time: "09:45 pm",
      avatar: null,
    },
    {
      name: "Rohit Sharma",
      username: "rosharma",
      last_message: "hello",
      time: "01:25 am",
      avatar: null,
    },
    {
      name: "Virat Kholi",
      username: "vkholi",
      last_message: "hello, how are you?",
      time: "09:45 pm",
      avatar: null,
    },
    {
      name: "Rohit Sharma",
      username: "rosharma",
      last_message: "hello",
      time: "01:25 am",
      avatar: null,
    },
    {
      name: "Virat Kholi",
      username: "vkholi",
      last_message: "hello, how are you?",
      time: "09:45 pm",
      avatar: null,
    },
    {
      name: "Rohit Sharma",
      username: "rosharma",
      last_message: "hello",
      time: "01:25 am",
      avatar: null,
    },
    {
      name: "Virat Kholi",
      username: "vkholi",
      last_message: "hello, how are you?",
      time: "09:45 pm",
      avatar: null,
    },
    {
      name: "Rohit Sharma",
      username: "rosharma",
      last_message: "hello",
      time: "01:25 am",
      avatar: null,
    },
    {
      name: "Virat Kholi",
      username: "vkholi",
      last_message: "hello, how are you?",
      time: "09:45 pm",
      avatar: null,
    },
    {
      name: "Rohit Sharma",
      username: "rosharma",
      last_message: "hello",
      time: "01:25 am",
      avatar: null,
    },
    {
      name: "Virat Kholi",
      username: "vkholi",
      last_message: "hello, how are you?",
      time: "09:45 pm",
      avatar: null,
    },
    {
      name: "Rohit Sharma",
      username: "rosharma",
      last_message: "hello",
      time: "01:25 am",
      avatar: null,
    },
  ];
  return (
    <section className="flex flex-nowrap">
      <section className="relative">
        <SidebarTemplate />
      </section>
      <section className="realtive w-full h-screen bg-slate-900 text-white grid grid-cols-[25%_75%]">
        <div className="relative h-screen px-2 py-6 grid grid-rows-[3%_97.5%] gap-4">
          <h1 className="text-2xl font-semibold">Messages</h1>
          <div className="relative overflow-y-scroll overflow-hidden">
            <div className="relative">
              <div className="absolute inline-flex flex-col w-full">
                {friends?.map(({name,last_message,time,username},index) => (
                  <>
                    <UserTemplate
                      name={name}
                      lastMessage={last_message}
                      time={time}
                      username={username}
                      key={name}
                    />
                    {friends?.length!=index+1 && <hr className="mx-2 opacity-35" />}
                  </>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="relative w-max h-screen bg-green-700">World</div>
      </section>
    </section>
  );
}
