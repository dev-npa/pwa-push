const db: { subscriptions: PushSubscription[] } = {
  subscriptions: [],
};

export const subscriptions = {
  add: (subscription: PushSubscription) => {
    if (!db.subscriptions.find((s) => s.endpoint === subscription.endpoint)) {
      db.subscriptions.push(subscription);
    }
  },
  find: () => {
    return db.subscriptions;
  },
  clear: () => {
    db.subscriptions = [];
  },
  get: (subscription: PushSubscription) => {
    return db.subscriptions.find((s) => s.endpoint === subscription.endpoint);
  },
};
