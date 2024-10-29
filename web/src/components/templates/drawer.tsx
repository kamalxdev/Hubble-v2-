import { memo } from "react";
import { For, HStack } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

type iDrawer = {
  children: React.ReactNode;
  title: string;
  icon: React.ReactElement;
};

function DrawerTemplate({ children, title, icon}: iDrawer) {
  return (
    <HStack wrap="wrap" className="text-white">
      <DrawerRoot key={"start"} placement={"start"}>
        <DrawerBackdrop />
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            size="md"
            className={`${
              title != "Profile" && "transition hover:bg-slate-900"
            }`}
          >
            {icon}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="text-white font-bold text-xl">
              {title}
            </DrawerTitle>
          </DrawerHeader>
          <DrawerBody className="text-white">{children}</DrawerBody>
          
          <DrawerCloseTrigger className="text-white" />
        </DrawerContent>
      </DrawerRoot>
    </HStack>
  );
}

export default memo(DrawerTemplate);
