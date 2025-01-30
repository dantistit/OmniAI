import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@features/auth/authSlice';
import chatReducer from '@features/chat/chatSlice';
import imageReducer from '@features/image/imageSlice';
import docsReducer from '@features/docs/docsSlice';
import { setupListeners } from '@reduxjs/toolkit/query';
import { api } from '@utils/api';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    image: imageReducer,
    docs: docsReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(api.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;