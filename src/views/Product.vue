<template>
  <div>
    <div>
      <b-modal id="modal-1" size="xl" title="Select products for mix and match">
        <tab-products
          :products="showProducts"
          :rows="Math.ceil(showProducts.length / limit)"
          :type="'success'"
          :handleEvent="add"
        />
      </b-modal>
    </div>

    <!-- BootstrapVue Done -->
    <base-header class="pb-6 pb-8 pt-5 pt-md-8 bg-gradient-success">
      <!-- Card stats -->
      <b-row>
        <b-col xl="12" md="12">
          <product-card
            :title="product.title"
            :image="product.image"
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
            <b-row class="icon-examples">
              <b-col lg="6" md="6">
                <button
                  type="button"
                  class="btn-icon-clipboard"
                  title=""
                  v-b-modal.modal-1
                  variant="primary"
                >
                  <div>
                    <span>Add Top level Mix and Match products</span>
                  </div>
                </button>
                <div class="my-3">
                  <tab-products
                    :products="addedProducts"
                    :rows="Math.ceil(addedProducts.length / limit)"
                    :type="'danger'"
                    :handleEvent="removeItem"
                  />
                  <div class="my-3" v-if="addedProducts.length">
                    <base-button
                      @click.prevent="save"
                      block
                      outline
                      size="xl"
                      type="success"
                      >Save Mix and Match products</base-button
                    >
                  </div>
                  <div class="my-3" v-if="metafields.length">
                    <base-button
                      @click.prevent="remove"
                      block
                      outline
                      size="xl"
                      type="warning"
                      >Remove all Mix and Match products</base-button
                    >
                  </div>
                </div>
              </b-col>
              <b-col lg="6" md="6">
                <button
                  type="button"
                  class="btn-icon-clipboard"
                  title=""
                  v-b-modal.modal-1
                  variant="primary"
                >
                  <div>
                    <span>Add Bottom level Mix and Match products</span>
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
import { findIndex } from "lodash";
import axios from "axios";
import TabProduct from "../components/Custom/TabProduct.vue";

export default {
  name: "product",
  components: {
    BaseHeader,
    "tab-products": TabProduct,
  },
  data() {
    return {
      limit: 5,
      id: this.$route.params.id,
      product: {},
      products: [],
      addedProducts: [],
      metafields: [],
    };
  },
  computed: {
    showProducts() {
      return this.products.filter(
        ({ id: id1 }) => !this.addedProducts.some(({ id: id2 }) => id2 === id1)
      );
    },
  },
  methods: {
    getProduct(id) {
      this.product = this.$store.getters.getProduct(id);
      this.products = this.$store.getters.getMixProducts(id);
      axios
        .get(`http://localhost:8000/m/${id}`)
        .then((res) => {
          this.metafields = res.data.metafields;
          console.log("from ajax data");
          console.log(this.metafields);
          this.filterMetafields();
        })
        .catch((e) => {
          console.log(e);
        });
    },
    filterMetafields() {
      const products = this.metafields.filter((m) => m.key === "upper");
      if (products.length) {
        this.addedProducts = [...JSON.parse(products[0].value)];
      }
    },
    save() {
      console.log("save to the database");
      axios
        .post(`http://localhost:8000/m/${this.id}/create`, {
          key: "upper",
          type: "json_string",
          value: JSON.stringify(this.addedProducts),
        })
        .then(function (response) {
          console.log(response);
        });
    },
    remove() {
      this.addedProducts = [];
      this.save();
    },
    add(product) {
      let ref = this.products;
      const idx = findIndex(ref, ["id", product.id]);
      if (idx != -1) {
        console.log(ref.splice(idx, 1));
        this.rows = Math.ceil(this.products.length / this.limit);
        this.addedProducts.push(product);
        console.log(product);
      }
    },
    removeItem(product) {
      let ref = this.addedProducts;
      const idx = findIndex(ref, ["id", product.id]);
      if (idx != -1) {
        const removed = ref.splice(idx, 1);
        this.rows = Math.ceil(this.products.length / this.limit);
      }
    },
  },
  mounted() {
    this.getProduct(this.id);
  },
};
</script>
<style></style>
