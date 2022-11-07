<!-- Reusable component representing a single nest and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<!-- <template>
  <section>
    <div class="member">
      <h3 class="username">
        {{ user.username }}
      </h3>
    </div> 
    <button @click="removeMember">
      ❌
    </button>
  </section>
</template>

<script>
export default {
  name: 'MemberComponent',
  props: {
    // Data from the stored user
    user: {
      type: Object,
      required: true
    }
  },
  methods: {
    removeMember() {
      /**
       * Deletes this member from a nest.
       */
      const params = {
        method: 'PUT',
        body: JSON.stringify({memberId: this.user._id, operation: 'remove'}),
        callback: () => {
          this.$store.commit('alert', {
            message: `Successfully removed ${this.user.username} from nest!`, status: 'success'
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
        const r = await fetch(`/api/nests/${this.$route.params.nestId}/members`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.$store.commit('refreshNestMembers');

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

</style> -->
