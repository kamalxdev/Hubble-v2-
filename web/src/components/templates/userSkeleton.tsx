import { HStack } from "@chakra-ui/react";
import { SkeletonCircle, SkeletonText } from "@/components/ui/skeleton";
import { memo } from "react";

function UserSkeletonTemplate() {
  const dummySkeletonFriends = ["", "", "", "", "", "", ""];

  return (
    <div className="absolute inline-flex flex-col w-full gap-4 mt-2">
      {dummySkeletonFriends?.map((f, i) => (
        <HStack width="full" key={i}>
          <SkeletonCircle size="10" />
          <SkeletonText noOfLines={2} />
        </HStack>
      ))}
    </div>
  );
}




export default memo(UserSkeletonTemplate)