export const getMetafields = state => state.metafields;

export const getProducts = state => state.products;
export const getProduct = state => id => {
  return state.products.find(p => p.id == id);
};

export const getMixProducts = state => id => {
  return state.products.filter(p => p.id != id);
};

export const engrave = state =>
  state.products.filter(o => o.tags.indexOf("engrave") != -1);
export const noEngrave = state =>
  state.products.filter(o => o.tags.indexOf("engrave") == -1);
