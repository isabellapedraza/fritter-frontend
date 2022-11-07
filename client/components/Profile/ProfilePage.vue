<!-- Default page that also displays freets -->

<template>
  <main>
    <h1 v-if="">
      {{ $store.state.username }}'s profile page
    </h1>
    <section class="image">
      <img :src="image">
    </section>

    <hr>

    <section class="buttons">
      <router-link
        v-if="$store.state.username"
        to="/friends"
      >
        <button>
          🐣 chirpers
        </button>
      </router-link>

      <router-link
        v-if="$store.state.username"
        to="/nests"
      >
        <button>
          🪺 nests
        </button>
      </router-link>
    </section>

    <hr>

    <h2> all chirps </h2>

    <FreetComponent
      v-for="freet in $store.getters.userFreets"
      :key="freet.id"
      :freet="freet"
    />

    <p> end of chirps </p>
  </main>
</template>

<script>
import image from "@/public/images/IMG_3378.jpeg"
import FreetComponent from '@/components/Freet/FreetComponent.vue';

export default {
  name: 'ProfilePage',
  components: {FreetComponent},
  data: function () {
    return {
      image: image
    }
  },
  mounted() {
  }
};
</script>

<style scoped>

section {
  display: flex;
  flex-direction: column;
}

.buttons {
  display: inline
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
