import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'

const createEntityHandler = () => {
  return new Proxy({}, {
    get: (target, prop) => {
      if (prop === 'subscribe') {
        return () => () => {};
      }
      if (prop === 'filter' || prop === 'list' || prop === 'find') {
        return async () => [];
      }
      if (prop === 'get') {
        return async () => null;
      }
      if (prop === 'create' || prop === 'update' || prop === 'upsert') {
        return async (idOrData, data) => (typeof idOrData === 'object' ? idOrData : { id: idOrData, ...data });
      }
      if (prop === 'delete') {
        return async () => ({ success: true });
      }
      return async () => null;
    }
  });
};

if (!globalThis.__B44_DB__) {
  globalThis.__B44_DB__ = {
    auth: {
      isAuthenticated: async () => true,
      me: async () => ({ id: 'demo-cashier', name: 'Sarah Jenkins', role: 'admin' }),
      loginViaEmailPassword: async () => ({ id: 'demo-cashier', name: 'Sarah Jenkins', role: 'admin' }),
      loginWithProvider: async () => ({ id: 'demo-cashier', name: 'Sarah Jenkins', role: 'admin' }),
      redirectToLogin: () => {},
      logout: () => {}
    },
    entities: new Proxy({}, {
      get: () => createEntityHandler()
    }),
    integrations: {
      Core: {
        UploadFile: async () => ({ file_url: '' })
      }
    }
  };
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
