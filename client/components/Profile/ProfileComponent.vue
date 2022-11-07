<!-- Profile page component

<template>
  <main>
    <h1 v-if= > {{ $store.state.username }}'s Profile Page </h1>
    <section class="image">
      <img :src="image" />
    </section>

    <hr>

    <section class="buttons">
      <button>
        Chirpers
      </button>

      <button>
        Nests
      </button>
    </section>





    
  </main>
</template>

<script>
import image from "@/public/images/IMG_3378.jpeg"

export default {
  name: 'ProfilePage',
  components: {},
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
</style> -->
