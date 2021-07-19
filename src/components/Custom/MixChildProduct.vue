<template>
  <div class="pt-5 hello">
    <draggable v-model="getProducts" ghost-class="ghost" @end="onEnd">
      <transition-group type="transition" name="flip-list">
        <b-row
          v-for="product in showProducts"
          :key="product.id"
          align-v="center"
          class="pb-3 mb-3 border-bottom sortable"
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
      </transition-group>
    </draggable>
    <div class="my-3" v-if="addedProducts.length">
      <base-button @click.prevent="save" block outline size="xl" type="success"
        >Save Mix and Match products</base-button
      >
    </div>
    <div class="my-3" v-if="metafieldId">
      <base-button
        @click.prevent="remove"
        block
        outline
        size="xl"
        type="warning"
        >Remove all Mix and Match products</base-button
      >
    </div>

    <b-row v-if="getProducts.length == 0">
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
import draggable from "vuedraggable";

export default {
  props: ["products", "rows", "handleEvent", "type"],
  name: "mix-child-products",
  components: {
    draggable,
  },
  data() {
    return {
      getProducts: this.products,
      limit: 5,
      perPage: 1,
      currentPage: 1,
    };
  },
  computed: {
    showProducts() {
      return _(this.getProducts)
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
  methods: {
    onEnd(evt) {
      console.log(evt);
    },
  },
};
</script>
<style scoped>
.sortable {
  cursor: move;
}
.sortable span {
  float: right;
}
.hello .sortable-drag {
  opacity: 0;
}
.flip-list-move {
  transition: transform 0.5s;
}
</style>
