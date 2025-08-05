import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    username: 'Guest',
  }),
  actions: {
    setUsername(name: string) {
      this.username = name;
    },
  },
});
