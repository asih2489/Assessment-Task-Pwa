export const ADD_CART = "ADD_CART";
export const UPDATE_QTY = "UPDATE_QTY";

export function addToCart(cart) {
  return {
    type: ADD_CART,
    json: cart,
  };
}

export function updateQty(params) {
  return {
    type: UPDATE_QTY,
    json: params,
  };
}
