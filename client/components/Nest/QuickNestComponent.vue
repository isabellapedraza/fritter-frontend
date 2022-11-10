<!-- Reusable component representing a single nest and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <section>
    <div class="nest">
      <p class="name">
        {{ nest.name }}
      </p>
    </div>
  </section>
</template>
  
<script>

export default {
name: 'QuickNestComponent',
props: {
    // Data from the stored nest
    nest: {
    type: Object,
    required: true
    }
},
methods: {
}
};
</script>

<style scoped>

.nest {
  background: #C8D9BF;
  width: fit-content;
  height: fit-content;
  border-radius: 25px;
  float:left;
  margin-right: 10px;
}

.name {
  padding-top: 13px;
  padding-left: 10px;
  padding-right: 10px;
  display: inline;
}
</style>