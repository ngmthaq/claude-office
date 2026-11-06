import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@/App';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { startWsClient } from '@/features/connection/ws-client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.min.css';
import '@/styles.css';

const container = document.getElementById('root');
if (!container) throw new Error('Root element not found');

startWsClient();

createRoot(container).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
