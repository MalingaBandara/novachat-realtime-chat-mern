import {
  Box,
  VStack,
  Text,
  Badge,
  Flex,
  Icon,
  Tooltip,
  Avatar,
  AvatarBadge,
} from "@chakra-ui/react";
import { FiUsers, FiCircle, FiSearch, FiMoreHorizontal } from "react-icons/fi";
import { motion } from "framer-motion";

const MotionBox = motion.create(Box);

const UsersList = ({ groupMembers, connectedUsers }) => {

  const currentUser = JSON.parse( localStorage.getItem( "userInfo" ) ||  "{}" ); // Get logged-in user info from localStorage

  // Build a Set of online user IDs for O(1) lookup
  const onlineIds = new Set(connectedUsers.map((u) => u._id));

  // Split the full member roster into online/offline based on that Set
  const onlineUsers = groupMembers.filter((m) => onlineIds.has(m._id));
  const offlineUsers = groupMembers.filter((m) => !onlineIds.has(m._id));

  return (
    <Box
      h="100%"
      w="100%"
      borderLeft="1px solid"
      borderColor="whiteAlpha.100"
      bg="rgba(15, 23, 42, 0.5)"
      backdropFilter="blur(16px)"
      position="relative"
      overflow="hidden"
      display="flex"
      flexDirection="column"
    >
      {/* Header */}
      <Flex
        p={5}
        borderBottom="1px solid"
        borderColor="whiteAlpha.100"
        bg="rgba(15, 23, 42, 0.6)"
        align="center"
        position="sticky"
        top={0}
        zIndex={2}
        backdropFilter="blur(16px)"
        justify="space-between"
      >
        <Flex align="center">
          <Icon as={FiUsers} fontSize="20px" color="blue.400" mr={3} />
          <Text fontSize="lg" fontWeight="800" color="white" letterSpacing="tight">
            Members
          </Text>
          <Badge
            ml={3}
            colorScheme="blue"
            borderRadius="full"
            px={2}
            py={0.5}
            fontSize="10px"
            bg="rgba(59, 130, 246, 0.2)"
            color="blue.300"
            border="1px solid"
            borderColor="blue.500"
          >
            {groupMembers.length}
          </Badge>
        </Flex>
        <Icon as={FiSearch} fontSize="18px" color="gray.400" cursor="pointer" _hover={{ color: "blue.300" }} transition="all 0.2s" />
      </Flex>

      {/* Users List */}
      <Box flex="1" overflowY="auto" p={5}
        sx={{
          "&::-webkit-scrollbar": { width: "4px" },
          "&::-webkit-scrollbar-track": { background: "transparent" },
          "&::-webkit-scrollbar-thumb": { background: "rgba(255,255,255,0.1)", borderRadius: "24px" },
          "&::-webkit-scrollbar-thumb:hover": { background: "rgba(255,255,255,0.2)" },
        }}
      >
        <Text fontSize="xs" fontWeight="bold" color="gray.500" textTransform="uppercase" letterSpacing="widest" mb={4} ml={2}>
          Online — {onlineUsers.length}
        </Text>
        <VStack align="stretch" spacing={3} mb={6}>
          {onlineUsers.map((user, index) => (
            <MotionBox
              key={user._id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Tooltip label={`${user.username} is online`} placement="left" bg="purple.600" color="white" hasArrow>
                <Flex
                  p={3}
                  bg="rgba(255, 255, 255, 0.03)"
                  borderRadius="2xl"
                  align="center"
                  border="1px solid"
                  borderColor="whiteAlpha.50"
                  _hover={{
                    bg: "rgba(255, 255, 255, 0.08)",
                    transform: "translateY(-1px)",
                    borderColor: "whiteAlpha.200",
                    boxShadow: "0 5px 15px -5px rgba(0,0,0,0.3)"
                  }}
                  transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                  cursor="pointer"
                  position="relative"
                >
                  <Avatar
                    size="sm"
                    name={user.username}
                    bgGradient="linear(to-br, purple.400, blue.400)"
                    color="white"
                    mr={4}
                    border="2px solid"
                    borderColor="rgba(255,255,255,0.1)"
                  >
                    <AvatarBadge boxSize="1.25em" bg="green.400" border="2px solid" borderColor="#0f172a" />
                  </Avatar>

                  <Box flex="1">
                    <Text
                      fontSize="sm"
                      fontWeight="bold"
                      color="white"
                      noOfLines={1}
                      letterSpacing="tight"
                    >
                      {user.username}
                    </Text>
                    <Text fontSize="xs" color="gray.400">Active now</Text>
                  </Box>
                  <Icon as={FiMoreHorizontal} color="gray.600" />
                </Flex>
              </Tooltip>
            </MotionBox>
          ))}
        </VStack>

        <Text fontSize="xs" fontWeight="bold" color="gray.500" textTransform="uppercase" letterSpacing="widest" mb={4} ml={2}>
          Offline — {offlineUsers.length}
        </Text>
        <VStack align="stretch" spacing={2}>
          {offlineUsers.map((user, index) => (
             <MotionBox
             key={user._id}
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.3, delay: index * 0.05 }}
           >
              <Flex
                p={3}
                bg="transparent"
                borderRadius="2xl"
                align="center"
                border="1px solid"
                borderColor="transparent"
                _hover={{
                  bg: "rgba(255, 255, 255, 0.02)",
                  borderColor: "whiteAlpha.50"
                }}
                transition="all 0.2s"
                cursor="pointer"
              >
                <Avatar
                  size="sm"
                  name={user.username}
                  bg="gray.600"
                  color="white"
                  mr={4}
                  opacity={0.6}
                >
                   <AvatarBadge boxSize="1.25em" bg="gray.500" border="2px solid" borderColor="#0f172a" />
                </Avatar>

                <Box flex="1" opacity={0.6}>
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    color="gray.400"
                    noOfLines={1}
                  >
                    {user.username}
                  </Text>
                  <Text fontSize="xs" color="gray.600">Offline</Text>
                </Box>
              </Flex>
            </MotionBox>
          ))}
        </VStack>
      </Box>

      {/* Current User Footer */}
      <Box p={4} borderTop="1px solid" borderColor="whiteAlpha.100" bg="rgba(0,0,0,0.3)">
        <Flex align="center" justify="space-between">
          <Flex align="center">
            <Avatar size="sm" name="You" bgGradient="linear(to-br, purple.500, blue.500)" mr={3}>
              <AvatarBadge boxSize="1em" bg="green.400" border="2px solid" borderColor="#0f172a" />
            </Avatar>
            <Box>
              <Text fontSize="sm" fontWeight="bold" color="white">You</Text>
              <Text fontSize="xs" color="gray.400">{currentUser?.user?.username}</Text>
            </Box>
          </Flex>
          <Icon as={FiCircle} color="purple.400" fontSize="12px" />
        </Flex>
      </Box>
    </Box>
  );
};

export default UsersList;