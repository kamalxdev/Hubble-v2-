'use client'

import { memo, useState } from "react";
import { HStack, Input } from "@chakra-ui/react";
import { InputGroup } from "../ui/input-group";
import { CiSearch } from "react-icons/ci";
import searchUser from "@/server-actions/user/search";

function SearchbarTemplate() {
  const [query,setQuery]=useState("")
  async function handleSearchDebouncing(){
    const searchResult=await searchUser(query);
  }
  return (
    <HStack gap="10" width="full">
      <InputGroup flex="1" startElement={<CiSearch />} >
        <Input placeholder="Search users" onInput={(e)=>handleSearchDebouncing()}/>
      </InputGroup>
    </HStack>
  );
}

export default memo(SearchbarTemplate);
