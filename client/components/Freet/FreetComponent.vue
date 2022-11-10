<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="freet"
  >
    <section
      v-if="freet.author === $store.state.username || $store.getters.isOnFeed(freet.author)"
    >
      <header>
        <router-link 
          :to="{ name: 'Profile', params: { username: freet.author}}"
        >
          <h3 class="author">
            @{{ freet.author }}
          </h3>
        </router-link>
        <div
          v-if="$store.state.username === freet.author"
          class="actions"
        >
          <button
            v-if="editing"
            @click="submitEdit"
          >
            ✅ save changes
          </button>
          <button
            v-if="editing"
            @click="stopEditing"
          >
            🚫 discard changes
          </button>
          <button
            v-if="!editing"
            @click="startEditing"
          >
            ✏️ edit
          </button>
          <button @click="deleteFreet">
            🗑️ delete
          </button>
        </div>
      </header>
      <textarea
        v-if="editing"
        class="content"
        :value="draft"
        @input="draft = $event.target.value"
      />
      <p
        v-else
        class="content"
      >
        {{ freet.content }}
      </p>
      <p class="info">
        posted at {{ freet.dateModified }}
        <i v-if="freet.edited">(edited)</i>
      </p>
    
      <section
        v-if="freet.author !== $store.state.username"
      >
        <h4
          v-if="$store.getters.getProfileNests(freet.author).length"
        >
          Nests:
        </h4>
        <QuickNestComponent
          v-for="nest in $store.getters.getProfileNests(freet.author)"
          :key="nest.id"
          :nest="nest"
        />
      </section>

      <section
        v-else
      >
        <h4
          v-if="$store.getters.getProfileNests(freet.author).length"
        >
          nests:
        </h4>
        <div
          v-if="$store.getters.getPostNests(freet._id).length"
        >
          <QuickNestComponent
            v-for="nest in $store.getters.getPostNests(freet._id)"
            :key="nest.id"
            :nest="nest"
          />
        </div>
        <!-- <label> add to nest:</label>
        <select
          v-model="selected"
        >
          <option
            v-for="option in $store.state.nests"
            :key="option"
            :value="option.name"
          >
            {{ option.name }}
          </option>
        </select> -->
      </section>
   
      <section class="alerts">
        <article
          v-for="(status, alert, index) in alerts"
          :key="index"
          :class="status"
        >
          <p>{{ alert }}</p>
        </article>
      </section>
    </section>
    <section
      v-else
    >
      <p>this chirps's nest is asleep 🪺💤</p>
    </section>
  </article>
</template>

<script>

import QuickNestComponent from '@/components/Nest/QuickNestComponent.vue';

export default {
  name: 'FreetComponent',
  components: {QuickNestComponent},
  props: {
    // Data from the stored freet
    freet: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      editing: false, // Whether or not this freet is in edit mode
      selected: '',
      draft: this.freet.content, // Potentially-new content for this freet
      alerts: {} // Displays success/error messages encountered during freet modification
    };
  },
  methods: {
    // addToNest(){
    //   const options2 = {
    //     method2: 'PUT',
    //     headers: {'Content-Type': 'application/json'},
    //     credentials: 'same-origin', // Sends express-session credentials with request
    //     body: JSON.stringify({operation: 'add', freetId: this.freet._id}),
    //     callback: () => {
    //       this.$set(this.alerts, options2.message, 'success');
    //       setTimeout(() => this.$delete(this.alerts, options2.message), 3000);
    //     }
    //   }
    //   try {
    //     const r2 = await fetch(`/api/nests/${this.selected._id}`, options2);
    //     if (!r2.ok) {
    //       const res = await r2.json();
    //       throw new Error(res.error);
    //     }

    //     this.$store.commit("refreshNestPosts");
    //     this.$store.commit("refreshNestMembers");
    //     this.$store.commit("refreshFreets");

    //     options2.callback();

    //   } catch (e) {
    //     this.$set(this.alerts, e, 'error');
    //     setTimeout(() => this.$delete(this.alerts, e), 3000);
    //   }
    // },
    startEditing() {
      /**
       * Enables edit mode on this freet.
       */
      this.editing = true; // Keeps track of if a freet is being edited
      this.draft = this.freet.content; // The content of our current "draft" while being edited
    },
    stopEditing() {
      /**
       * Disables edit mode on this freet.
       */
      this.editing = false;
      this.draft = this.freet.content;
    },
    deleteFreet() {
      /**
       * Deletes this freet.
       */
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted freet!', status: 'success'
          });
        }
      };
      this.request(params);
    },
    submitEdit() {
      /**
       * Updates freet to have the submitted draft content.
       */
      if (this.freet.content === this.draft) {
        const error = 'Error: Edited freet content should be different than current freet content.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: 'PATCH',
        message: 'Successfully edited freet!',
        body: JSON.stringify({content: this.draft}),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(params);
    },
    async request(params) {
      /**
       * Submits a request to the freet's endpoint
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
        const r = await fetch(`/api/freets/${this.freet._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit('refreshFreets');

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
.freet {
    border: 1px solid #111;
    padding: 20px;
    position: relative;
}

QuickNestComponent {
  display: inline;
}
</style>
