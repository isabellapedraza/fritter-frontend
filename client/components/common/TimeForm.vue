<template>
  <form @submit.prevent="submit">
    <input
      v-model="value"
      type="time"
      :placeholder="placeholder"
    >
    <button
      type="submit"
    >
      {{ button }}
    </button>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </form>
</template>
  
  <script>
  export default {
    name: 'TimeForm',
    props: {
      placeholder: {
        type: String,
        default: ''
      },
      button: {
        type: String,
        default: 'Submit'
      }
    },
    data() {
      return {value: '', alerts: {}};
    }
  };
  </script>
  
  <style scoped>
  form {
      display: flex;
      position: relative;
  }
  
  input {
      padding: 0 5px;
      min-width: 200px;
  }
  </style>