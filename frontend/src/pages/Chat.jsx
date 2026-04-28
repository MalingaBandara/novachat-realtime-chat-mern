import { Box, Flex } from "@chakra-ui/react";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";
import { useEffect, useState } from "react";

import io from "socket.io-client"; // Socket.IO client for establishing real-time WebSocket connections with the backend

const ENDPOINT = "http://localhost:5000"; // Backend Socket.IO server URL ( ⚠️ update this when deploying to production)



const Chat = () => {

   const [selectedGroup, setSelectedGroup] = useState(null); // Tracks which group/room the user has selected in the sidebar

   const [socket, setSocket] = useState(null); // Holds the active Socket.IO instance so child components can access it via props or context

   useEffect( ()=> {

      const userInfo = JSON.parse( localStorage.getItem( "userInfo" ) ||  "{}" ); //* Get stored user info (includes token)

      //* Initialize a new Socket.IO connection
      // Auth data is sent during connection for backend validation
      const newSocket = io ( ENDPOINT, {
        auth: { user : userInfo.user }, // Pass user details to backend via handshake
      });

      setSocket( newSocket ); // Save socket instance to state for later use (sending/receiving messages)

   }, []);

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
          {/* Pass function to update selected group */}
          <Sidebar setSelectedGroup={setSelectedGroup} />
        </Box>
        <Box flex="1">
          <ChatArea />
        </Box>
      </Flex>
    </Flex>
  );
};

export default Chat;
