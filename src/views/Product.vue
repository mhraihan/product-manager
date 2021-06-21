<template>
  <div>
    <!-- BootstrapVue Done -->
    <base-header class="pb-6 pb-8 pt-5 pt-md-8 bg-gradient-success">
      <!-- Card stats -->
      <b-row>
        <b-col xl="12" md="12">
          <product-card
            title="Total traffic"
            sub-title="350,897"
            icon="ni ni-active-40"
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
            <h3 slot="header" class="mb-0">Icons</h3>
            <b-row class="icon-examples">
              <b-col lg="3" md="6">
                <button
                  type="button"
                  class="btn-icon-clipboard"
                  title=""
                  data-original-title="Copy to clipboard"
                >
                  <div>
                    <i class="ni ni-active-40"></i>
                    <span>active-40</span>
                  </div>
                </button>
              </b-col>
              <b-col lg="3" md="6">
                <button
                  type="button"
                  class="btn-icon-clipboard"
                  title=""
                  data-original-title="Copy to clipboard"
                >
                  <div>
                    <i class="ni ni-air-baloon"></i>
                    <span>air-baloon</span>
                  </div>
                </button>
              </b-col>
            </b-row>
          </card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import BaseHeader from "@/components/BaseHeader";
import store from "store";
import axios from "axios";
import { findIndex } from "lodash";
export default {
  name: "product",
  components: {
    BaseHeader,
  },
  data() {
    return {
      id: this.$route.params.id,
      product: this.$route.props,
    };
  },
  methods: {
    getProduct(id) {
      const products = JSON.parse(store.get("ajax-products"));
      console.log(products);
    },
  },
  mounted() {
    console.log(this.$route.params.product);
    // this.getProduct(this.id);
  },
};
</script>
<style></style>
