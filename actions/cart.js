export const ADD_CART = "ADD_CART";

export function addToCart(cart) {
  return {
    type: ADD_CART,
    json: cart,
  };
}
