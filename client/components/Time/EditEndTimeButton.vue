
<template>
  <article
    class="time"
  >
    <div
      v-if="$store.state.username === time.creatorId"
      class="actions"
    >
      <button
        v-if="editing"
        @click="submitEdit"
      >
        ✅ Save changes
      </button>
      <button
        v-if="editing"
        @click="stopEditing"
      >
        🚫 Discard changes
      </button>
      <button
        v-if="!editing"
        @click="startEditing"
      >
        ✏️ Edit End Time
      </button>
    </div>
    <input
      v-if="editing"
      type="time"
      class="endTime"
      :value="newEndTime"
      @input="newEndTime = $event.target.value"
    >
    <p
      v-else
      class="endTime"
    >
      {{ time.endTime }}
    </p>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </article>
</template>
  
  <script>
  export default {
    name: 'EditEndTimeButton',
    props: {
      // Data from the stored time
      time: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        editing: false, 
        newEndTime: this.time.endTime, 
        alerts: {} 
      };
    },
    methods: {
      startEditing() {
        /**
         * Enables edit mode on this time's start time.
         */
        this.editing = true; // Keeps track of if a freet is being edited
        this.newEndTime = this.time.endTime; // The content of our current "draft" while being edited
      },
      stopEditing() {
        /**
         * Disables edit mode on this time's start time.
         */
        this.editing = false;
        this.newEndTime = this.time.endTime;
      },
      submitEdit() {
        /**
         * Updates time to have the submitted start time.
         */
        if (this.time.endTime === this.newStartTime) {
          const error = 'Error: Edited start time should be different than current start time.';
          this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
          setTimeout(() => this.$delete(this.alerts, error), 3000);
          return;
        }
  
        const params = {
          method: 'PUT',
          message: 'Successfully edited start time!',
          body: JSON.stringify({endTime: this.newEndTime}),
          callback: () => {
            this.$set(this.alerts, params.message, 'success');
            setTimeout(() => this.$delete(this.alerts, params.message), 3000);
          }
        };
        this.request(params);
      },
      async request(params) {
        /**
         * Submits a request to the time's endpoint
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
          const r = await fetch(`/api/times/${this.time._id}/endTime`, options);
          if (!r.ok) {
            const res = await r.json();
            throw new Error(res.error);
          }
  
          this.editing = false;
          this.$store.commit('refreshTimes');
  
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