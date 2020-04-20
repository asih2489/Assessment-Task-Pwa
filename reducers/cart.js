import { ADD_CART, UPDATE_QTY } from "../actions/cart";

export default function todos(state = [], action) {
  switch (action.type) {
    case ADD_CART:
      state = state.concat(action.json);
      return Object.assign([], state);
    case UPDATE_QTY:
      state.map((val) => {
        if (parseInt(action.json.id) === parseInt(val.product.id)) {
          val.qty = action.json.type === "min" ? val.qty - 1 : val.qty + 1;
        }
      });
      return Object.assign([], state);
    default:
      return state;
  }
}
