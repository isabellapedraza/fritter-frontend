<!-- Form for getting times (all, from user) (inline style) -->

<script>
import InlineForm from '@/components/common/InlineForm.vue';

export default {
  name: 'GetTimesForm',
  mixins: [InlineForm],
  data() {
    return {value: this.$store.state.username};
  },
  methods: {
    async submit() {
      const url = this.username ? `/api/times?creator=${this.value}` : '/api/times';
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }

        this.$store.commit('updateTimes', res);
      } catch (e) {
        if (this.value === this.$store.state.username) {
          this.value = ''; // Clear filter to show all users' freets
          this.$store.commit('refreshTimes');
        } else {
          // Otherwise reset to previous fitler
          this.value = this.$store.state.username;
        }

        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>
