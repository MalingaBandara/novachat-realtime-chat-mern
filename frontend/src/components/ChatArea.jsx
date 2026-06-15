import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  Flex,
  Icon,
  Avatar,
  InputGroup,
  InputRightElement,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { FiSend, FiInfo, FiHash, FiMoreVertical } from "react-icons/fi";
import UsersList from "./UsersList";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

const MotionBox = motion.create(Box);

/*
 * ChatArea — main chat UI component.
 *
 Props:
 *  - selectedGroup: the currently active group/channel object ({ _id, name, ... })
 *  - socket: the Socket.IO client instance for real-time events
*/
const ChatArea = ( { selectedGroup, socket } ) => {
  
  const [messages, setMessages] = useState([]);         // Fetched messages for the selected group
  const [newMessage, setNewMessage] = useState("");      // Controlled value for the message input
  const [connectedUsers, setConnectedUsers] = useState([]); // Users currently online in this group
  const [isTyping, setIsTyping] = useState(false);      // Whether the current user is typing
  const [typingUsers, setTypingUsers] = useState(new Set()); // Set of usernames currently typing (others)

  const messagesEndRef = useRef(null);       // Ref to the bottom of the message list — used for auto-scroll
  const typingTimeoutRef = useRef(null);     // Ref to debounce the typing indicator reset
  
  const toast = useToast(); // Chakra UI toast for error/success notifications

  const currentUser = JSON.parse( localStorage.getItem( "userInfo" ) ||  "{}" ); // Get logged-in user info from localStorage


  // Re-fetch messages whenever the selected group or socket instance changes
  useEffect( ()=> {

    //! Guard: skip if no group is selected or socket isn't ready yet
    if( selectedGroup && socket ) { //! Only fetch messages if:  { A group is selected (avoid calling API with undefined group), Socket is initialized (ensures real-time connection is ready)
      
      fetchMessages();  // Pull message history for this group from the REST API

      
      // ── Room Management ────────────────────────────────────────────────────

      // Tell the server to add this client to the selected group's socket room.
      // The server uses this to know which clients should receive messages for this group.
      socket.emit('join room', selectedGroup?._id);


      // ── Inbound Event Listeners ────────────────────────────────────────────

      // A new message was broadcast to this room by the server — append it to the list.
      // Using the functional updater form of setState to always work off the latest state
      // and avoid stale closure issues.
      socket.on('message received', (newMessage) => {
        setMessages((prev) => [...prev, newMessage]);
      });

      // Server sends the full list of users currently in the room when we first join.
      // Replaces the entire connectedUsers state (not merged) since it's a complete snapshot.
      socket.on('users in room', (users) => {
        setConnectedUsers(users);
      });

      // A new user joined the room after us — append them to the existing list
      // rather than re-fetching the full user list from the server.
      socket.on('user joined', (user) => {
        setConnectedUsers((prev) => [...prev, user]);
      });

      // A user disconnected or left — remove them by ID.
      // Filtering by _id keeps the rest of the list intact without a full re-fetch.
      socket.on('user left', (userId) => {
        setConnectedUsers((prev) => prev.filter((user) => user?._id !== userId));
      });

      // Server-pushed notification (e.g. USER_JOINED, USER_LEFT, system messages).
      // The title changes based on the notification type; all others fall back to "Notification".
      socket.on('notification', (notification) => {
        toast({
          title: notification?.type === "USER_JOINED" ? "New User" : "Notification",
          description: notification?.message,
          status: "info",
          duration: 3000,
          isClosable: true,
        });
      });

      // Another user started typing — add their username to the Set.
      // A Set is used instead of an array to automatically handle duplicate events
      // (e.g. rapid keystrokes firing 'typing' multiple times for the same user).
      socket.on('typing', ({ username }) => {
        setTypingUsers((prev) => new Set(prev).add(username));
      });

      // Another user stopped typing — remove only their username from the Set.
      // We must create a new Set (not mutate) to trigger a React re-render.
      socket.on('stop typing', ({ username }) => {
        setTypingUsers((prev) => {
          const newSet = new Set(prev);
          newSet.delete(username);
          return newSet;
        });
      });


      //* ── Cleanup (runs before the next effect or on unmount) ────────────────
      return () => {
        // Notify the server that this client is leaving so it can update
        // the room's user list and broadcast a 'user left' event to others.
        socket.emit('leave room', selectedGroup?._id);

        // Remove all listeners registered in this effect.
        // Critical: without this, switching groups would stack duplicate listeners
        // from the previous and new group, causing messages to be appended multiple times.
        socket.off('users in room');
        socket.off('user joined');
        socket.off('user left');
        socket.off('notification');
        socket.off('typing');
        socket.off('stop typing');

        // Note: 'message received' is intentionally not removed here because
        // it doesn't need a group-specific scope — remove it if you add it above.
      };
  }

  }, [ selectedGroup, socket, toast ] ); // Dependency array:
  // - selectedGroup  → re-runs when user switches to a different group/channel
  // - socket         → re-runs when the socket connection is first established or reconnected
  // - toast          → included because it's referenced inside the effect (ESLint exhaustive-deps rule)
  //                    In practice, Chakra's useToast returns a stable reference so this won't cause extra re-runs


  //* Fetches message history for the selected group from the REST API.
  const fetchMessages = async ()=> {

    const currentUser = JSON.parse( localStorage.getItem( "userInfo" ) || {} ); // Get stored user info (includes token)
    const token = currentUser.user.token; // Extract JWT token for authorization

    try {
      
       // API call to get messages for selected group
      const data =  await axios.get( `http://localhost:5000/api/messages/${selectedGroup?._id}` , {
        headers: { Authorization: `Bearer ${token}` }
      } );

      console.log( data ); // Debug: check response from backend
      
    } catch (error) {
      console.log( error );
    }
  };


  //* Send Messages
  const sendMessage = async () => {

    if (!newMessage.trim()) return; // Prevent users from sending empty messages ( trim() removes leading and trailing spaces )

    try {

      const token = currentUser.user.token; // Retrieve the logged-in user's JWT token (This token is required for API authentication)

      // Send the message to the backend API
      const data = await axios.post(
        "http://localhost:5000/api/messages",
        {
          content: newMessage, // Message content typed by the user
          groupId: selectedGroup?._id,// ID of the currently selected chat/group (Optional chaining (?) prevents errors if no group is selected)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include JWT token in Authorization header
          },
        }
      );

      // Notify all connected clients in real-time via Socket.IO
      socket.emit("new message", {
        ...data, // Spread operator (...) copies all properties from the API response
        groupId: selectedGroup?._id,
      });

      // Add the newly sent message to the local messages state and This updates the UI immediately without refreshing
      setMessages([
        ...messages, // Existing messages
        data,        // Newly sent message
      ]);

      
      setNewMessage("");// Clear the message input field after successful send

    } catch (error) {
      toast({ // Display an error notification if message sending fails
        title: "Error sending message",
        status: "error",
        duration: 3000,   // Toast visible for 3 seconds
        isClosable: true, // User can manually close it
      });
    }
  };


  //* Handle Typing (Handle user typing in the message input field)
  const handleTyping = (e) => {

    setNewMessage(e.target.value);// Update the message input state with the latest text

    if (!isTyping && selectedGroup) { // If the user is not already marked as typing and a chat/group is currently selected

      setIsTyping(true); // Mark current user as typing locally

      // Notify other users in the group that this user started typing
      socket.emit("typing", {
        groupId: selectedGroup?._id,              // Current chat/group ID
        username: currentUser?.user?.username     // Current user's username
      });
    }

    // If a previous typing timeout exists, 
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current); // clear it to prevent premature "stop typing" events
    }

    // Start a new timer every time the user types(This creates a "typing debounce" effect)
    typingTimeoutRef.current = setTimeout(() => {

      // If the user stops typing for 2 seconds, notify other users that typing has ended
      if (selectedGroup) {
        socket.emit("stop typing", {
          groupId: selectedGroup?._id,
        });
      }

      setIsTyping(false);// Update local typing state

    }, 2000); // 2000ms = 2 seconds of inactivity
  };


  //* Format Time ( Date/time value for display in the chat UI)
  const formatTime =  (date) => {

    return new Date( date ).toLocaleTimeString( "en-US", { // Convert the provided date string/timestamp into a JavaScript Date object
      hour: "2-digit", // Display hour using 2 digits  (Example: 09, 10, 11)
      minute: "2-digit", // Display minutes using 2 digits (Example:  05, 30, 45)
    });

  };


