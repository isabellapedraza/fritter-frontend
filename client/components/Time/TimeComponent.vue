<!-- Reusable component representing a single nest and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <section>
    <h3> {{ time.groupId }} </h3>
    <p> viewable on feed from <b> {{ time.startTime }} </b> to <b> {{ time.endTime }} </b> </p>
    <div>
      <button
        v-if="editingStartTime"
        @click="submitEditStartTime"
      >
        ✅ Save changes
      </button>
      <button
        v-if="editingStartTime"
        @click="stopEditingStartTime"
      >
        🚫 Discard changes
      </button>
      <button
        v-if="!editingStartTime"
        @click="startEditingStartTime"
      >
        ✏️ Edit Start Time
      </button>
    </div>
    <input
      v-if="editingStartTime"
      type="time"
      class="startTime"
      :value="newStartTime"
      @input="newStartTime = $event.target.value"
    >
    <div>
      <button
        v-if="editingEndTime"
        @click="submitEditEndTime"
      >
        ✅ Save changes
      </button>
      <button
        v-if="editingEndTime"
        @click="stopEditingEndTime"
      >
        🚫 Discard changes
      </button>
      <button
        v-if="!editingEndTime"
        @click="startEditingEndTime"
      >
        ✏️ Edit End Time
      </button>
    </div>
    <input
      v-if="editingEndTime"
      type="time"
      class="endTime"
      :value="newEndTime"
      @input="newEndTime = $event.target.value"
    >
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
</template>

<script>

export default {
  name: 'TimeComponent',
  //components: {VueTimepicker},
  props: {
    // Data from the stored nest
    time: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      editingEndTime: false, 
      editingStartTime: false,
      newEndTime: this.time.endTime, 
      newStartTime: this.time.startTime, 
      alerts: {} 
    };
  },
  methods: {
    startEditingEndTime() {
        /**
         * Enables edit mode on this time's end time.
         */
        this.editingEndTime = true; // Keeps track of if a freet is being edited
        this.newEndTime = this.time.endTime; // The content of our current "draft" while being edited
      },
    stopEditingEndTime() {
      /**
       * Disables edit mode on this time's end time.
       */
      this.editingEndTime = false;
      this.newEndTime = this.time.endTime;
    },
    submitEditEndTime() {
      /**
       * Updates time to have the submitted end time.
       */
      if (this.time.endTime === this.newEndTime) {
        const error = 'Error: Edited start time should be different than current start time.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: 'PUT',
        message: 'Successfully edited end time!',
        body: JSON.stringify({endTime: this.newEndTime}),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.requestEndTime(params);
    },
    async requestEndTime(params) {
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
        this.editingEndTime = false;
        this.$store.commit('refreshTimes');

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    startEditingStartTime() {
        /**
         * Enables edit mode on this time's start time.
         */
        this.editingStartTime = true; // Keeps track of if a freet is being edited
        this.newStartTime = this.time.startTime; // The content of our current "draft" while being edited
      },
    stopEditingStartTime() {
      /**
       * Disables edit mode on this time's start time.
       */
      this.editingStartTime = false;
      this.newStartTime = this.time.startTime;
    },
    submitEditStartTime() {
      /**
       * Updates time to have the submitted start time.
       */
      if (this.time.startTime === this.newStartTime) {
        const error = 'Error: Edited start time should be different than current start time.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: 'PUT',
        message: 'Successfully edited start time!',
        body: JSON.stringify({startTime: this.newStartTime}),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.requestStartTime(params);
    },
    async requestStartTime(params) {
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
        const r = await fetch(`/api/times/${this.time._id}/startTime`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }
        this.editingStartTime = false;
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

.alerts {
    position:fixed;
    top:0;
    width: fit-content;
    z-index:100;
}
</style>
