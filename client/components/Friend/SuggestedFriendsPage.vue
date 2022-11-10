<!-- Page that displays nests -->

<template>
  <main>
    <section>
      <h1> suggested chirpers </h1>
    </section>
    
    <hr>
    <section>
      <FriendComponent
        v-for="user in $store.state.suggested"
        :key="user.id"
        :user="user"
      />
    </section>
    <p>end of suggested chirpers</p>
  </main>
</template>
    
    <script>
    
    import FriendComponent from '@/components/Friend/FriendComponent.vue';
    
    export default {
      name: 'SuggestedFriendsPage',
      components: {FriendComponent},
      mounted() {
        this.$store.commit("refreshSuggested", this.$route.params.user);  //makes sure page always has most recent friends
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