import { memo } from "react";
import { HStack, Input } from "@chakra-ui/react";
import { InputGroup } from "../ui/input-group";
import { CiSearch } from "react-icons/ci";

function SearchbarTemplate() {
  return (
      <InputGroup flex="1" startElement={<CiSearch />}>
        <Input placeholder="Search user" />
      </InputGroup>
  );
}

export default memo(SearchbarTemplate);
