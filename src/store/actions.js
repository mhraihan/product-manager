import axios from "axios";
export const fetchProducts = ({ commit }) => {
  axios
    .get(`http://localhost:8000/products`)
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
