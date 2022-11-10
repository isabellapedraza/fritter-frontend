<!-- A basic navigation bar component -->
<!-- Example of a component which is included on all pages (via App.vue) -->
<!-- This navbar takes advantage of both flex and grid layouts for positioning elements; feel free to redesign as you see fit! -->

<template>
  <nav>
    <div class="left">
      <h1 class="title">
        fritter
      </h1>
    </div>
    <div class="right">
      <router-link to="/">
        🌐 feed
      </router-link>
      <router-link 
        v-if="$store.state.username"
        :to="{ name: 'Profile', params: { username: $store.state.username}}"
      >
        🐥 profile
      </router-link>
      <router-link
        v-if="$store.state.username"
        to="/nests"
      >
        🪺 nests
      </router-link>
      <router-link
        v-if="$store.state.username"
        to="/times"
      >
        🕑 times
      </router-link>
      <router-link
        v-else
        to="/login"
      >
        login
      </router-link>
    </div>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in $store.state.alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </nav>
</template>

<style scoped>
nav {
    padding: 1vw 2vw;
    background-color: #CFDFC5;
    display: flex;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    flex-direction: column;
    z-index: 999;
}

.title {
  padding-top: 19px;
  font-size: 38px;
  margin: 0 5px;
  color: #22452c;
}

.left {
  padding-top: 40px;
	display: flex;
  grid-auto-flow: column;
	align-items: center;
  width: max-content;
}

.right {
    padding-top: 30px;
    font-size: 28px;
    display: flex;
    gap: 16px;
    grid-auto-flow: column;
    align-items: center;
    flex-direction: column;
}

.right a {
    margin-left: 5px;
}

.alerts {
    width: 25%;
}
</style>
