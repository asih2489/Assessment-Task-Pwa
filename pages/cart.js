import Layout from "../components/Layout";
import { useSelector, useDispatch } from "react-redux";
import { compose } from "redux";
import { withRedux } from "../lib/redux";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import { updateQty } from "../actions/cart";

const useCart = () => {
  const dispatch = useDispatch();
  const updateCartQty = (params) => dispatch(updateQty(params));
  const cart = useSelector((state) => state.cart);
  return { cart, updateCartQty };
};

const CartPage = () => {
  const { cart, updateCartQty } = useCart();
  let total = 0;
  return (
    <Layout>
      <h1>Your Cart</h1>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox inputProps={{ "aria-label": "select all desserts" }} />
            </TableCell>
            <TableCell padding="checkbox" align="center">
              Product
            </TableCell>
            <TableCell padding="checkbox">Price</TableCell>
            <TableCell padding="checkbox" align="center" size="small">
              Qty
            </TableCell>
            <TableCell padding="checkbox">Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cart.length === 0 ? (
            <TableRow>
              <TableCell padding="checkbox" colSpan={5}>
                <div style={{ padding: "10px", textAlign: "center" }}>
                  Your shoppng cart is empty
                </div>
              </TableCell>
            </TableRow>
          ) : null}
          {cart.map((product, idx) => {
            total =
              total +
              product.product.price_range.maximum_price.final_price.value *
                product.qty;
            return (
              <TableRow key={idx}>
                <TableCell padding="checkbox">
                  <Checkbox
                    inputProps={{ "aria-label": "select all desserts" }}
                  />
                </TableCell>
                <TableCell padding="checkbox" align="center">
                  <div className="img-thumbnail">
                    <img src={product.product.image.url} />
                  </div>
                  {product.product.name}
                </TableCell>
                <TableCell padding="checkbox">
                  ${product.product.price_range.maximum_price.final_price.value}
                </TableCell>
                <TableCell padding="checkbox" align="center">
                  <div className="qty">
                    <Button
                      color="secondary"
                      variant="contained"
                      onClick={() =>
                        updateCartQty({ type: "min", id: product.product.id })
                      }
                      disabled={product.qty === 1}
                    >
                      -
                    </Button>
                    <div className="qty-detail">{product.qty}</div>
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={() =>
                        updateCartQty({ type: "plus", id: product.product.id })
                      }
                    >
                      +
                    </Button>
                  </div>
                </TableCell>
                <TableCell padding="checkbox">
                  $
                  {product.product.price_range.maximum_price.final_price.value *
                    product.qty}
                </TableCell>
              </TableRow>
            );
          })}
          <TableRow>
            <TableCell padding="checkbox" colSpan={4}>
              <div style={{ padding: "10px" }}>Total</div>
            </TableCell>
            <TableCell padding="checkbox">${total}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <div className="checkout">
        <Button
          variant="contained"
          color="primary"
          disabled={cart.length === 0}
        >
          Checkout
        </Button>
      </div>
      <style jsx>
        {`
          .checkout {
            padding: 10px;
            display: flex;
            justify-content: center;
          }
          .img-thumbnail {
            margin: 0 auto;
            width 100px;
            height: 100px;
            overflow: hidden;
            display: flex;
            justify-content: center;
          }
          .img-thumbnail img {
            height: 100%;
            width: auto;
          }
          .qty {
            display: flex;
            margin: 0 auto;
            justify-content: center;
            align-items: center;
          }
          .qty-detail {
            padding: 0 20px;
          }
        `}
      </style>
    </Layout>
  );
};

export default compose(withRedux)(CartPage);
