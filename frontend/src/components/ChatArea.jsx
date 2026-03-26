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
} from "@chakra-ui/react";
import { FiSend, FiInfo, FiHash, FiMoreVertical } from "react-icons/fi";
import UsersList from "./UsersList";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const ChatArea = () => {
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
        <UsersList users={sampleUsers} />
      </Box>
    </Flex>
  );
};

export default ChatArea;
