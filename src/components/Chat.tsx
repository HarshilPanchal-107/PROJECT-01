import { useState, useEffect, useRef } from 'react';
import {
  Box,
  VStack,
  HStack,
  Input,
  IconButton,
  Text,
  useToast,
  Container,
  Spinner,
} from '@chakra-ui/react';
import { IoSend, IoMic, IoMicOff } from 'react-icons/io5';
import { collection, addDoc, query, orderBy, limit } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { db } from '../config/firebase';
import openai from '../config/openai';
import { useAuth } from '../hooks/useAuth';

interface Message {
  text: string;
  createdAt: Date;
  uid: string;
  isAI: boolean;
}

export const Chat = () => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const { user } = useAuth();
  const toast = useToast();
  const bottomRef = useRef<HTMLDivElement>(null);

  const messagesRef = collection(db, 'messages');
  const q = query(messagesRef, orderBy('createdAt', 'desc'), limit(50));
  const [messages] = useCollectionData(q);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !user) return;

    try {
      setIsLoading(true);
      
      // Add user message to Firestore
      await addDoc(messagesRef, {
        text: input,
        createdAt: new Date(),
        uid: user.uid,
        isAI: false
      });

      // Get AI response
      const completion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: input }],
        model: 'gpt-3.5-turbo',
      });

      const aiResponse = completion.choices[0]?.message?.content;

      if (aiResponse) {
        // Add AI response to Firestore
        await addDoc(messagesRef, {
          text: aiResponse,
          createdAt: new Date(),
          uid: 'ai',
          isAI: true
        });
      }

      setInput('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send message',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleListening = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      if (!isListening) {
        recognition.start();
      }
    } else {
      toast({
        title: 'Error',
        description: 'Speech recognition is not supported in your browser',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.md" h="100vh" py={4}>
      <VStack h="full" spacing={4}>
        <Box
          flex={1}
          w="full"
          overflowY="auto"
          p={4}
          borderRadius="md"
          bg="gray.50"
        >
          {messages?.map((msg: Message, idx: number) => (
            <Box
              key={idx}
              alignSelf={msg.isAI ? 'flex-start' : 'flex-end'}
              bg={msg.isAI ? 'blue.100' : 'green.100'}
              p={3}
              borderRadius="lg"
              maxW="80%"
              mb={2}
            >
              <Text>{msg.text}</Text>
            </Box>
          ))}
          <div ref={bottomRef} />
        </Box>

        <HStack w="full">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <IconButton
            aria-label="Send message"
            icon={isLoading ? <Spinner /> : <IoSend />}
            onClick={handleSend}
            isDisabled={isLoading || !input.trim()}
          />
          <IconButton
            aria-label="Voice input"
            icon={isListening ? <IoMicOff /> : <IoMic />}
            onClick={toggleListening}
          />
        </HStack>
      </VStack>
    </Container>
  );
}; 