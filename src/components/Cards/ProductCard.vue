<template>
  <card class="card-stats" :show-footer-line="true">
    <b-row>
      <b-col cols="auto">
        <slot name="icon">
          <div class="text-white">
            <a href="javascript:;" class="avatar avatar-xl">
              <product-img :image="image" />
            </a>
          </div>
        </slot>
      </b-col>
      <b-col>
        <slot>
          <h5 class="card-title text-uppercase text-muted mb-0" v-if="title">
            {{ title }}
          </h5>
        </slot>
      </b-col>
    </b-row>

    <p class="mt-3 mb-0 text-sm">
      <slot name="footer"> </slot>
    </p>
  </card>
</template>
<script>
import Card from "./Card.vue";

export default {
  name: "product-card",
  components: {
    Card,
  },
  props: {
    type: {
      type: String,
      default: "primary",
    },
    title: String,
    image: {},
  },
};
</script>
<style></style>
