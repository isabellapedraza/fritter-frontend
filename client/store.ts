import { STATES } from 'mongoose';
import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various compoentns.
 */
const store = new Vuex.Store({
  state: {
    filter: null, // Username to filter shown freets by (null = show all)
    freets: [], // All freets created in the app
    users: null, 
    friends: null, // All the friends created in the app
    times: null, // All the times created in the app
    nests: null, // All the nests created in the app,
    //members: null, // A certain nest's members
    username: null, // Username of the logged in user
    alerts: {} // global success/error messages encountered during submissions to non-visible forms
  },
  getters: {
    userFreets: state => {
      return state.freets.filter(freet => freet.author === state.username);
    }
  },
  mutations: {
    alert(state, payload) {
      /**
       * Add a new message to the global alerts.
       */
      Vue.set(state.alerts, payload.message, payload.status);
      setTimeout(() => {
        Vue.delete(state.alerts, payload.message);
      }, 3000);
    },
    setUsername(state, username) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.username = username;
    },
    addNest(state, nest) {
      /**
       * Adds a nest to the store
       */
      state.nests.push(nest);
    },
    updateFilter(state, filter) {
      /**
       * Update the stored freets filter to the specified one.
       * @param filter - Username of the user to fitler freets by
       */
      state.filter = filter;
    },
    // updateNestMembers(state, nestMembers) {
    //   /**
    //    * Update the stored freets filter to the specified one.
    //    * @param filter - Username of the user to fitler freets by
    //    */
    //   state.members = nestMembers;
    // },
    updateFreets(state, freets) {
      /**
       * Update the stored freets to the provided freets.
       * @param freets - Freets to store
       */
      state.freets = freets;
    },
    updateNests(state, nests) {
      /**
       * Update the stored nests to the provided nests.
       * @param freets - Nests to store
       */
      state.nests = nests;
    },
    updateFriends(state, friends) {
      /**
       * Update the stored friends to the provided friends.
       * @param freets - Friends to store
       */
      state.friends = friends;
    },
    updateTimes(state, times) {
      /**
       * Update the stored times to the provided times.
       * @param freets - Times to store
       */
      state.times = times;
    },
    async refreshTimes(state) {
      /**
       * Request the server for the currently available times.
       */
      if (state.username !== null){
        const url = `/api/times?creator=${this.state.username}`;
        const res = await fetch(url).then(async r => r.json());
        state.times = res.times;
      } else {
        state.times = [];
      }
    },
    async refreshFreets(state) {
      /**
       * Request the server for the currently available freets.
       */
      const url = state.filter ? `/api/freets?author=${state.filter}` : '/api/freets';
      const res = await fetch(url).then(async r => r.json());
      state.freets = res;
    },
    async refreshNests(state) {
      /**
       * Request the server for the currently available nests.
       */
      const url = `/api/nests?creator=${state.username}`;
      const res = await fetch(url).then(async r => r.json());
      state.nests = res;
    }, 
    async refreshFriends(state) {
      /**
       * Request the server for the currently available friends.
       */
      const url = `/api/friends?user=${state.username}`;
      const res = await fetch(url).then(async r => r.json());
      state.friends = res;
    },
    // async refreshNestMembers(state, nestId) {
    //   /**
    //    * Request the server for the currently available nests.
    //    */
      
    //   const url = `/api/nests/${nestId}/members`;
    //   const res = await fetch(url).then(async r => r.json());
    //   state.members = res;
    // }
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
