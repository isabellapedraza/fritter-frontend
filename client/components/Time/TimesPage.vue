<!-- Page that displays times -->

<template>
  <main>
    <section v-if="$store.state.username">
      <header>
        <h2>Welcome @{{ $store.state.username }}</h2>
        <div class="right">
          <GetTimesForm
            ref="getTimesForm"
          />
        </div>
      </header>
      <section
        v-if="$store.state.times.length"
      >
        <TimeComponent
          v-for="time in $store.state.times"
          :key="time.id"
          :time="time"
        />
      </section>
      <article
        v-else
      >
        <h3>No times found.</h3>
      </article>
    </section>
  </main>
</template>

<script>
import TimeComponent from '@/components/Time/TimeComponent.vue';
import EditStartTimeButton from '../Time/EditStartTimeButton.vue';
import EditEndTimeButton from '../Time/EditEndTimeButton.vue';
import GetTimesForm from '@/components/Time/GetTimesForm.vue';

export default {
  name: 'TimePage',
  components: {TimeComponent, GetTimesForm, EditStartTimeButton, EditEndTimeButton}, 
  mounted() {
    this.$refs.getTimesForm.submit();
  }
};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
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
