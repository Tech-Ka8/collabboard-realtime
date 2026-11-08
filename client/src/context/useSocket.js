import { useContext } from 'react';
import { SocketContext } from './socketContextStore';

export const useSocket = () => useContext(SocketContext);