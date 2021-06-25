<template>
  <div class="pt-5">
    <b-row
      v-for="product in showProducts"
      :key="product.id"
      align-v="center"
      class="pb-3 mb-3 border-bottom"
    >
      <b-col md="auto">
        <!-- Avatar -->
        <a href="javascript:;" class="avatar avatar-xl">
          <product-img :image="product.image" />
        </a>
      </b-col>
      <b-col class="ml--2">
        <h4 class="mb-0">
          <a
            :href="'https://blaizecaprice.com/products/' + product.handle"
            target="blank"
            >{{ product.title }}</a
          >
        </h4>
      </b-col>
      <b-col md="auto">
        <base-button @click="handleEvent(product)" :type="type" size="xl">
          <i :class="icon"></i>
        </base-button>
      </b-col>
    </b-row>
    <b-row v-if="products.length == 0">
      <b-col md="auto">
        <p>Sorry, product is available.</p>
      </b-col>
    </b-row>
    <!-- products pagination -->
    <b-row v-if="rows > 1">
      <b-col md="auto">
        <b-pagination
          v-model="currentPage"
          :total-rows="rows"
          :per-page="perPage"
          first-number
        ></b-pagination>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import _ from "lodash";
export default {
  props: ["products", "rows", "handleEvent", "type"],
  name: "tab-products",
  data() {
    return {
      limit: 5,
      perPage: 1,
      currentPage: 1,
    };
  },
  computed: {
    showProducts() {
      return _(this.products)
        .slice((this.currentPage - 1) * this.limit)
        .take(this.limit)
        .value();
    },
    icon() {
      return this.type === "danger"
        ? "far fa-2x fa-trash-alt"
        : "fas fa-2x fa-plus";
    },
  },
  methods: {},
};
</script>
