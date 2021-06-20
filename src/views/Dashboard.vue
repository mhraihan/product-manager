<template>
  <div>
    <notifications></notifications>
    <base-header class="pb-6 pb-8 pt-5 pt-md-8 bg-gray">
      <!--Tables-->
      <b-row class="mt-5">
        <b-col xl="6" class="mb-5 mb-xl-0">
          <card>
            <!-- card header-->
            <template v-slot:header>
              <b-row align-v="center">
                <b-col>
                  <h3 class="mb-0">Personalize Label</h3>
                </b-col>
              </b-row>
            </template>
            <!-- Card body -->
            <b-row align-v="center" class="mb-5">
              <b-col>
                <div>
                  <b-tabs pills>
                    <b-tab active>
                      <template v-slot:title class="py-3">
                        <i class="fas fa-tag"></i> Remove Personalize Label
                      </template>
                      <Engrave :engrave="engrave" :rows="Math.ceil(engrave.length / limit)" :handleEvent="removeTag" :type="'danger'"/>
                    </b-tab>

                    <b-tab>
                      <template v-slot:title>
                        <i class="fas fa-user-tag"></i> Add Personalize Label
                      </template>
                      <Engrave :handleEvent="addTag" :engrave="noEngrave" :rows="Math.ceil(noEngrave.length / limit)" :type="'success'"/>
                    </b-tab>
                  </b-tabs>
                </div>
              </b-col>
            </b-row>
          </card>
        </b-col>
        <b-col xl="6" class="mb-5 mb-xl-0">

        </b-col>
      </b-row>
    </base-header>
  </div>
</template>
<script>

import axios from "axios";
import _ from "lodash";
import Engrave from "../components/Custom/Engrave.vue";

export default {
  components: {
    Engrave
  },
  data() {
    return {
      products: [],
      baseProducts: [],
      engrave: [],
      noEngrave: [],
      limit: 10,
    };
  },
  watch: {
  },
  computed: {
  },
  methods: {

    getProducts() {
      axios
        .get(`http://localhost:8000/products`)
        .then(res => {
          let { products } = res.data;
          this.getProductByTag(products);
        })
        .catch(e => {
          console.log(e);
        });
    },
    getProductByTag(products = []) {
      let noEngrave = [];
      this.engrave = products
        .filter(o => {
          if (o.tags.indexOf("engrave") == -1) noEngrave.push(o);
          return o.tags.indexOf("engrave") != -1;
        })
        .map(p => {
          let tags = p.tags.split(",").map(t => t.trim());

          let idx = tags.indexOf("engrave");
          if (idx != -1) {
            tags.splice(idx, 1);
            p.tags = tags.join(",");
          }
          return p;
        });
      noEngrave = noEngrave.map(p => {
        if (typeof p.tags == "string") p.tags = p.tags + ", engrave";
        if (typeof p.tags == "object") p.tags.push("engrave");
        return p;
      });
      this.products = products;
      this.baseProducts = products;
      this.noEngrave = noEngrave;
      console.log(noEngrave);
    },
    addTag(product) {
      console.log(product);

      let products = this.noEngrave;
      const idx = _.findIndex(products, ["id", product.id]);
      if (idx != -1) {
        this.engrave.push(product);
        console.log(products.splice(idx, 1));
        this.rows = Math.ceil(this.noEngrave.length / 10);
        this.updateTag(product, "add");
      }
    },
    removeTag(product) {
      console.log(product);

      let products = this.engrave;
      const idx = _.findIndex(products, ["id", product.id]);
      if (idx != -1) {
        this.noEngrave.push(product);
        console.log(products.splice(idx, 1));
        this.rows = Math.ceil(this.noEngrave.length / 10);
        this.updateTag(product, "remove");
      }
    },

    updateTag(product, type) {
      console.log(type);
      if (type == "add") {
        this.$notify({
          verticalAlign: "top",
          horizontalAlign: "right",
          type: "success",
          message: `Personalize label enbaled for ${product.title}!`
        });
      } else {
        this.$notify({
          verticalAlign: "top",
          horizontalAlign: "right",
          type: "danger",
          message: `Personalize label removed from ${product.title}`
        });
      }
      axios
        .post(`http://localhost:8000/products/${product.id}/update`, {
          tags: product.tags
        })
        .then(function(response) {
          console.log(response);
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  },
  mounted() {
    this.getProducts();
  }
};
</script>
<style>
.el-table .cell {
  padding-left: 0px;
  padding-right: 0px;
}
</style>
