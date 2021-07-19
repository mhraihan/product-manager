<template>
  <b-col lg="6" md="6">
    <notifications></notifications>
    <b-modal id="modal-2" size="xl" title="Select products for mix and match">
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
      v-b-modal.modal-2
      variant="primary"
    >
      <div>
        <span>{{ title }}</span>
      </div>
    </button>
    <div class="my-3">
      <div class="pt-5 hello">
        <draggable v-model="addedProducts" ghost-class="ghost" @end="onEnd">
          <transition-group type="transition" name="flip-list">
            <b-row
              v-for="product in showAddedProducts"
              :key="product.id"
              align-v="center"
              class="p-3 m-3 border-bottom sortable"
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
                    :href="
                      'https://blaizecaprice.com/products/' + product.handle
                    "
                    target="blank"
                    >{{ product.title }}</a
                  >
                </h4>
              </b-col>
              <b-col md="auto">
                <base-button
                  @click="removeItem(product)"
                  type="danger"
                  size="xl"
                >
                  <i :class="icon"></i>
                </base-button>
              </b-col>
            </b-row>
          </transition-group>
        </draggable>
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

        <b-row v-if="products.length == 0">
          <b-col md="auto">
            <p>Sorry, product is available.</p>
          </b-col>
        </b-row>
        <!-- products pagination -->
        <!-- <b-row v-if="mixrows > 1">
          <b-col md="auto">
            <b-pagination
              v-model="currentPage"
              :total-rows="mixrows"
              :per-page="perPage"
              first-number
            ></b-pagination>
          </b-col>
        </b-row> -->
      </div>
    </div>
  </b-col>
</template>
<script>
import _ from "lodash";
import draggable from "vuedraggable";
import axios from "axios";
import TabProduct from "./TabProduct.vue";
import MixChildProduct from "./MixChildProduct.vue";

export default {
  name: "product",
  props: ["id", "title", "product"],

  components: {
    "tab-products": TabProduct,
    "mix-child-products": MixChildProduct,
    draggable,
  },
  data() {
    return {
      limit: 5,
      limit2: 15,
      products: [],
      addedProducts: [],
      metafields: [],
      metafieldId: null,
      type: "danger",
      perPage: 1,
      currentPage: 1,
      mixrows: 1,
      rows: 1,
    };
  },
  computed: {
    showProducts() {
      return this.products.filter(
        ({ id: id1 }) => !this.addedProducts.some(({ id: id2 }) => id2 === id1)
      );
    },
    showAddedProducts() {
      return _(this.addedProducts)
        .slice((this.currentPage - 1) * this.limit2)
        .take(this.limit2)
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
    addedrows() {
      this.mixrows = Math.ceil(this.addedProducts.length / this.limit);
      console.log(this.mixrows);
    },
    getProduct(id) {
      this.metafields = this.$store.getters.getMetafields;
      this.products = this.$store.getters.getMixProducts(id);
      this.filterMetafields();
    },
    filterMetafields() {
      const products = this.metafields.filter((m) => m.key === "bottom");
      console.log(products);

      if (products.length) {
        this.metafieldId = products[0].id;
        this.addedProducts = [...JSON.parse(products[0].value)];
      }
    },
    save() {
      console.log("save to the database");
      axios
        .post(`http://themebuz.com/product-api/public/m/${this.id}/create`, {
          key: "bottom",
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
            message: `Bottom mix and match products added!`,
          });
        })
        .catch((e) => console.log(e));
    },
    remove() {
      this.addedProducts = [];
      // this.save();
      axios
        .post(
          `http://themebuz.com/product-api/public/m/${this.metafieldId}/destroy`
        )
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
      const idx = _.findIndex(ref, ["id", product.id]);
      if (idx != -1) {
        console.log(ref.splice(idx, 1));
        this.rows = Math.ceil(this.products.length / this.limit);
        this.addedrows();
        this.addedProducts.push(product);
        console.log(product);
      }
    },
    removeItem(product) {
      let ref = this.addedProducts;
      const idx = _.findIndex(ref, ["id", product.id]);
      if (idx != -1) {
        const removed = ref.splice(idx, 1);
        this.rows = Math.ceil(this.products.length / this.limit);
        this.addedrows();
      }
    },
  },
  mounted() {
    setTimeout(() => {
      console.log("timeout");
      this.getProduct(this.id);
      this.addedrows();
    }, 3000);
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
.sortable:nth-child(2) {
  box-shadow: 0 3px 10px rgba(68, 68, 68, 0.6);
}
.ghost {
  border-left: 6px solid rgb(0, 183, 255);
  box-shadow: 10px 10px 5px -1px rgba(0, 0, 0, 0.14);
  opacity: 0.7;
}
.ghost:before {
  content: " ";
  width: 20px;
  position: absolute;
  height: 20px;
  margin-left: -50px;
  background-image: url("../../assets/drag-flick.svg");
}
</style>
