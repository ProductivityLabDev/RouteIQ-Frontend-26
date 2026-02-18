import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { socketService } from "@/services/socketService";
import {
  receiveMessage,
  setUserTyping,
  clearUserTyping,
} from "@/redux/slices/chatSlice";

export function useSocket() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user?.token);

  useEffect(() => {
    if (!token) return;

    socketService.connect(token);

    socketService.onNewMessage((message) => {
      dispatch(receiveMessage(message));
    });

    socketService.onUserTyping((data) => {
      dispatch(setUserTyping(data));
    });

    socketService.onUserStopTyping((data) => {
      dispatch(clearUserTyping(data));
    });

    return () => {
      socketService.offNewMessage();
      socketService.offUserTyping();
      socketService.offUserStopTyping();
      socketService.disconnect();
    };
  }, [token, dispatch]);
}
