<!-- Form for getting times (all, from user) (inline style) -->

<script>
import InlineForm from '@/components/common/InlineForm.vue';

export default {
  name: 'GetTimesForm',
  mixins: [InlineForm],
  data () {
    return {times: this.$store.state.times}
  },
  methods: {
    async submit() {
      const url = `/api/times?creator=${this.$store.state.username}`;
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        
        this.$store.commit('updateTimes', res);
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>
