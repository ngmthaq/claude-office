import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from '@/components/atoms/ErrorBoundary';
import { OfficePage } from '@/components/pages/OfficePage';
import { wsClientService } from '@/services/ws-client.service';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.min.css';
import '@/styles/base.css';
import '@/styles/sessions.css';
import '@/styles/chat.css';
import '@/styles/subagent.css';
import '@/styles/chat-input.css';
import '@/styles/autocomplete.css';
import '@/styles/game.css';
import '@/styles/chat-drawer.css';
import '@/styles/mcp.css';
import '@/styles/room-actions.css';
import '@/styles/header.css';

const container = document.getElementById('root');
if (!container) throw new Error('Root element not found');

wsClientService.start();

createRoot(container).render(
  <StrictMode>
    <ErrorBoundary>
      <OfficePage />
    </ErrorBoundary>
  </StrictMode>,
);
