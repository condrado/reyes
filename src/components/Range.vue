<template>
  <div>
    <Slider v-model="value" @update="updateRange" />
  </div>
</template>

<script>
import Slider from '@vueform/slider/dist/slider.js'
import { mapActions } from 'vuex'

export default {
  name: 'CompRange',
  components: {
    Slider,
  },
  
  data() {
    return {
      value: this.$store.state.range
    }
  },


  methods: {
    ...mapActions({
      setRange: 'setRange'
    }),

    updateRange() {
      this.setRange(this.value)
      console.log(this.$store.state.range)
      this.$emit('updateRange')
    }
  }
}
</script>


<style lang="scss">
 @import '@vueform/slider/themes/default.css'
</style>