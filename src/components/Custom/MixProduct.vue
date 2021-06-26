<template>
  <b-col lg="6" md="6">
    <notifications></notifications>
    <b-modal id="modal-1" size="xl" title="Select products for mix and match">
      <tab-products
        :products="showProducts"
        :rows="Math.ceil(showProducts.length / limit)"
        :type="'success'"
        :handleEvent="add"
      />
    </b-modal>
    <button
      type="button"
      class="btn-icon-clipboard"
      title=""
      v-b-modal.modal-1
      variant="primary"
    >
      <div>
        <span>{{ title }}</span>
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
    </div>
  </b-col>
</template>
<script>
import { findIndex } from "lodash";
import axios from "axios";
import TabProduct from "./TabProduct.vue";

export default {
  name: "product",
  props: ["id", "title", "product"],

  components: {
    "tab-products": TabProduct,
  },
  data() {
    return {
      limit: 5,
      products: [],
      addedProducts: [],
      metafields: [],
      metafieldId: null,
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
      this.metafields = this.$store.getters.getMetafields;
      this.products = this.$store.getters.getMixProducts(id);
      this.filterMetafields();
    },
    filterMetafields() {
      const products = this.metafields.filter((m) => m.key === "upper");
      console.log(products);

      if (products.length) {
        this.metafieldId = products[0].id;
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
        .then((response) => {
          console.log(response.data.metafield.id);
          this.metafieldId = response.data.metafield.id;
          this.$notify({
            verticalAlign: "top",
            horizontalAlign: "right",
            type: "success",
            message: `Top mix and match products added!`,
          });
        })
        .catch((e) => console.log(e));
    },
    remove() {
      this.addedProducts = [];
      // this.save();
      axios
        .post(`http://localhost:8000/m/${this.metafieldId}/destroy`)
        .then((response) => {
          console.log(response);
          this.metafieldId = null;
          this.$notify({
            verticalAlign: "top",
            horizontalAlign: "right",
            type: "danger",
            message: `Top mix and match products removed!`,
          });
        })
        .catch((e) => console.log(e));
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
    setTimeout(() => {
      console.log("timeout");
      this.getProduct(this.id);
    }, 3000);
  },
};
</script>
