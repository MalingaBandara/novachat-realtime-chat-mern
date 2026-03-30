import {
  Box,
  VStack,
  Text,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Flex,
  Icon,
  Badge,
  Tooltip,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FiLogOut, FiPlus, FiUsers, FiMessageSquare } from "react-icons/fi";
import { Link } from "react-router-dom";


// -----------------SIDEBAR COMPONENT (Handles group-related UI actions (create, join, leave, etc.)) ------------
const Sidebar = () => {
  
  const { isOpen, onOpen, onClose } = useDisclosure(); //* Chakra UI hook to control modal/drawer state (isOpen → state, onOpen/onClose → handlers)

  //* State for creating a new group
  const [newGroupName, setNewGroupName] = useState(""); //? Stores group name input
  const [newGroupDescription, setNewGroupDescription] = useState("");  //? Stores group description input

  const toast = useToast();  //? Hook to show toast notifications

  const [isAdmin, setIsAdmin] = useState( false ); //* State to track whether logged-in user is admin


  // *** ============= LIFECYCLE HOOK (RUN ON COMPONENT MOUNT) ==========
  useEffect( () => {
    checkAdminStatus(); //? Check admin status when component loads
  }, [] );


    // <> =============  CHECK ADMIN STATUS (Determines if the logged-in user has admin privileges) ==========
    const checkAdminStatus = () => {
      const userInfo = JSON.parse( localStorage.getItem( "userInfo" ) || {} );

      //! Update Admin Status
      setIsAdmin( userInfo?.isAdmin || false );
    }


    // TODO: fetch all groups
    // Todo: fetch users group
    // TODO: Create groups
    // TODO: logout
    // TODO: Join group
    // TODO: Leave group



  // Sample groups data
  const groups = [
    {
      id: 1,
      name: "Development Team",
      description: "Main development team channel for daily updates",
      isJoined: true,
    },
    {
      id: 2,
      name: "Design Team",
      description: "Collaboration space for designers",
      isJoined: false,
    },
    {
      id: 3,
      name: "Marketing",
      description: "Marketing team discussions and campaigns",
      isJoined: true,
    },
  ];

  return (
    <Box
      h="100%"
      bg="transparent"
      display="flex"
      flexDirection="column"
    >
      {/* Brand Header */}
      <Flex
        p={5}
        borderBottom="1px solid"
        borderColor="whiteAlpha.100"
        bg="rgba(15, 23, 42, 0.4)"
        position="sticky"
        top={0}
        zIndex={2}
        backdropFilter="blur(16px)"
        align="center"
        justify="space-between"
      >
        <Flex align="center">
          <Box p={2} bgGradient="linear(to-br, purple.500, blue.500)" rounded="xl" mr={3} boxShadow="0 0 15px rgba(139,92,246,0.3)">
             <Icon as={FiMessageSquare} fontSize="18px" color="white" />
          </Box>
          <Text fontSize="xl" fontWeight="800" color="white" letterSpacing="tight">
            Nova<Text as="span" color="purple.400">Groups</Text>
          </Text>
        </Flex>
        {isAdmin && (
          <Tooltip label="Create New Group" placement="right" bg="purple.600" color="white" hasArrow>
            <Button
              size="sm"
              colorScheme="purple"
              variant="solid"
              onClick={onOpen}
              borderRadius="xl"
              bgGradient="linear(to-r, purple.500, blue.500)"
              _hover={{ bgGradient: "linear(to-r, purple.600, blue.600)", transform: "scale(1.05)" }}
              p={0}
              w="32px"
              h="32px"
            >
              <Icon as={FiPlus} fontSize="18px" />
            </Button>
          </Tooltip>
        )}
      </Flex>

      {/* Groups List */}
      <Box flex="1" overflowY="auto" p={4} mb={20} css={{
        '&::-webkit-scrollbar': { width: '4px' },
        '&::-webkit-scrollbar-track': { background: 'transparent' },
        '&::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.1)', borderRadius: '24px' },
      }}>
        <Text fontSize="xs" fontWeight="bold" color="gray.500" textTransform="uppercase" letterSpacing="widest" mb={4} ml={2}>
          Channels
        </Text>
        <VStack spacing={3} align="stretch">
          {groups.map((group) => (
            <Box
              key={group.id}
              p={4}
              cursor="pointer"
              borderRadius="2xl"
              bg={group.isJoined ? "rgba(139, 92, 246, 0.15)" : "rgba(255, 255, 255, 0.03)"}
              border="1px solid"
              borderColor={group.isJoined ? "rgba(139, 92, 246, 0.3)" : "whiteAlpha.100"}
              transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
              _hover={{
                transform: "translateY(-2px)",
                borderColor: group.isJoined ? "purple.400" : "whiteAlpha.300",
                bg: group.isJoined ? "rgba(139, 92, 246, 0.25)" : "rgba(255, 255, 255, 0.08)",
                boxShadow: group.isJoined ? "0 4px 20px -5px rgba(139, 92, 246, 0.3)" : "none"
              }}
            >
              <Flex justify="space-between" align="center">
                <Box flex="1">
                  <Flex align="center" mb={1}>
                    <Icon as={FiUsers} color={group.isJoined ? "purple.300" : "gray.400"} mr={2} fontSize="sm" />
                    <Text fontWeight="600" color="white" fontSize="sm">
                      {group.name}
                    </Text>
                    {group.isJoined && (
                      <Badge ml={2} colorScheme="purple" variant="solid" bg="purple.500" rounded="full" px={2} fontSize="10px">
                        Joined
                      </Badge>
                    )}
                  </Flex>
                  <Text fontSize="xs" color="gray.400" noOfLines={2} title={group.description}>
                    {group.description}
                  </Text>
                </Box>
                <Button
                  size="xs"
                  colorScheme={group.isJoined ? "whiteAlpha" : "purple"}
                  variant={group.isJoined ? "ghost" : "solid"}
                  ml={3}
                  bg={group.isJoined ? "transparent" : "rgba(139, 92, 246, 0.5)"}
                  color={group.isJoined ? "purple.300" : "white"}
                  _hover={{
                    bg: group.isJoined ? "whiteAlpha.200" : "purple.500",
                    color: group.isJoined ? "red.300" : "white"
                  }}
                  rounded="full"
                  px={4}
                >
                  {group.isJoined ? "Leave" : "Join"}
                </Button>
              </Flex>
            </Box>
          ))}
        </VStack>
      </Box>

      {/* Logout Footer */}
      <Box
        p={5}
        borderTop="1px solid"
        borderColor="whiteAlpha.100"
        bg="rgba(15, 23, 42, 0.6)"
        backdropFilter="blur(16px)"
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        width="100%"
      >
        <Button
          as={Link}
          to="/login"
          width="full"
          variant="ghost"
          colorScheme="red"
          color="gray.300"
          leftIcon={<Icon as={FiLogOut} color="red.400" />}
          _hover={{
            bg: "rgba(220, 38, 38, 0.1)",
            color: "red.300",
            transform: "translateY(-1px)",
          }}
          rounded="xl"
          height="45px"
          transition="all 0.2s"
        >
          Disconnect
        </Button>
      </Box>

      {/* Create Group Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay backdropFilter="blur(10px)" bg="rgba(0,0,0,0.6)" />
        <ModalContent bg="#0f172a" border="1px solid" borderColor="whiteAlpha.200" rounded="2xl" color="white" boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.5)">
          <ModalHeader borderBottom="1px solid" borderColor="whiteAlpha.100" pb={4}>Create New Channel</ModalHeader>
          <ModalCloseButton mt={2} color="gray.400" _hover={{ color: "white" }} />
          <ModalBody py={6}>
            <FormControl>
              <FormLabel color="gray.300" fontSize="sm">Channel Name</FormLabel>
              <Input
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="e.g. Design Team"
                bg="rgba(255,255,255,0.05)"
                border="1px solid"
                borderColor="whiteAlpha.100"
                _focus={{ borderColor: "purple.400", boxShadow: "0 0 0 1px #9f7aea", bg: "rgba(255,255,255,0.08)" }}
                _hover={{ borderColor: "purple.400" }}
                color="white"
                rounded="xl"
                size="lg"
              />
            </FormControl>

            <FormControl mt={6}>
              <FormLabel color="gray.300" fontSize="sm">Description</FormLabel>
              <Input
                value={newGroupDescription}
                onChange={(e) => setNewGroupDescription(e.target.value)}
                placeholder="What's this channel about?"
                bg="rgba(255,255,255,0.05)"
                border="1px solid"
                borderColor="whiteAlpha.100"
                _focus={{ borderColor: "purple.400", boxShadow: "0 0 0 1px #9f7aea", bg: "rgba(255,255,255,0.08)" }}
                _hover={{ borderColor: "purple.400" }}
                color="white"
                rounded="xl"
                size="lg"
              />
            </FormControl>

            <Button
              colorScheme="purple"
              mt={8}
              width="full"
              size="lg"
              rounded="xl"
              bgGradient="linear(to-r, purple.500, blue.500)"
              _hover={{ bgGradient: "linear(to-r, purple.600, blue.600)", transform: "translateY(-1px)" }}
              boxShadow="0 10px 20px -10px rgba(139, 92, 246, 0.5)"
              onClick={() => {
                toast({
                  title: "Channel Initialized",
                  description: "Your new channel is ready for transmission.",
                  status: "success",
                  duration: 3000,
                  isClosable: true,
                  position: "bottom-right",
                  variant: "solid",
                });
                onClose();
                setNewGroupName("");
                setNewGroupDescription("");
              }}
            >
              Initialize Channel
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Sidebar;
