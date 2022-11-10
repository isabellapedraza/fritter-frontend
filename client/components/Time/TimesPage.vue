<!-- Page that displays nests -->
<!-- time picker : https://www.npmjs.com/package/vue2-timepicker -->

<template>
  <main>
    <section>
      <h1> nest times </h1>
    </section>

    <hr>
    
    <section>
      <TimeComponent
        v-for="time in $store.state.times"
        :key="time.id"
        :time="time"
      />
    </section>
    <hr>
    <p>end of Times</p>
  </main>
</template>

<script>

import TimeComponent from '@/components/Time/TimeComponent.vue';

export default {
  name: 'TimePage',
  components: {TimeComponent},
  mounted() {
    this.$store.commit("refreshTimes");  //makes sure page always has most recent times
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

hr {
  margin-top: 30px;
}
section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}
</style>
