import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  Stack,
  Icon,
  SimpleGrid,
  Flex,
  VStack,
  HStack,
  Badge,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiMessageSquare,
  FiUsers,
  FiLock,
  FiLogIn,
  FiUserPlus,
  FiGlobe,
  FiActivity,
  FiUserCheck,
} from "react-icons/fi";

const MotionBox = motion.create(Box);
const MotionFlex = motion.create(Flex);
const MotionStack = motion.create(Stack);

const Feature = ({ title, text, icon, badges = [], delay = 0 }) => {
  return (
    <MotionStack
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      bg="rgba(255, 255, 255, 0.03)"
      backdropFilter="blur(10px)"
      rounded="2xl"
      p={8}
      spacing={4}
      border="1px solid"
      borderColor="whiteAlpha.100"
      _hover={{
        transform: "translateY(-5px)",
        boxShadow: "0 10px 30px -10px rgba(139, 92, 246, 0.3)",
        borderColor: "whiteAlpha.300",
        bg: "rgba(255, 255, 255, 0.05)",
      }}
      transitionProperty="all"
      transitionDuration="0.3s"
    >
      <Flex
        w={16}
        h={16}
        align="center"
        justify="center"
        color="white"
        rounded="2xl"
        bgGradient="linear(to-br, purple.500, blue.500)"
        boxShadow="0 4px 14px 0 rgba(139, 92, 246, 0.39)"
      >
        {icon}
      </Flex>
      <Box mt={2}>
        <HStack spacing={2} mb={3}>
          <Text fontWeight="bold" fontSize="xl" color="white">
            {title}
          </Text>
          {badges.map((badge, index) => (
            <Badge
              key={index}
              colorScheme={badge.color}
              variant="subtle"
              rounded="full"
              px={2}
              bg={`${badge.color}.900`}
              color={`${badge.color}.200`}
            >
              {badge.text}
            </Badge>
          ))}
        </HStack>
        <Text color="gray.400">{text}</Text>
      </Box>
    </MotionStack>
  );
};

