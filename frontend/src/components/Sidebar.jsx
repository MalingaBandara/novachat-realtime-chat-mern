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

import axios from "axios"; //? Library for making HTTP requests


// -----------------SIDEBAR COMPONENT (Handles group-related UI actions (create, join, leave, etc.)) ------------
const Sidebar = ( { setSelectedGroup } ) => {

   const { isOpen, onOpen, onClose } = useDisclosure(); //* Chakra UI hook to control modal/drawer state (isOpen → state, onOpen/onClose → handlers)

   const [newGroupName, setNewGroupName] = useState(""); //? Stores group name input
   const [newGroupDescription, setNewGroupDescription] = useState("");  //? Stores group description input

   const [groups, setGroups] = useState([]); //? State to hold list of groups fetched from backend (array of group objects)
   const [ userGroups, setUserGroups ] = useState( [] ); //? Stores IDs of groups the current user has joined (used to track membership)

   const toast = useToast();  //? Hook to show toast notifications

   const [isAdmin, setIsAdmin] = useState( false ); //* State to track whether logged-in user is admin


   // *** =========== LIFECYCLE HOOK (RUN ON COMPONENT MOUNT) ==========
   useEffect( () => {
     checkAdminStatus(); //? Check admin status when component loads
     fetchGroups(); //? Fetch groups when component loads
   }, [] );


     // <> =============  CHECK ADMIN STATUS (Determines if the logged-in user has admin privileges) ==========
     const checkAdminStatus = () => {
       const userInfo = JSON.parse( localStorage.getItem( "userInfo" ) || {} );  //* Retrieve user info from localStorage (user data after login)
 
       setIsAdmin( userInfo?.user.isAdmin || false ); //! Update admin state (If userInfo.isAdmin exists → set true/false accordingly)
     }


    // <> =============  FETCH ALL GROUPS (Retrieves all groups from backend API - Requires JWT auth) ==========
    const fetchGroups = async () => {

      try {

        const userInfo = JSON.parse( localStorage.getItem( "userInfo" ) || {} ); //* Get stored user info (includes token)
        const token = userInfo.user.token; //* Extract JWT token for authorization

        //* Send GET request to fetch all groups
        const { data } = await axios.get( "http://localhost:5000/api/groups", {
            headers: {
              Authorization: `Bearer ${token}` //* Send token in header (required for protected route)
            }
        } );

        // console.log(data); //* Debug: view fetched groups
        setGroups(data); //* Store groups in state (array of group objects)

        
        //* ── GET USER GROUPS ──────────────────────────────────────────────────────
        //* From all fetched groups, isolate only the ones the current user belongs to.
        //* Each group has a `members` array of user objects — we check if the current
        //* user's ID appears in that list, then extract just the group IDs.
        const userGroupIds = data?.filter( (group) => {

          //* For each group, scan its members array to see if the logged-in user is listed.
          //* `some()` returns true as soon as one member's _id matches the current user's _id.
          return group?.members?.some( member => member?._id === userInfo?.user?._id );

        }).map( group => group?._id ); //* Collapse the matched group objects down to just their IDs

        setUserGroups( userGroupIds ); //* Store the user's group ID list in state (used to highlight/filter joined groups)
        

      } catch (error) {
        console.error("Error fetching groups:", error); //! Handle error (network/server/token issues)
      }
    };


    // <> ============= HANDLE CREATE GROUP (Sends new group data to backend API - Requires JWT auth) =============
    const handleCreateGroup = async ()=> {

      try {

        const userInfo = JSON.parse( localStorage.getItem( "userInfo" ) || {} ); //* Get stored user info (includes token)
        const token = userInfo.user.token; //* Extract JWT token for authorization

         //* Send POST request with new group name and description to create the group
        await axios.post( "http://localhost:5000/api/groups",  {
          name: newGroupName,
          description: newGroupDescription
         }, {
          headers: {
            Authorization: `Bearer ${token}` //* Send token in header (required for protected route)
           }
        } );

        toast({
          title: 'Group Created',
          status: "success",
          duration: 3000,
          isClosable: true
        }); //* Notify user of success

        onClose(); //* Close the create group modal

        fetchGroups(); //* Refresh group list to include the newly created group

        setNewGroupName(""); //* Reset group name input
        setNewGroupDescription(""); //* Reset group description input
        
        
      } catch (error) {
        toast({
          title: 'Error Creating Group',
          status: "error",
          duration: 3000,
          isClosable: true,
          description: error.response?.data?.message || "An error occurred while creating the group."
        }); //! Show error toast — uses server message if available, falls back to generic message
      }
    };


    // <> ============= HANDLE JOIN GROUP (Sends join request to backend, refreshes group list, selects joined group) =============
    const handleJoinGroup = async ( groupId )=> {
      
      try {
        
        const userInfo = JSON.parse( localStorage.getItem( "userInfo" ) || {} ); //* Get stored user info (includes token)
        const token = userInfo.user.token; //* Extract JWT token for authorization

        //* POST to join endpoint — body is empty ({}) since groupId is passed as a URL param and user is identified via token
        await axios.post( `http://localhost:5000/api/groups/${groupId}/join`,  
          {}, 
          {
            headers: {
              Authorization: `Bearer ${token}` //* Send token in header (required for protected route)
            },
        } );

        await fetchGroups(); //* Re-fetch all groups to get updated members list (reflects the join)

        setSelectedGroup( groups.find( (g)=> g?._id === groupId ) ); //* Select the joined group from updated list

        toast({
          title: 'Joined group successfully',
          status: "success",
          duration: 3000,
          isClosable: true
        }); // Show success message to user
        
      } catch (error) {
        console.log(error);
        toast({
          title: 'Error Joining Group',
          status: "error",
          duration: 3000,
          isClosable: true,
          description: error?.response?.data?.message || "An error occurred while joining the group."
        });
      }

    };


    // TODO: logout
    // TODO: Join group
    // TODO: Leave group


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
              bg={ userGroups.includes(group?._id) ? "rgba(139, 92, 246, 0.15)" : "rgba(255, 255, 255, 0.03)"}
              border="1px solid"
              borderColor={ userGroups.includes(group?._id) ? "rgba(139, 92, 246, 0.3)" : "whiteAlpha.100"}
              transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
              _hover={{
                transform: "translateY(-2px)",
                borderColor: userGroups.includes(group?._id) ? "purple.400" : "whiteAlpha.300",
                bg: userGroups.includes(group?._id) ? "rgba(139, 92, 246, 0.25)" : "rgba(255, 255, 255, 0.08)",
                boxShadow: userGroups.includes(group?._id) ? "0 4px 20px -5px rgba(139, 92, 246, 0.3)" : "none"
              }}
            >
              <Flex justify="space-between" align="center">
                <Box onClick={ ()=>  setSelectedGroup(group) } flex="1">
                  <Flex align="center" mb={1}>
                    <Icon as={FiUsers} color={ userGroups.includes(group?._id) ? "purple.300" : "gray.400"} mr={2} fontSize="sm" />
                    <Text fontWeight="600" color="white" fontSize="sm">
                      {group.name}
                    </Text>
                    { userGroups.includes(group?._id) && (
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
                  colorScheme={ userGroups.includes(group?._id) ? "whiteAlpha" : "purple"}
                  variant={ userGroups.includes(group?._id) ? "ghost" : "solid"}
                  ml={3}

                  onClick={ ()=> handleJoinGroup( group?._id) } // Call handleJoinGroup when "Join" button is clicked

                  bg={ userGroups.includes(group?._id) ? "transparent" : "rgba(139, 92, 246, 0.5)"}
                  color={ userGroups.includes(group?._id) ? "purple.300" : "white"}
                  _hover={{
                    bg: userGroups.includes(group?._id) ? "whiteAlpha.200" : "purple.500",
                    color: userGroups.includes(group?._id) ? "red.300" : "white"
                  }}
                  rounded="full"
                  px={4}
                >
                  { userGroups.includes(group?._id) ? "Leave" : "Join"}
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
              onClick={ handleCreateGroup }
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