//* Render typing indicators in chat UI
const renderTypingIndicator = () => {

  if (typingUsers.size === 0) return null;  // If nobody is typing, render nothing
  const typingUsersArray = Array.from(typingUsers); // Convert Set -> Array so we can use .map()

  return typingUsersArray.map((username) => {  // Generate a typing indicator for each typing user

    
    return (//! Return JSX for each typing user
      <Box
        key={username} // Unique key required when rendering lists
        alignSelf={
          username === currentUser?.user?.username ? "flex-start" : "flex-end" }// Show current user's typing indicator on the left and Other users' indicators appear on the right
        maxW="70%" // Limit indicator width
      >
        <Flex align="center"
          bg={ username === currentUser?.user?.username ? "blue.50" : "gray.50" }// Different background color for current user vs other
          p={2} // Padding
          borderRadius="lg" // Rounded corners
          gap={2} // Space between children
        >

          {/* --------------------------------
              Current User Typing Indicator
              Example: "You are typing..."
             -------------------------------- */}
          {username === currentUser?.user?.username ? (

            <>
              <Avatar size="xs" name={username}/> {/* Current user's avatar */}
              <Flex align="center" gap={1}>
                <Text fontSize="sm" color="gray.500" fontStyle="italic"> You are typing </Text>
                <Flex gap={1}>  {/* Animated typing dots */}
                  {[1, 2, 3].map((dot) => (
                    <Box key={dot} w="3px" h="3px" borderRadius="full" bg="gray.500" />
                  ))}
                </Flex>
              </Flex>
            </>

          ) : (

            <>
              {/* --------------------------------
                  Other User Typing Indicator
                  Example: "John is typing..."
                 -------------------------------- */}
              <Flex align="center" gap={1}>
                <Text fontSize="sm" color="gray.500" fontStyle="italic"> {username} is typing </Text>
                <Flex gap={1}>  {/* Animated typing dots */}
                  {[1, 2, 3].map((dot) => (
                    <Box key={dot} w="3px" h="3px" borderRadius="full" bg="gray.500" />
                  ))}
                </Flex>
              </Flex>
              <Avatar size="xs" name={username} /> {/* Avatar shown after text for other users */}
            </>

          )}

        </Flex>
      </Box>
    );
  });
};


  // Sample data for demonstration
  const sampleMessages = [
    {
      id: 1,
      content: "Hey team! Just pushed the new stellar updates to staging.",
      sender: { username: "Sarah Chen" },
      createdAt: "10:30 AM",
      isCurrentUser: false,
    },
    {
      id: 2,
      content: "Great work! The new glassmorphism features look amazing 🚀",
      sender: { username: "Alex Thompson" },
      createdAt: "10:31 AM",
      isCurrentUser: false,
    },
    {
      id: 3,
      content: "Thanks! I'll prep the deployment pipeline for tomorrow's release.",
      sender: { username: "You" },
      createdAt: "10:32 AM",
      isCurrentUser: true,
    },
    {
      id: 4,
      content: "Awesome, I'll review the PR right after this standup.",
      sender: { username: "Sarah Chen" },
      createdAt: "10:35 AM",
      isCurrentUser: false,
    },
    {
      id: 5,
      content: "Perfect. Everything is looking good on my end.",
      sender: { username: "You" },
      createdAt: "10:36 AM",
      isCurrentUser: true,
    },
  ];

  const sampleUsers = [
    { id: 1, username: "Sarah Chen", isOnline: true },
    { id: 2, username: "Alex Thompson", isOnline: true },
    { id: 3, username: "John Doe", isOnline: false },
    { id: 4, username: "Emma Watson", isOnline: true },
    { id: 5, username: "Mike Ross", isOnline: false },
  ];

  return (
    <Flex h="100%" position="relative" bg="transparent">
      <Box
        flex="1"
        display="flex"
        flexDirection="column"
        bg="transparent"
        maxW={`calc(100% - 280px)`}
      >
        {/* Chat Header */}
        <Flex
          px={6}
          py={5}
          bg="rgba(15, 23, 42, 0.4)"
          borderBottom="1px solid"
          borderColor="whiteAlpha.100"
          align="center"
          backdropFilter="blur(16px)"
          zIndex={2}
        >
          <Box p={2.5} bg="rgba(255,255,255,0.05)" rounded="xl" mr={4} border="1px solid" borderColor="whiteAlpha.100">
             <Icon as={FiHash} fontSize="20px" color="purple.400" />
          </Box>
          <Box flex="1">
            <Text fontSize="lg" fontWeight="bold" color="white" letterSpacing="tight">
              Development Team
            </Text>
            <Text fontSize="xs" color="gray.400" mt={0.5}>
              Main development team channel for cosmic updates
            </Text>
          </Box>
          <HStack spacing={2}>
            <Tooltip label="Channel Info" bg="purple.600" color="white" rounded="md">
              <Box p={2} cursor="pointer" rounded="lg" _hover={{ bg: "rgba(255,255,255,0.05)" }} transition="all 0.2s">
                <Icon as={FiInfo} fontSize="20px" color="gray.400" _hover={{ color: "purple.300" }} />
              </Box>
            </Tooltip>
            <Tooltip label="Options" bg="purple.600" color="white" rounded="md">
               <Box p={2} cursor="pointer" rounded="lg" _hover={{ bg: "rgba(255,255,255,0.05)" }} transition="all 0.2s">
                 <Icon as={FiMoreVertical} fontSize="20px" color="gray.400" _hover={{ color: "purple.300" }} />
               </Box>
            </Tooltip>
          </HStack>
        </Flex>

        {/* Messages Area */}
        <VStack
          flex="1"
          overflowY="auto"
          spacing={6}
          align="stretch"
          px={8}
          py={6}
          position="relative"
          bg="rgba(0,0,0,0.2)"
          sx={{
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "rgba(255,255,255,0.1)",
              borderRadius: "24px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: "rgba(255,255,255,0.2)",
            },
          }}
        >
          {sampleMessages.map((message, index) => (
            <MotionBox
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              alignSelf={message.isCurrentUser ? "flex-end" : "flex-start"}
              maxW="75%"
            >
              <Flex direction="column" gap={1.5}>
                <Flex
                  align="center"
                  mb={1}
                  justifyContent={
                    message.isCurrentUser ? "flex-end" : "flex-start"
                  }
                  gap={3}
                >
                  {message.isCurrentUser ? (
                    <>
                      <Text fontSize="xs" color="gray.400" fontWeight="medium">
                         {message.createdAt}
                      </Text>
                    </>
                  ) : (
                    <>
                      <Avatar size="sm" name={message.sender.username} bgGradient="linear(to-br, purple.400, blue.400)" border="2px solid" borderColor="rgba(255,255,255,0.1)" />
                      <Text fontSize="sm" color="purple.300" fontWeight="bold">
                        {message.sender.username}
                      </Text>
                      <Text fontSize="xs" color="gray.500" fontWeight="medium">
                        {message.createdAt}
                      </Text>
                    </>
                  )}
                </Flex>

                <Box
                  bg={message.isCurrentUser ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" : "rgba(30, 41, 59, 0.7)"}
                  color="white"
                  p={4}
                  borderRadius="2xl"
                  borderBottomRightRadius={message.isCurrentUser ? "sm" : "2xl"}
                  borderTopLeftRadius={message.isCurrentUser ? "2xl" : "sm"}
                  boxShadow={message.isCurrentUser ? "0 10px 25px -5px rgba(139, 92, 246, 0.4)" : "0 4px 15px rgba(0,0,0,0.1)"}
                  border={message.isCurrentUser ? "none" : "1px solid"}
                  borderColor="whiteAlpha.100"
                  backdropFilter="blur(10px)"
                >
                  <Text fontSize="md" lineHeight="tall">{message.content}</Text>
                </Box>
              </Flex>
            </MotionBox>
          ))}
        </VStack>

        {/* Message Input */}
        <Box
          p={6}
          bg="rgba(15, 23, 42, 0.5)"
          borderTop="1px solid"
          borderColor="whiteAlpha.100"
          backdropFilter="blur(16px)"
          position="relative"
          zIndex="1"
        >
          <InputGroup size="lg" position="relative">
            <Input
              placeholder="Message #Development Team..."
              pl={6}
              pr="4.5rem"
              bg="rgba(0,0,0,0.3)"
              border="1px solid"
              borderColor="whiteAlpha.200"
              color="white"
              height="60px"
              rounded="2xl"
              _hover={{
                borderColor: "whiteAlpha.300",
                bg: "rgba(0,0,0,0.4)"
              }}
              _focus={{
                boxShadow: "0 0 0 1px #8b5cf6",
                borderColor: "purple.400",
                bg: "rgba(0,0,0,0.5)",
              }}
              _placeholder={{ color: "gray.500", fontSize: "md" }}
              transition="all 0.3s"
            />
            <InputRightElement width="4.5rem" height="100%">
              <Button
                h="40px"
                w="40px"
                size="md"
                colorScheme="purple"
                borderRadius="xl"
                bgGradient="linear(to-br, purple.500, blue.500)"
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "0 5px 15px rgba(139, 92, 246, 0.4)"
                }}
                transition="all 0.2s"
                p={0}
              >
                <Icon as={FiSend} fontSize="18px" />
              </Button>
            </InputRightElement>
          </InputGroup>
        </Box>
      </Box>

      {/* UsersList with fixed width */}
      <Box
        width="280px"
        position="sticky"
        right={0}
        top={0}
        height="100%"
        flexShrink={0}
      >
    
    {/*  Render the UsersList component ONLY if a group is currently selected(`selectedGroup` acts as a condition (truthy check)) */}
    { selectedGroup && (
      <UsersList 
        users={connectedUsers} // Pass the list of currently connected users as props
      />
    ) }

      </Box>
    </Flex>
  );
};

export default ChatArea;
