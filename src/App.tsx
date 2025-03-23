import { ChakraProvider, Box, Spinner } from '@chakra-ui/react';
import { useAuth } from './hooks/useAuth';
import { Login } from './components/Login';
import { Chat } from './components/Chat';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <ChakraProvider>
        <Box
          height="100vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Spinner size="xl" />
        </Box>
      </ChakraProvider>
    );
  }

  return (
    <ChakraProvider>
      {user ? <Chat /> : <Login />}
    </ChakraProvider>
  );
}

export default App; 