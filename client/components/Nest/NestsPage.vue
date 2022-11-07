<!-- Page that displays nests -->

<template>
  <main>
    <section>
      <CreateNestForm />
    </section>

    <hr>
    <section>
      <NestComponent
        v-for="nest in $store.state.nests"
        :key="nest.id"
        :nest="nest"
      />
    </section>
    <p>End of Nests</p>
  </main>
</template>

<script>

import CreateNestForm from '@/components/Nest/CreateNestForm.vue';
import NestComponent from '@/components/Nest/NestComponent.vue';

export default {
  name: 'NestPage',
  components: {CreateNestForm, NestComponent},
  mounted() {
    this.$store.commit("refreshNests");  //makes sure page always has most recent nests
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
