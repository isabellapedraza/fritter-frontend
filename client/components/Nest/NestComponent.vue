<!-- Reusable component representing a single nest and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <section>
    <div class="nest">
      <router-link :to="{ name: 'NestMembers', params: { nestId: nest._id }}">
        <h3 class="name">
          {{ nest.name }}
        </h3>
      </router-link>
    </div>
    <button @click="deleteNest">
      🗑️ Delete
    </button>
  </section>
</template>

<script>
export default {
  name: 'NestComponent',
  props: {
    // Data from the stored nest
    nest: {
      type: Object,
      required: true
    }
  },
  methods: {
    deleteNest() {
      /**
       * Deletes this nest.
       */
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted nest!', status: 'success'
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
        const r = await fetch(`/api/nests/${this.nest._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.$store.commit('refreshNests');

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
