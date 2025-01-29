import { Provider } from 'react-redux';
import { store } from '@store/index';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from '@shared/components/Layout';
import Chat from '@features/chat/Chat';
import ImageGen from '@features/image/ImageGen';
import Docs from '@features/docs/Docs';
import Profile from '@features/profile/Profile';
import ProtectedRoute from '@shared/components/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Welcome to OmniAI!</h2>
            <p className="mt-4 text-gray-600">Your AI-powered assistant platform</p>
          </div>
        ),
      },
      {
        path: 'chat',
        element: (
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        ),
      },
      {
        path: 'image',
        element: (
          <ProtectedRoute>
            <ImageGen />
          </ProtectedRoute>
        ),
      },
      {
        path: 'docs',
        element: (
          <ProtectedRoute>
            <Docs />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;