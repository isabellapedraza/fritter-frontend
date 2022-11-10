<script>
import InlineForm from '@/components/common/InlineForm.vue';

export default {
  name: 'AddToNestForm',
  mixins: [InlineForm],
  data() {
    return {
      alerts: {} 
    };
  },
  methods: {
    submit() {
      if (this.$store.getters.inNest(this.$route.params.nestId, this.value)) {
        const error = 'Error: Cannot add a member that is already part of the nest';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      if (this.value.trim().length === 0) {
        const error = 'Error: cannot add an empty string to the nest';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: 'PUT',
        message: 'Successfully added to nest!',
        body: JSON.stringify({memberId: this.value, operation: 'add'}),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
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
          throw new Error("Error: Cannot add a user that does not exist");
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