<!-- Page that displays nests -->

<template>
  <main>
    <section>
      <h1> My Chirpers </h1>
    </section>

    <hr>
    <section>
      <FriendComponent
        v-for="user in $store.state.friends"
        :key="user.id"
        :user="user"
      />
    </section>
    <p>End of Chirpers</p>
  </main>
</template>

<script>

import FriendComponent from '@/components/Friend/FriendComponent.vue';

export default {
  name: 'FriendsPage',
  components: {FriendComponent},
  mounted() {
    this.$store.commit("refreshFriends");  //makes sure page always has most recent friends
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
