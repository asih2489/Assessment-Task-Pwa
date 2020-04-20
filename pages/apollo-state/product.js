import { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { compose } from "redux";
import { withApollo } from "../../lib/apollo";
import { Fragment } from "react";
import { Container, Box, Grid } from "@material-ui/core";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import { useDispatch } from "react-redux";
import { addToCart } from "../../actions/cart";
import { ApolloConsumer, Query } from "@apollo/react-components";
import Link from "next/link";
import Layout from "../../components/Layout";
import { useMutation } from "@apollo/react-hooks";

export const TOGGLE_CART = gql`
  mutation addOrRemoveFromCart($launchId: ID!) {
    addOrRemoveFromCart(id: $launchId) @client
  }
`;

export const ALL_PRODUCT_QUERY = gql`
  query getProducts($url_key: String!) {
    products(search: "", filter: { url_key: { eq: $url_key } }) {
      total_count
      items {
        id
        name
        description {
          html
        }
        categories {
          name
        }
        price_range {
          maximum_price {
            discount {
              amount_off
              percent_off
            }
            final_price {
              currency
              value
            }
          }
          minimum_price {
            discount {
              amount_off
              percent_off
            }
            final_price {
              currency
              value
            }
          }
        }
        url_key
        image {
          url
          label
        }
      }
    }
  }
`;

const getProduct = (url_key) => {
  return useQuery(ALL_PRODUCT_QUERY, {
    variables: {
      url_key,
    },
    ssr: true,
  });
};

const Product404 = () => {
  return <div>Product not found</div>;
};

const ProductItem = ({ data }) => {
  const [qty, setQty] = useState(1);
  let cart = [];
  const addCart = (client, data) => {
    cart = cart.concat(data);
    client.writeData({
      data: { cartItems: cart },
    });
  };

  const [mutate, { loading, error }] = useMutation(TOGGLE_CART, {
    variables: { launchId: 1 },
  });
  console.log(loading);
  return (
    <ApolloConsumer>
      {(client) => {
        return (
          <Fragment>
            <Grid container spacing={1}>
              <Grid item lg={8} xs={12}>
                <div className="product-detail__left">
                  <h2>{data.name}</h2>
                  <div className="product-detail__left--img">
                    <img src={data.image.url} alt={data.image.label} />
                  </div>
                </div>
              </Grid>
              <Grid item lg={4} xs={12}>
                <div className="product-detail__right">
                  <div className="price">
                    Category : {data.categories[0].name} -{" "}
                    {data.categories[1].name}
                  </div>
                  <div className="price">
                    Price : ${data.price_range.maximum_price.final_price.value}
                  </div>
                  <div className="add-cart">
                    <span className="qty-label">Qty</span>
                    <Input
                      name="qty"
                      defaultValue={qty}
                      onChange={(e) => setQty(e.target.value)}
                    />
                    <div className="add-cart__button">
                      <Button
                        variant="contained"
                        fullWidth
                        color="primary"
                        onClick={() => mutate()}
                      >
                        Add to Cart
                      </Button>
                      <Link href="/apollo-state/cart">
                        <a>Go to cart page</a>
                      </Link>
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item lg={12} xs={12}>
                <div className="description">
                  <h3>Description</h3>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: data.description.html,
                    }}
                  />
                </div>
              </Grid>
            </Grid>
            <style jsx>
              {`
                .product-detail__left {
                  border-right: 1px solid #b3abab;
                }
                .product-detail__left--img {
                  width: 100%;
                  overflow: hidden;
                }
                .product-detail__left--img img {
                  width: 300px;
                  height: auto;
                }
                .product-detail__right {
                  padding: 1.52em;
                }
                .price {
                  margin-bottom: 5px;
                }
                .qty-label {
                  margin-right: 20px;
                }
                .add-cart__button {
                  margin-top: 10px;
                }
              `}
            </style>
          </Fragment>
        );
      }}
    </ApolloConsumer>
  );
};

const DetailProduct = (props) => {
  const { url_key } = props;
  const product = getProduct(url_key);
  const data = !product.loading ? product.data.products : {};
  if (product.loading) {
    return <div>loading</div>;
  }
  return (
    <Layout>
      <Container>
        {data.total_count === 0 ? (
          <Product404 />
        ) : (
          <ProductItem data={data.items[0]} />
        )}
      </Container>
    </Layout>
  );
};

DetailProduct.getInitialProps = async ({ url_key }) => {
  return {
    url_key: "chaz-kangeroo-hoodie",
  };
};

export default compose(withApollo)(DetailProduct);
