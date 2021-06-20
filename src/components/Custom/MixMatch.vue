<template>
  <div class="pt-5">
    <b-row
      v-for="product in productsPage"
      :key="product.id"
      align-v="center"
      class="pb-3 mb-3 border-bottom"
    >
      <b-col md="auto">
        <!-- Avatar -->
        <a href="javascript:;" class="avatar avatar-xl">
          <img alt="Image placeholder" :src="product.image.src" />
        </a>
      </b-col>
      <b-col class="ml--2">
        <h4 class="mb-0">
          <a :href="'/products/' + product.handle" target="blank">{{
            product.title
          }}</a>
        </h4>
      </b-col>
      <b-col md="auto">
        <base-button @click="show(product)" :type="type" size="xl">
          <i :class="icon"></i>
          Create Mix Match product
        </base-button>
      </b-col>
    </b-row>
    <b-row v-if="products.length == 0">
      <b-col md="auto">
        <p>Sorry, no product is available.</p>
      </b-col>
    </b-row>
    <!-- engrave pagination -->
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
export default {
  props: ["products", "rows", "type"],
  data() {
    return {
      limit: 10,
      perPage: 1,
      currentPage: 1,
    };
  },
  computed: {
    productsPage() {
      return _(this.products)
        .slice((this.currentPage - 1) * this.limit)
        .take(this.limit)
        .value();
    },
    icon() {
      return this.type === "danger" ? "far  fa-trash-alt" : "fas  fa-plus";
    },
  },
  methods: {
    show(product) {
      console.log(product);
    },
  },
};
</script>
