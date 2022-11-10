<!-- Default page that also displays freets -->

<template>
  <main>
    <h1
      v-if="$route.params.username === $store.state.username"
    >
      my profile page
    </h1>
    <h1
      v-else
    >
      {{ $route.params.username }}'s profile page
    </h1>
    <section class="image">
      <img :src="image">
    </section>

    <hr>

    <section class="buttons">
      <router-link
        v-if="$route.params.username === $store.state.username"
        to="/friends"
      >
        <button>
          🐣 chirpers
        </button>
      </router-link>
      <router-link
        v-if="$route.params.username !== $store.state.username"
        :to="{ name: 'MutualFriends', params: { user: $route.params.username}}"
      >
        <button>
          🐣 mutual chirpers
        </button>
      </router-link>

      <router-link
        v-if="$route.params.username !== $store.state.username"
        :to="{ name: 'SuggestedFriends', params: { user: $route.params.username}}"
      >
        <button>
          🌐 suggested chirpers
        </button>
      </router-link>
      
      <router-link
        v-if="$route.params.username === $store.state.username"
        to="/nests"
      >
        <button>
          🪺 nests
        </button>
      </router-link>

      <div
        v-if="$route.params.username !== $store.state.username"
        class="right"
      >
        <button 
          v-if="$store.getters.areFriends($route.params.username)"
          @click="removeFriend"
        >
          Unfriend ❌
        </button>
        <button 
          v-else
          @click="addFriend"
        >
          Friend ➕
        </button>
      </div>
      <router-link
        v-if="$route.params.username === $store.state.username"
        to="/account"
      >
        <button>
          ✏️ edit profile
        </button>
      </router-link>
    </section>

    <section 
      v-if="$route.params.username !== $store.state.username"
      class="nests"
    >
      <h4 v-if="$store.getters.getProfileNests($route.params.username).length">
        Nests:
      </h4>
      <h4 v-else> 
        not part of any nests
      </h4>

      <QuickNestComponent
        v-for="nest in $store.getters.getProfileNests($route.params.username)"
        :key="nest.id"
        :nest="nest"
      />
    </section>
    <br>
    
    <hr>

    <h2 v-if="$route.params.username === $store.state.username"> all chirps </h2>

    <div
      v-if="$route.params.username === $store.state.username"
    >
      <FreetComponent
        v-for="freet in $store.getters.userFreets"
        :key="freet.id"
        :freet="freet"
      />
      <p> end of chirps </p>
    </div>
  </main>
</template>

<script>
import image from "@/public/images/IMG_3378.jpeg"
import FreetComponent from '@/components/Freet/FreetComponent.vue';
import QuickNestComponent from '@/components/Nest/QuickNestComponent.vue';

export default {
  name: 'ProfilePage',
  components: {FreetComponent, QuickNestComponent},
  data: function () {
    return {
      image: image
    }
  },
  mounted() {
    this.$store.commit('refreshFriends');
    this.$store.commit("refreshNestMembers");
    this.$store.commit("refreshNestPosts");
  },
  methods: {
    removeFriend() {
      /**
       * Deletes this friend.
       */
      const params = {
        method: 'DELETE',
        body: JSON.stringify({recipient: this.$route.params.username}),
        callback: () => {
          this.$store.commit('alert', {
            message: `Successfully removed ${this.$route.params.username} as a friend !`, status: 'success'
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
        body: JSON.stringify({recipient: this.$route.params.username}),
        callback: () => {
          this.$store.commit('alert', {
            message: `Successfully added ${this.$route.params.username} as a friend !`, status: 'success'
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

.image {
  display: flex;
  flex-direction: column;
}

.buttons {
  display: inline
}

hr {
  margin-top: 40px;
}

div {
  display: inline;
}

header, header > * {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

button {
    margin-right: 10px;
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}
</style>
