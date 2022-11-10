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
    friends: null, // All the friends created in the app
    mutual: null,
    suggested: null,
    times: null, // All the times created in the app
    nests: null, // All the nests created in the app,
    nestToMembers: null,
    nestToPosts: null,
    nestFilter: null,
    nestToTimes: null,
    username: null, // Username of the logged in user
    alerts: {} // global success/error messages encountered during submissions to non-visible forms
  },
  getters: {
    userFreets: state => {
      return state.freets.filter(freet => freet.author === state.username);
    },
    isOnFeed: state => (freetAuthor) => {
    /**
     * Inspo from https://stackoverflow.com/a/59717615
     */
    const nestIds = [];
    for (const [nestId, array] of state.nestToMembers){
      for (const member of array){
        if (member.username === freetAuthor){
          if (!nestIds.includes(nestId)){
            nestIds.push(nestId)
          }
        }
      }
    }

    const nests = [];

    for (const nest of state.nests){
      for (const id of nestIds){
        if (nest._id === id){
          nests.push(nest.name);
        } 
      }
    }

    let isOnFeed = false;
    const d = new Date();

    for (const nest of nests){
      const time = state.nestToTimes.get(nest);
      const regExTime = /([0-9][0-9]):([0-9][0-9])/;
      const regExTimeArrStart = regExTime.exec(time.startTime);
      const regExTimeArrEnd = regExTime.exec(time.endTime);
      if ((parseInt(regExTimeArrStart[1]) <= d.getHours() && parseInt(regExTimeArrStart[2]) <= d.getMinutes()) && (parseInt(regExTimeArrEnd[1]) >= d.getHours() && parseInt(regExTimeArrEnd[2]) >= d.getMinutes())){
        isOnFeed = true;
      }
    }

    return isOnFeed;

    },
    getNestOptions: state => {
      const items = [];
      for (const nest of state.nests){
        items.push(nest.name);
      }
      return items;
    },
    getNestMembers: state => (nestId) => {
      return state.nestToMembers.get(nestId);
    },
    areFriends: state => (userId) => {
      let check = false;
      for (const friend of state.friends){
        if (friend.username === userId){
          check = true;
        }
      }
      return check;
    }, 
    inNest: state => (nestId, username) => {
      let check = false;
      for (const member of state.nestToMembers.get(nestId)){
        if (member.username === username){
          check = true;
        }
      }
      return check;
    }, 
    getProfileNests: state => (username) => {
      const nestIds = [];
      for (const [nestId, array] of state.nestToMembers){
        for (const user of array){
          if (user.username === username){
            if (!nestIds.includes(nestId)){
              nestIds.push(nestId)
            }
          }
        }
      }

      const nests = [];

      for (const nest of state.nests){
        for (const id of nestIds){
          if (nest._id === id){
            nests.push(nest);
          } 
        }
      }
      return nests;
    },
    getPostNests: state => (freetId) => {
      const nestIds = [];
      for (const [nestId, array] of state.nestToPosts){
        for (const freet of array){
          if (freet._id === freetId){
            if (!nestIds.includes(nestId)){
              nestIds.push(nestId)
            }
          }
        }
      }

      const nests = [];

      for (const nest of state.nests){
        for (const id of nestIds){
          if (nest._id === id){
            nests.push(nest);
          } 
        }
      }
      return nests;
    },
    getPossiblePostNests: state => (freetId) => {
      const nestIds = [];
      for (const [nestId, array] of state.nestToPosts){
        for (const freet of array){
          if (freet._id !== freetId){
            if (!nestIds.includes(nestId)){
              nestIds.push(nestId)
            }
          }
        }
      }

      const nests = [];

      for (const nest of state.nests){
        for (const id of nestIds){
          if (nest._id === id){
            nests.push(nest);
          } 
        }
      }
      return nests;
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
    updateNestMembers(state, nestMembers) {
      /**
       * Update the stored freets filter to the specified one.
       * @param filter - Username of the user to fitler freets by
       */
      state.members = nestMembers;
    },
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
      const url = `/api/times?creator=${this.state.username}`;
      const res = await fetch(url).then(async r => r.json());
      state.times = res;
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
    async refreshNestMembers(state) {
    
      const nestToMembers = new Map();
      
       for (const nest of state.nests){
        const url = `/api/nests/${nest._id}/members`;
        const res = await fetch(url).then(async r => r.json());

        nestToMembers.set(nest._id, res);
       }

      state.nestToMembers = nestToMembers;
    },
    async refreshNestPosts(state) {
    
      const nestToPosts = new Map();
      
       for (const nest of state.nests){
        const url = `/api/nests/${nest._id}/posts`;
        const res = await fetch(url).then(async r => r.json());

        nestToPosts.set(nest._id, res);
       }

      state.nestToPosts = nestToPosts;
    },
    async refreshNestTimes(state) {
    
      const nestToTimes = new Map();
      const url = `/api/times?creator=${this.state.username}`;
      const res = await fetch(url).then(async r => r.json());
      state.times = res;
      
      for (const time of state.times){
        nestToTimes.set(time.groupId, time);
      }

      state.nestToTimes = nestToTimes;
    },
    async refreshMutual(state, user) {
    
      const url = `/api/friends/mutual?user=${user}`;
      const res = await fetch(url).then(async r => r.json());
      state.mutual = res;
    },
    async refreshSuggested(state, user) {
    
      const url = `/api/friends/suggested?user=${user}`;
      const res = await fetch(url).then(async r => r.json());
      state.suggested = res;
    },
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
