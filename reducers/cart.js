import { ADD_CART } from "../actions/cart";

export default function todos(state = [], action) {
  switch (action.type) {
    case ADD_CART:
        state = state.concat(action.json)
        return Object.assign([], state)
    default:
      return state;
  }
}
