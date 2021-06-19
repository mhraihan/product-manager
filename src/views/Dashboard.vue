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
                      <div class="pt-5">
                        <b-row
                          v-for="product in engrave"
                          :key="product.id"
                          align-v="center"
                          class="pb-3 mb-3 border-bottom"
                        >
                          <b-col md="auto">
                            <!-- Avatar -->
                            <a href="javascript:;" class="avatar avatar-xl">
                              <img
                                alt="Image placeholder"
                                :src="product.image.src"
                              />
                            </a>
                          </b-col>
                          <b-col class="ml--2">
                            <h4 class="mb-0">
                              <a
                                :href="'/products/' + product.handle"
                                target="blank"
                                >{{ product.title }}</a
                              >
                            </h4>
                            <p class="text-sm text-muted mb-0"></p>
                            <span class="text-success">● </span>
                            <small>Active</small>
                          </b-col>
                          <b-col md="auto">
                            <base-button
                              @click="removeTag(product)"
                              type="danger"
                              size="xl"
                            >
                              <i class="far fa-trash-alt fa-2x"></i>
                            </base-button>
                          </b-col>
                        </b-row>
                        <b-row v-if="engrave.length == 0">
                          <b-col md="auto">
                            <p>Sorry, no Personalize Label product is available. Add some product</p>
                          </b-col>
                        </b-row>
                        <!-- engrave pagination -->
                        <b-row v-if="engrave.length > 0">
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
                    </b-tab>

                    <b-tab>
                      <template v-slot:title>
                        <i class="fas fa-user-tag"></i> Add Personalize Label
                      </template>
                      <div class="pt-5">
                        <b-row
                          v-for="product in noEngravePage"
                          :key="product.id"
                          align-v="center"
                          class="pb-3 mb-3 border-bottom"
                        >
                          <b-col md="auto">
                            <!-- Avatar -->
                            <a href="javascript:;" class="avatar avatar-xl">
                              <img
                                alt="Image placeholder"
                                :src="product.image.src"
                              />
                            </a>
                          </b-col>
                          <b-col class="ml--2">
                            <h4 class="mb-0">
                              <a
                                :href="'/products/' + product.handle"
                                target="blank"
                                >{{ product.title }}</a
                              >
                            </h4>
                            <p class="text-sm text-muted mb-0"></p>
                            <span class="text-success">● </span>
                            <small>Active</small>
                          </b-col>
                          <b-col md="auto">
                            <base-button
                              @click="addTag(product)"
                              type="info"
                              size="xl"
                            >
                              <i class="fas fa-plus fa-2x"></i>
                            </base-button>
                          </b-col>
                        </b-row>
                        <b-row v-if="noEngrave.length == 0">
                          <b-col md="auto">
                            <p>Sorry, all products are enable Personalize Label.</p>
                          </b-col>
                        </b-row>
                        <!-- noEngrave pagination -->
                        <b-row v-if="engrave.length > 0">
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
                    </b-tab>
                  </b-tabs>
                </div>
              </b-col>
            </b-row>
          </card>
        </b-col>
        <b-col xl="6" class="mb-5 mb-xl-0">
          <social-traffic-table></social-traffic-table>
        </b-col>
      </b-row>
    </base-header>
  </div>
</template>
<script>
// Tables
import SocialTrafficTable from "./Dashboard/SocialTrafficTable";
import PageVisitsTable from "./Dashboard/PageVisitsTable";
import axios from "axios";
import _ from "lodash";
import pagination from 'element-ui';
export default {
  components: {
    PageVisitsTable,
    SocialTrafficTable
  },
  data() {
    return {
      products: [],
      baseProducts: [],
      engrave: [],
      noEngrave: [],
      noEngravePaginate:[],
      limit: 10,
      rows: 4,
      perPage: 1,
      currentPage: 1
    };
  },
  watch: {
    currentPage(current,prev){
      console.log(prev,current);
      this.paginate();
    }
  },
  computed: {
    noEngravePage() {
      return  _(this.noEngrave).slice((this.currentPage-1)*this.limit).take(this.limit).value();
    }
  },
  methods: {
    paginate(){
      console.log(this.currentPage);
     this.noEngravePaginate =  _(this.noEngrave).slice((this.currentPage-1)*this.limit).take(this.limit).value();
    },
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
      this.rows = Math.ceil(this.noEngrave.length/10)
      this.paginate();
      console.log(noEngrave);
    },
    addTag(product) {
      console.log(product);

      let products = this.noEngrave;
      const idx = _.findIndex(products, ["id", product.id]);
      if(idx != -1){
        this.engrave.push(product);
        console.log(products.splice(idx, 1));
        this.rows = Math.ceil(this.noEngrave.length/10);
        this.updateTag(product,'add');
      }
    },
    removeTag(product) {
      console.log(product);


      let products = this.engrave;
      const idx = _.findIndex(products, ["id", product.id]);
      if(idx != -1){
        this.noEngrave.push(product);
        console.log(products.splice(idx, 1));
        this.rows = Math.ceil(this.noEngrave.length/10);
        this.updateTag(product,'remove');
      }
    },

    updateTag(product,type) {
      console.log(type);
      if(type == 'add'){
        this.$notify({verticalAlign: 'top', horizontalAlign: 'right', type: 'success', message: `Personalize label enbaled for ${product.title}!`});
      } else{
        this.$notify({verticalAlign: 'top', horizontalAlign: 'right', type: 'danger', message: `Personalize label removed from ${product.title}`});
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
