import axios from "axios";
export const fetchProducts = ({ commit }) => {
  axios
    .get(`http://themebuz.com/product-api/public/products`)
    .then(res => {
      let { products } = res.data;
      console.log("from ajax data");
      commit("setProducts", products);
      return products;
    })
    .catch(e => {
      console.log(e);
    });
};
export const getMetafields = ({ commit }, id) => {
  axios
    .get(`http://themebuz.com/product-api/public/m/${id}`)
    .then(res => {
      commit("SET_METAFIELDS", res.data.metafields);
      console.log("from ajax data");
      console.log(res.data.metafields);
    })
    .catch(e => {
      console.log(e);
    });
};
