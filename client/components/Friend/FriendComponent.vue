<!-- Reusable component representing a single nest and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <section>
    <div class="friend">
      <h3 class="username">
        {{ user.username }}
      </h3>
    </div> 
    <button 
      v-if="$store.getters.areFriends(user.username)"
      @click="removeFriend"
    >
      unfriend ❌
    </button>
    <button 
      v-else
      @click="addFriend"
    >
      friend ➕
    </button>
  </section>
</template>

<script>
export default {
  name: 'FriendComponent',
  props: {
    // Data from the stored user
    user: {
      type: Object,
      required: true
    }
  },
  methods: {
    removeFriend() {
      /**
       * Deletes this friend.
       */
      const params = {
        method: 'DELETE',
        body: JSON.stringify({recipient: this.user.username}),
        callback: () => {
          this.$store.commit('alert', {
            message: `Successfully removed ${this.user.username} as a friend !`, status: 'success'
          });
        }
      };
      this.request(params);
    },
    addFriend() {
      /**
       * Deletes this friend.
       */
      const params = {
        method: 'POST',
        body: JSON.stringify({recipient: this.user.username}),
        callback: () => {
          this.$store.commit('alert', {
            message: `Successfully added ${this.user.username} as a friend !`, status: 'success'
          });
        }
      };
      this.request(params);
    },
    async request(params) {
      /**
       * Submits a request to the nest's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/friends`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.$store.commit('refreshFriends');

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>

<style scoped>


</style>
