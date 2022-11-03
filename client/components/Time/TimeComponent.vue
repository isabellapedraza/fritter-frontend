<!-- Reusable component representing a single time and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="time"
  >
    <header>
      <h3 class="nest">
        {{ time.groupId }}
      </h3>
      <div
        v-if="$store.state.username === time.creatorId"
        class="actions"
      >
        <button
          v-if="startEditing"
          @click="submitStartEdit"
        >
          ✅ Save changes
        </button>
        <button
          v-if="startEditing"
          @click="stopStartEditing"
        >
          🚫 Discard changes
        </button>
        <button
          v-if="!startEditing"
          @click="startStartEditing"
        >
          ✏️ Edit Start Time
        </button>
      </div>
      <!-- <div
        v-if="$store.state.username === time.creatorId"
        class="actions"
      >
        <button
          v-if="endEditing"
          @click="submitEndEdit"
        >
          ✅ Save changes
        </button>
        <button
          v-if="endEditing"
          @click="stopEndEditing"
        >
          🚫 Discard changes
        </button>
        <button
          v-if="!endEditing"
          @click="endEndEditing"
        >
          ✏️ Edit End Time
        </button>
      </div> -->
    </header>
    <textarea
      v-if="startEditing"
      class="startTime"
      :value="startDraft"
      @input="startDraft = $event.target.value"
    />
    <!-- <textarea
      v-if="stopEditing"
      class="endTime"
      :value="endDraft"
      @input="endDraft = $event.target.value"
    /> -->
    <p
      v-else
      class="time"
    >
      Viewable on feed from {{ time.startTime }} to {{ time.endTime }}
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
  name: 'TimeComponent',
  props: {
    // Data from the stored time
    time: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      startEditing: false, // Whether or not this time is in edit mode
      endEditing: false, // Whether or not this time is in edit mode
      startDraft: this.time.startTime, // Potentially-new startTime for this time
      endDraft: this.time.endTime, // Potentially-new startTime for this time
      alerts: {} // Displays success/error messages encountered during time modification
    };
  },
  methods: {
    startStartEditing() {
      /**
       * Enables edit mode on this start of time.
       */
      this.startEditing = true; // Keeps track of if a time is being edited
      this.startDraft = this.time.startTime; // The time of our current "draft" while being edited
    },
    stopStartEditing() {
      /**
       * Disables edit mode on start of this time.
       */
      this.startEditing = false;
      this.startDraft = this.time.startTime;
    },
    submitStartEdit() {
      /**
       * Updates start time to have the submitted draft startTime.
       */
      if (this.time.startTime === this.startDraft) {
        const error = 'Error: Edited start time should be different than current start time.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: 'PUT',
        message: 'Successfully edited time!',
        body: JSON.stringify({startTime: this.startDraft}),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.StartRequest(params);
    },
    async StartRequest(params) {
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

        this.startEditing = false;
        this.$store.commit('refreshTimes');

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
  //   startEndEditing() {
  //     /**
  //      * Enables edit mode on this end of time.
  //      */
  //     this.endEditing = true; // Keeps track of if a time is being edited
  //     this.endDraft = this.time.endTime; // The time of our current "draft" while being edited
  //   },
  //   stopEndEditing() {
  //     /**
  //      * Disables edit mode on end of this time.
  //      */
  //     this.endEditing = false;
  //     this.endDraft = this.time.endTime;
  //   },
  //   submitEndEdit() {
  //     /**
  //      * Updates end time to have the submitted draft endTime.
  //      */
  //     if (this.time.endTime === this.endDraft) {
  //       const error = 'Error: Edited end time should be different than current end time.';
  //       this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
  //       setTimeout(() => this.$delete(this.alerts, error), 3000);
  //       return;
  //     }

  //     const params = {
  //       method: 'PUT',
  //       message: 'Successfully edited time!',
  //       body: JSON.stringify({endTime: this.startDraft}),
  //       callback: () => {
  //         this.$set(this.alerts, params.message, 'success');
  //         setTimeout(() => this.$delete(this.alerts, params.message), 3000);
  //       }
  //     };
  //     this.EndRequest(params);
  //   },
  //   async EndRequest(params) {
  //     /**
  //      * Submits a request to the time's endpoint
  //      * @param params - Options for the request
  //      * @param params.body - Body for the request, if it exists
  //      * @param params.callback - Function to run if the the request succeeds
  //      */
  //     const options = {
  //       method: params.method, headers: {'Content-Type': 'application/json'}
  //     };
  //     if (params.body) {
  //       options.body = params.body;
  //     }

  //     try {
  //       const r = await fetch(`/api/times/${this.time._id}/endTime`, options);
  //       if (!r.ok) {
  //         const res = await r.json();
  //         throw new Error(res.error);
  //       }

  //       this.editing = false;
  //       this.$store.commit('refreshTimes');

  //       params.callback();
  //     } catch (e) {
  //       this.$set(this.alerts, e, 'error');
  //       setTimeout(() => this.$delete(this.alerts, e), 3000);
  //     }
  //   }
  }
};
</script>

<style scoped>
.time {
    border: 1px solid #111;
    padding: 20px;
    position: relative;
}
</style>
