<!-- Reusable component representing a single time and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <section>
    <h3>
      {{ time.groupId }}
    </h3>
    <p>
      Viewable on feed from {{ time.startTime }} to {{ time.endTime }}
    </p>
    <EditStartTimeButton
      v-if="!editing"
      :time="time"
    />
    <EditEndTimeButton
      v-if="!editing"
      :time="time"
    />
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

import EditStartTimeButton from '../Time/EditStartTimeButton.vue';
import EditEndTimeButton from '../Time/EditEndTimeButton.vue';

export default {
  name: 'TimeComponent',
  components: {EditStartTimeButton, EditEndTimeButton},
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
      alerts: {} // Displays success/error messages encountered during time modification
    };
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
