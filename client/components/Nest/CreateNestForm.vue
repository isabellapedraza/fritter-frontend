<!-- Form for creating nests (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'CreateNestForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/nests',
      method: 'POST',
      hasBody: true,
      fields: [
      {id: 'name', label: 'nest name', value: ''}
      ],
      title: 'Create Nest',
      refreshNest: true,
      callback: () => {
        const message = 'Successfully created a new nest!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
