import { Box, Flex } from "@chakra-ui/react";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";

const Chat = () => {
  return (
    <Flex h="100vh" bg="#050505" overflow="hidden" position="relative" fontFamily="'Inter', sans-serif">
      {/* Background glow for the entire chat app */}
      <Box
        position="absolute"
        top="-20%"
        left="-10%"
        w="40%"
        h="40%"
        bgGradient="radial(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%)"
        filter="blur(80px)"
        zIndex={0}
      />
      <Box
        position="absolute"
        bottom="-20%"
        right="-10%"
        w="40%"
        h="40%"
        bgGradient="radial(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)"
        filter="blur(80px)"
        zIndex={0}
      />

      {/* Main Container */}
      <Flex w="100%" h="100%" zIndex={1} bg="rgba(0,0,0,0.2)" backdropFilter="blur(20px)">
        <Box w="300px" borderRight="1px solid" borderColor="whiteAlpha.100" bg="rgba(15, 23, 42, 0.4)">
          <Sidebar />
        </Box>
        <Box flex="1">
          <ChatArea />
        </Box>
      </Flex>
    </Flex>
  );
};

export default Chat;
