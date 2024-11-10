"use client";

import { memo, useEffect, useState } from "react";
import { HStack, Input } from "@chakra-ui/react";
import { InputGroup } from "../ui/input-group";
import { CiSearch } from "react-icons/ci";
import searchUser from "@/server-actions/user/search";
import { iFriend } from "@/types/user";
import User from "./user";
import { toaster } from "../ui/toaster";
import { useAppSelector } from "@/redux/hooks";

function SearchbarTemplate() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<iFriend[]>();
  const friends = useAppSelector((state) => state?.friends);
  useEffect(() => {
    query &&
      searchUser(query)
        .then((data) => {
          if (!data?.success) {
            return toaster.create({
              title: data?.error || "Error on searching user",
              type: "error",
            });
          }
          setResult(data?.result);
        })
        .catch((err) => {
          console.log("Error on searching user: ", err);
        });
  }, [query]);

  return (
    <section>
      <HStack gap="10" width="full">
        <InputGroup flex="1" startElement={<CiSearch />}>
          <Input
            placeholder="Search users"
            onChange={(e) => {
              setTimeout(() => setQuery(e.target.value), 400);
            }}
          />
        </InputGroup>
      </HStack>
      <div className="flex flex-col mt-5 justify-center items-center w-full">
        {query && result ? (
          <>
            <h1 className="opacity-20 text-left w-full">Result:</h1>{" "}
            {result?.map(({ name, username, id, avatar }) => (
              <User
                id={id}
                name={name}
                username={username}
                avatar={avatar}
                key={username}
              />
            ))}
          </>
        ) : (
          <>
            {friends?.length > 0 &&
              friends?.map(({ detail, messages }) => (
                <User
                  id={detail?.id}
                  name={detail?.name}
                  username={detail?.username}
                  lastMessage={messages && messages[messages?.length - 1]?.text}
                  time={messages && messages[messages?.length - 1]?.time}
                  avatar={detail?.avatar}
                  key={detail?.username}
                />
              ))}
          </>
        )}
      </div>
    </section>
  );
}

export default memo(SearchbarTemplate);
