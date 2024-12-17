// import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast'
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from 'react-query';

import App from './app';

// ----------------------------------------------------------------------
// const queryClient = new QueryClient();
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Disable refetching on window focus
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <Toaster position='top-right' toastOptions={{style: {
      fontSize: '18px',
      padding: 40,
      borderRadius: '10px',
      boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.2)',
      height: 60
    }}}/>
    <BrowserRouter>
        <App />
    </BrowserRouter>
    </QueryClientProvider>
  </HelmetProvider>
);
