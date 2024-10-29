import { memo } from "react";
import { HStack, Input } from "@chakra-ui/react";
import { InputGroup } from "../ui/input-group";
import { CiSearch } from "react-icons/ci";

function SearchbarTemplate() {
  return (
    <HStack gap="10" width="full">
      <InputGroup flex="1" startElement={<CiSearch />}>
        <Input placeholder="Search users" />
      </InputGroup>
    </HStack>
  );
}

export default memo(SearchbarTemplate);
