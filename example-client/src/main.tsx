import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { StatsigProvider } from '@statsig/react-bindings';
import { App } from './App';
import { getUserId } from './userId';

const statsigClientKey = import.meta.env.VITE_STATSIG_CLIENT_KEY;

if (!statsigClientKey) {
  throw new Error(
    'Missing VITE_STATSIG_CLIENT_KEY environment variable. ' +
    'Please copy .env.template to .env and configure your Statsig Client SDK Key.'
  );
}

const userId = getUserId();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StatsigProvider
      sdkKey={statsigClientKey}
      user={{ userID: userId }}
      options={{
        environment: { tier: import.meta.env.MODE },
      }}
      loadingComponent={<div>Loading Statsig...</div>}
    >
      <App />
    </StatsigProvider>
  </StrictMode>,
);