const ChatMessage = ({ message, sender, time, isUser }) => {
  return (
    <Flex justify={isUser ? "flex-end" : "flex-start"} w="100%">
      <Box
        bg={isUser ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" : "rgba(255, 255, 255, 0.05)"}
        color={isUser ? "white" : "gray.100"}
        borderRadius="2xl"
        borderBottomRightRadius={isUser ? "sm" : "2xl"}
        borderBottomLeftRadius={isUser ? "2xl" : "sm"}
        px={5}
        py={3}
        maxW="80%"
        border={isUser ? "none" : "1px solid"}
        borderColor="whiteAlpha.100"
        boxShadow={isUser ? "0 4px 14px 0 rgba(139, 92, 246, 0.39)" : "none"}
      >
        {!isUser && (
          <Text fontSize="xs" fontWeight="bold" color="purple.300" mb={1}>
            {sender}
          </Text>
        )}
        <Text fontSize="sm">{message}</Text>
        <Text
          fontSize="xs"
          color={isUser ? "whiteAlpha.700" : "gray.500"}
          mt={1}
          textAlign={isUser ? "right" : "left"}
        >
          {time}
        </Text>
      </Box>
    </Flex>
  );
};

export default function LandingPage() {
  return (
    <Box 
      bg="#050505" 
      minH="100vh" 
      position="relative" 
      overflow="hidden"
      fontFamily="'Inter', sans-serif"
    >
      {/* Background glowing orbs */}
      <Box
        position="absolute"
        top="-10%"
        left="-10%"
        w="40%"
        h="40%"
        bgGradient="radial(circle, rgba(139, 92, 246, 0.15) 0%, rgba(0,0,0,0) 70%)"
        filter="blur(60px)"
        zIndex={0}
      />
      <Box
        position="absolute"
        bottom="-10%"
        right="-10%"
        w="40%"
        h="40%"
        bgGradient="radial(circle, rgba(59, 130, 246, 0.15) 0%, rgba(0,0,0,0) 70%)"
        filter="blur(60px)"
        zIndex={0}
      />

      <Container maxW="7xl" pt={6} position="relative" zIndex={1}>
        {/* Navigation / Header */}
        <Flex justify="space-between" align="center" py={4} mb={8}>
          <HStack spacing={2}>
            <Box w={8} h={8} borderRadius="lg" bgGradient="linear(to-br, purple.500, blue.500)" display="flex" alignItems="center" justifyContent="center" boxShadow="0 0 20px rgba(139, 92, 246, 0.5)">
               <Icon as={FiMessageSquare} color="white" />
            </Box>
            <Text fontSize="2xl" fontWeight="900" color="white" letterSpacing="tight">
              Nova<Text as="span" color="purple.400">Chat</Text>
            </Text>
          </HStack>
          <HStack spacing={4}>
            <Button as={RouterLink} to="/login" variant="ghost" color="white" _hover={{ bg: "whiteAlpha.100" }}>
              Sign In
            </Button>
            <Button as={RouterLink} to="/register" colorScheme="purple" bgGradient="linear(to-r, purple.500, blue.500)" _hover={{ bgGradient: "linear(to-r, purple.600, blue.600)" }} border="none" rounded="full" px={6}>
              Get Started
            </Button>
          </HStack>
        </Flex>

        {/* Hero Section */}
        <Stack
          align="center"
          spacing={{ base: 8, md: 10 }}
          py={{ base: 10, md: 20 }}
          direction={{ base: "column", lg: "row" }}
        >
          <MotionStack
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            flex={1}
            spacing={{ base: 6, md: 8 }}
          >
            <Badge colorScheme="purple" alignSelf="flex-start" px={3} py={1} rounded="full" bg="purple.900" color="purple.200" border="1px solid" borderColor="purple.700">
              v2.0 is now live 🚀
            </Badge>
            <Heading
              lineHeight={1.1}
              fontWeight={800}
              fontSize={{ base: "4xl", sm: "5xl", lg: "7xl" }}
              color="white"
              letterSpacing="tight"
            >
              Connect with your team in <Text as="span" bgClip="text" bgGradient="linear(to-r, purple.400, blue.400)">real-time.</Text>
            </Heading>
            <Text color="gray.400" fontSize="xl" maxW="lg" lineHeight="tall">
              Experience seamless group communication with Nova Chat. Designed by BitLord for ultimate performance and stunning esthetics. Connect, collaborate, and conquer.
            </Text>
            <Stack
              spacing={{ base: 4, sm: 6 }}
              direction={{ base: "column", sm: "row" }}
            >
              <Button
                as={RouterLink}
                to="/register"
                rounded="full"
                size="lg"
                px={8}
                height="56px"
                fontSize="md"
                color="white"
                bgGradient="linear(to-r, purple.500, blue.500)"
                _hover={{
                  bgGradient: "linear(to-r, purple.600, blue.600)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 10px 20px -10px rgba(139, 92, 246, 0.5)"
                }}
                leftIcon={<FiUserPlus />}
                transition="all 0.3s"
              >
                Start Chatting Free
              </Button>
              <Button
                as={RouterLink}
                to="/login"
                rounded="full"
                size="lg"
                px={8}
                height="56px"
                fontSize="md"
                variant="outline"
                color="white"
                borderColor="whiteAlpha.300"
                _hover={{ bg: "whiteAlpha.100", borderColor: "whiteAlpha.400" }}
                leftIcon={<FiLogIn />}
              >
                Login to Account
              </Button>
            </Stack>
          </MotionStack>

          {/* Chat Preview */}
          <MotionFlex
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            flex={1}
            justify="center"
            align="center"
            position="relative"
            w="full"
          >
            <Box
              position="absolute"
              w="140%"
              h="140%"
              bg="radial-gradient(circle, rgba(139,92,246,0.1) 0%, rgba(0,0,0,0) 70%)"
              zIndex={-1}
            />
            <Box
              position="relative"
              height="550px"
              rounded="3xl"
              boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.5)"
              width="full"
              maxW="500px"
              overflow="hidden"
              bg="rgba(15, 23, 42, 0.6)"
              backdropFilter="blur(20px)"
              border="1px solid"
              borderColor="whiteAlpha.200"
              sx={{
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: "-100%",
                  width: "100%",
                  height: "100%",
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)",
                  animation: "shimmer 3s infinite",
                }
              }}
            >
              {/* Chat Header */}
              <Box p={5} borderBottom="1px solid" borderColor="whiteAlpha.100" bg="rgba(0,0,0,0.2)">
                <HStack justify="space-between">
                  <HStack spacing={3}>
                    <Box p={2} bg="purple.500" rounded="xl" boxShadow="0 0 15px rgba(139,92,246,0.4)">
                      <Icon as={FiUsers} color="white" />
                    </Box>
                    <Box>
                      <Text fontWeight="bold" color="white" fontSize="md">Nova Engine Team</Text>
                      <Text color="green.400" fontSize="xs">3 online</Text>
                    </Box>
                  </HStack>
                  <Icon as={FiGlobe} color="gray.400" />
                </HStack>
              </Box>

              {/* Chat Messages */}
              <VStack spacing={5} p={6} pt="20px" h="calc(100% - 85px)" overflowY="auto">
                <ChatMessage
                  sender="Sarah Chen"
                  message="Hey team! Just pushed the new stellar UI updates to staging."
                  time="10:30 AM"
                  isUser={false}
                />
                <ChatMessage
                  sender="Alex Thompson"
                  message="Looks absolutely gorgeous! The glassmorphism is spot on 🚀"
                  time="10:31 AM"
                  isUser={false}
                />
                <ChatMessage
                  sender="You"
                  message="Thanks! I've also refined the dark mode aesthetics. Let's deploy to prod!"
                  time="10:32 AM"
                  isUser={true}
                />
                <Box w="100%" display="flex" justifyContent="flex-start" mt={2}>
                  <Box bg="rgba(255,255,255,0.05)" px={4} py={2} rounded="full" border="1px solid" borderColor="whiteAlpha.100">
                    <HStack spacing={1}>
                      <Box w={1.5} h={1.5} bg="purple.400" rounded="full" css={{ animation: "pulse 1.5s infinite" }} />
                      <Box w={1.5} h={1.5} bg="purple.400" rounded="full" css={{ animation: "pulse 1.5s infinite 0.2s" }} />
                      <Box w={1.5} h={1.5} bg="purple.400" rounded="full" css={{ animation: "pulse 1.5s infinite 0.4s" }} />
                    </HStack>
                  </Box>
                </Box>
              </VStack>
            </Box>
          </MotionFlex>
        </Stack>

        {/* Features Grid */}
        <Box py={24}>
          <VStack spacing={4} textAlign="center" mb={16}>
            <Text color="purple.400" fontWeight="bold" letterSpacing="widest" textTransform="uppercase" fontSize="sm">
              Next-Gen Features
            </Text>
            <Heading fontSize={{ base: "3xl", md: "5xl" }} color="white" fontWeight="800">
              Built for speed. Designed to inspire.
            </Heading>
            <Text fontSize="lg" color="gray.400" maxW="2xl">
              Everything you need for seamless team collaboration without compromising on visual excellence.
            </Text>
          </VStack>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} px={{ base: 4, md: 0 }}>
            <Feature
              delay={0.1}
              icon={<Icon as={FiLock} w={8} h={8} />}
              title="Secure Authentication"
              badges={[{ text: "Encrypted", color: "green" }]}
              text="Register and login securely. Your credentials are encrypted and safe within the BitLord ecosystem."
            />
            <Feature
              delay={0.2}
              icon={<Icon as={FiUsers} w={8} h={8} />}
              title="Dynamic Groups"
              badges={[{ text: "Real-time", color: "blue" }]}
              text="Create, join, or leave groups instantaneously. Manage multiple conversations in beautifully isolated channels."
            />
            <Feature
              delay={0.3}
              icon={<Icon as={FiUserCheck} w={8} h={8} />}
              title="Live Presence"
              badges={[{ text: "Instant", color: "green" }]}
              text="See who's currently online and active with seamless socket connections that update in real-time."
            />
            <Feature
              delay={0.4}
              icon={<Icon as={FiActivity} w={8} h={8} />}
              title="Typing Indicators"
              badges={[{ text: "Interactive", color: "purple" }]}
              text="Know exactly when colleagues are responding with responsive typing indicators right in the interface."
            />
            <Feature
              delay={0.5}
              icon={<Icon as={FiMessageSquare} w={8} h={8} />}
              title="Lightning Fast"
              badges={[{ text: "Socket.IO", color: "orange" }]}
              text="Send and receive messages with practically zero latency. Perfect for continuous workflows."
            />
            <Feature
              delay={0.6}
              icon={<Icon as={FiGlobe} w={8} h={8} />}
              title="Global Scale"
              badges={[{ text: "24/7", color: "blue" }]}
              text="Access your chats globally from any device. The persistent connection works beautifully anywhere."
            />
          </SimpleGrid>
        </Box>

        {/* CTA Section */}
        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          py={20}
        >
          <Stack
            direction={{ base: "column", lg: "row" }}
            spacing={10}
            align="center"
            justify="space-between"
            bg="rgba(139, 92, 246, 0.05)"
            p={12}
            rounded="3xl"
            border="1px solid"
            borderColor="purple.900"
            position="relative"
            overflow="hidden"
          >
            <Box position="absolute" right="-10%" top="-50%" w="50%" h="200%" bgGradient="radial(circle, rgba(139,92,246,0.2) 0%, transparent 70%)" />
            
            <VStack align="flex-start" spacing={4} zIndex={1}>
              <Heading size="2xl" color="white" fontWeight="800">
                Ready to elevate your chat?
              </Heading>
              <Text color="gray.400" fontSize="xl">
                Join the Nova Chat platform and experience communication like never before.
              </Text>
            </VStack>
            <Button
              as={RouterLink}
              to="/register"
              size="xl"
              height="60px"
              px={10}
              fontSize="lg"
              color="white"
              bgGradient="linear(to-r, purple.500, blue.500)"
              _hover={{ bgGradient: "linear(to-r, purple.600, blue.600)", transform: "scale(1.02)" }}
              rightIcon={<FiUserPlus />}
              rounded="full"
              zIndex={1}
            >
              Create Free Account
            </Button>
          </Stack>
        </MotionBox>
        
        {/* Footer */}
        <Flex justify="center" align="center" py={8} borderTop="1px solid" borderColor="whiteAlpha.100" mt={10}>
          <Text color="gray.500" fontSize="sm">
            © {new Date().getFullYear()} Nova Chat by BitLord. All rights reserved.
          </Text>
        </Flex>
      </Container>
      <style>{`
        @keyframes shimmer {
          100% { left: 100%; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(0.8); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 1; }
        }
      `}</style>
    </Box>
  );
}
