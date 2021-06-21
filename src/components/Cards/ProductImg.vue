<template>
  <img alt="Image placeholder" :src="img()" />
</template>
<script>
export default {
  name: "product-img",
  components: {},
  props: {
    image: {},
  },
  methods: {
    img() {
      return this.image ? this.image.src : "img/brand/placeholder.png";
    },
  },
};
</script>
<style></style>
