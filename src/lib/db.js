const createEntityHandler = () => {
  return new Proxy({}, {
    get: (target, prop) => {
      if (prop === 'subscribe') {
        return (cb) => {
          return () => {}; // return dummy unsubscribe function
        };
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

export const mockDb = {
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

// Dynamic proxy that always checks globalThis.__B44_DB__ at property access time
export const db = new Proxy({}, {
  get: (target, prop) => {
    const activeDb = globalThis.__B44_DB__ || mockDb;
    return activeDb[prop];
  }
});
