<template>
  <div>
    <!-- BootstrapVue Done -->
    <base-header class="pb-6 pb-8 pt-5 pt-md-8 bg-gradient-success">
      <!-- Card stats -->
      <b-row>
        <b-col xl="12" md="12">
          <product-card
            :title="product.title"
            :image="product.image"
            :handle="product.handle"
            class="mb-4"
          >
          </product-card>
        </b-col>
      </b-row>
    </base-header>

    <b-container fluid class="mt--7">
      <b-row class="justify-content-center">
        <b-col lg="12">
          <card header-classes="bg-transparent">
            <h3 slot="header" class="mb-0">Mix and Match products</h3>
            <b-row class="mix-match-wrapper">
              <mix-product
                :title="'Add Top level Mix and Match products'"
                :id="id"
                :product="product"
              />
              <mix-bottom-product
                :title="'Add Bottom level Mix and Match products'"
                :id="id"
                :product="product"
              />
            </b-row>
          </card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import BaseHeader from "@/components/BaseHeader";
import { mapActions } from "vuex";

import MixProduct from "../components/Custom/MixProduct.vue";
import MixBottomProduct from "../components/Custom/MixBottomProduct.vue";
export default {
  name: "product",
  components: {
    BaseHeader,
    "mix-product": MixProduct,
    "mix-bottom-product": MixBottomProduct,
  },
  data() {
    return {
      limit: 5,
      id: this.$route.params.id,
      product: {},
    };
  },
  methods: {
    ...mapActions({
      getMetafields: "getMetafields",
    }),
    async getProduct(id) {
      this.product = this.$store.getters.getProduct(id);
      await this.getMetafields(id);
    },
  },
  mounted() {
    this.getProduct(this.id);
  },
};
</script>
<style></style>
