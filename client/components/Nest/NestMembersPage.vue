<!-- Page that displays nests -->

<template>
  <main>
    <AddToNestForm 
      ref="addToNestForm"
      value="username"
      button="➕ add to nest"
    />
    <section>
      <h1> Chirpers in Nest </h1>
    </section>

    <section>
      <MemberComponent
        v-for="user in $store.getters.getNestMembers($route.params.nestId)"
        :key="user.id"
        :user="user"
      />
    </section>

    <p>End of Nest's Members</p>
  </main>
</template>

<script>

import MemberComponent from '../Nest/MemberComponent.vue';
import AddToNestForm from '../Nest/AddToNestForm.vue';

export default {
  name: 'NestMembersPage',
  components: {MemberComponent, AddToNestForm},
  mounted() {
    this.$store.commit("refreshNestMembers");  //makes sure page always has most recent nests
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
