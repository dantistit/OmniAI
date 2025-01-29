import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@features/auth/authSlice';
import chatReducer from '@features/chat/chatSlice';
import imageReducer from '@features/image/imageSlice';
import docsReducer from '@features/docs/docsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    image: imageReducer,
    docs: docsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;