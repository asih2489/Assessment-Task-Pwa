import Layout from "../../components/Layout";
import { compose } from "redux";
import { withApollo } from "../../lib/apollo";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import { Query } from "@apollo/react-components";
import gql from "graphql-tag";

const GET_CART = gql`
  query getCart {
    cartItems @client
  }
`;

const CartPageAppolo = () => {
  let cart = [];
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
            <TableCell padding="checkbox">Product</TableCell>
            <TableCell padding="checkbox">Price</TableCell>
            <TableCell padding="checkbox">Qty</TableCell>
            <TableCell padding="checkbox">Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <Query query={GET_CART}>
            {({ data, client }) => {
              console.log(data);
              return <div></div>;
            }}
          </Query>
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
                <TableCell padding="checkbox">{product.product.name}</TableCell>
                <TableCell padding="checkbox">
                  ${product.product.price_range.maximum_price.final_price.value}
                </TableCell>
                <TableCell padding="checkbox">{product.qty}</TableCell>
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
        `}
      </style>
    </Layout>
  );
};

export default compose(withApollo)(CartPageAppolo);
