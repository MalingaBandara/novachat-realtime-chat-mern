import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  HStack,
  Icon,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FiUserPlus, FiMessageSquare } from "react-icons/fi";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const Register = () => {
  return (
    <Box
      w="100%"
      h="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="#050505"
      position="relative"
      overflow="hidden"
      fontFamily="'Inter', sans-serif"
    >
      {/* Background Orbs */}
      <Box
        position="absolute"
        top="-20%"
        left="-10%"
        w="50%"
        h="50%"
        bgGradient="radial(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)"
        filter="blur(80px)"
        zIndex={0}
      />
      <Box
        position="absolute"
        bottom="-20%"
        right="-10%"
        w="50%"
        h="50%"
        bgGradient="radial(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)"
        filter="blur(80px)"
        zIndex={0}
      />

      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        display="flex"
        w={["90%", "85%", "75%", "65%"]}
        maxW="1100px"
        h={["auto", "auto", "650px"]}
        borderRadius="3xl"
        overflow="hidden"
        boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.5)"
        bg="rgba(15, 23, 42, 0.6)"
        backdropFilter="blur(20px)"
        border="1px solid"
        borderColor="whiteAlpha.100"
        zIndex={1}
      >
        {/* Left Panel */}
        <Box
          display={["none", "none", "flex"]}
          w="50%"
          position="relative"
          bg="rgba(0,0,0,0.5)"
          overflow="hidden"
        >
          <Box
             position="absolute"
             w="150%"
             h="150%"
             top="-25%"
             left="-25%"
             bgGradient="radial(circle at 30% 70%, rgba(139, 92, 246, 0.2), transparent 40%), radial(circle at 70% 30%, rgba(59, 130, 246, 0.2), transparent 40%)"
             animation="spin 30s linear infinite reverse"
             opacity="0.8"
          />
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            p={12}
            color="white"
            zIndex={1}
            bg="linear-gradient(to right, rgba(0,0,0,0.6) 0%, transparent 100%)"
          >
            <HStack spacing={3} mb={6}>
              <Box p={3} bgGradient="linear(to-br, purple.500, blue.500)" rounded="xl">
                <Icon as={FiMessageSquare} color="white" fontSize="24px" />
              </Box>
            </HStack>
            <Text fontSize="5xl" fontWeight="900" mb={4} lineHeight="1.1" letterSpacing="tight">
              Join Nova<br/>Community.
            </Text>
            <Text fontSize="lg" color="gray.400" maxW="350px">
              Connect with your friends securely and start chatting instantly globally.
            </Text>
          </Box>
        </Box>

        {/* Right Panel - Register Form */}
        <Box
          w={["100%", "100%", "50%"]}
          p={[8, 10, 14]}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          position="relative"
        >
          <Box display={["flex", "flex", "none"]} mb={8} alignItems="center" gap={3}>
            <Box p={2} bgGradient="linear(to-br, purple.500, blue.500)" rounded="lg">
              <Icon as={FiMessageSquare} color="white" />
            </Box>
            <Text fontSize="2xl" fontWeight="bold" color="white">
              Nova Chat
            </Text>
          </Box>

          <Text fontSize="3xl" fontWeight="bold" color="white" mb={2}>
            Create Account
          </Text>
          <Text color="gray.400" mb={8}>
            Fill in the details to join the network.
          </Text>

          <VStack spacing={5} w="100%">
            <FormControl id="username" isRequired>
              <FormLabel color="gray.300" fontWeight="semibold" fontSize="sm">
                Username
              </FormLabel>
              <Input
                type="text"
                placeholder="Choose a cool username"
                size="md"
                bg="rgba(255, 255, 255, 0.03)"
                borderColor="whiteAlpha.100"
                color="white"
                _hover={{ borderColor: "purple.400", bg: "rgba(255, 255, 255, 0.05)" }}
                _focus={{ borderColor: "purple.400", boxShadow: "0 0 0 1px #9f7aea", bg: "rgba(255, 255, 255, 0.08)" }}
                _placeholder={{ color: "gray.600" }}
                rounded="xl"
                height="50px"
              />
            </FormControl>

            <FormControl id="email" isRequired>
              <FormLabel color="gray.300" fontWeight="semibold" fontSize="sm">
                Email Address
              </FormLabel>
              <Input
                type="email"
                placeholder="you@example.com"
                size="md"
                bg="rgba(255, 255, 255, 0.03)"
                borderColor="whiteAlpha.100"
                color="white"
                _hover={{ borderColor: "purple.400", bg: "rgba(255, 255, 255, 0.05)" }}
                _focus={{ borderColor: "purple.400", boxShadow: "0 0 0 1px #9f7aea", bg: "rgba(255, 255, 255, 0.08)" }}
                _placeholder={{ color: "gray.600" }}
                rounded="xl"
                height="50px"
              />
            </FormControl>

            <FormControl id="password" isRequired>
              <FormLabel color="gray.300" fontWeight="semibold" fontSize="sm">
                Password
              </FormLabel>
              <Input
                type="password"
                placeholder="••••••••"
                size="md"
                bg="rgba(255, 255, 255, 0.03)"
                borderColor="whiteAlpha.100"
                color="white"
                _hover={{ borderColor: "purple.400", bg: "rgba(255, 255, 255, 0.05)" }}
                _focus={{ borderColor: "purple.400", boxShadow: "0 0 0 1px #9f7aea", bg: "rgba(255, 255, 255, 0.08)" }}
                _placeholder={{ color: "gray.600" }}
                rounded="xl"
                height="50px"
              />
            </FormControl>

            <Button
              colorScheme="purple"
              width="100%"
              size="lg"
              height="56px"
              fontSize="md"
              rounded="xl"
              bgGradient="linear(to-r, purple.500, blue.500)"
              _hover={{ bgGradient: "linear(to-r, purple.600, blue.600)", transform: "translateY(-2px)" }}
              _active={{ transform: "translateY(0)" }}
              transition="all 0.2s"
              mt={4}
              boxShadow="0 10px 20px -10px rgba(139, 92, 246, 0.5)"
            >
              Sign Up Free
            </Button>

            <Text color="gray.400" mt={4}>
              Already have an account?{" "}
              <Link
                to="/login"
                style={{
                  color: "#9f7aea",
                  fontWeight: "600",
                }}
              >
                Sign in
              </Link>
            </Text>
          </VStack>
        </Box>
      </MotionBox>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </Box>
  );
};

export default Register;
