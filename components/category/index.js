import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Fragment, useState } from "react";
import Link from "next/link";
import { Box, Grid } from "@material-ui/core";
import Select from "@material-ui/core/Select";

export const ALL_CATEGORY_QUERY = gql`
  query getCategory($url_key: String!) {
    categoryList(filters: { url_key: { eq: $url_key } }) {
      id
      name
      path
      url_key
      url_path
      position
      url_suffix
      description
      meta_description
    }
  }
`;

const getCategory = (url_key) => {
  return useQuery(ALL_CATEGORY_QUERY, {
    variables: {
      url_key,
    },
    ssr: true,
  });
};

const getProduct = (ALL_PRODUCT_QUERY, category_id, sort) => {
  return useQuery(ALL_PRODUCT_QUERY, {
    variables: {
      category_id,
      sort: sort,
    },
    ssr: true,
  });
};

const ProductCom = (props) => {
  const [sortName, setSortName] = useState("name-ASC");
  let sort = sortName.split("-");
  let sortValue = sort[1];
  let type = sort[0];

  let ALL_PRODUCT_QUERY = gql`
    query getProduct($category_id: String!, $sort: SortEnum!) {
      products(
        search: ""
        filter: { category_id: { eq: $category_id } }
        sort: { ${type}: $sort }
      ) {
        total_count
        items {
          id
          name
          color
          url_key
          price_range {
            maximum_price{
              discount {
                amount_off,
                percent_off
              }
              final_price {
                currency
                value
              }
            }
          }
          image {
            url
            label
          }
        }
      }
    }
  `;
  const product = getProduct(ALL_PRODUCT_QUERY, props.category_id, sortValue);
  const data = !product.loading ? product.data.products : {};
  if (product.loading) {
    return <div>loading</div>;
  }

  const handleChange = (event) => {
    setSortName(event.target.value);
  };
  return (
    <Fragment>
      <h3>Product</h3>
      <Select
        native
        value={sortName}
        onChange={handleChange}
        inputProps={{
          name: "sort",
          id: "sort",
        }}
      >
        <option value="name-ASC">Sort by name ASC</option>
        <option value="name-DESC">Sort by name DESC</option>
        <option value="price-ASC">Price by name ASC</option>
        <option value="price-DESC">Price by name DESC</option>
      </Select>
      <br />
      <br />
      <br />
      <Grid container spacing={1}>
        {data.items.map((prod, idx) => {
          return (
            <Grid item xs={3} key={idx}>
              <div className="product-detail">
                <div className="product-detail--title">
                  <Link href="/[...slug]" as={`/${prod.url_key}.html`}>
                    <a>{prod.name}</a>
                  </Link>
                </div>
                <div className="product-detail--image">
                  <img
                    className="img-product"
                    src={prod.image.url}
                    alt={prod.image.label}
                  />
                </div>
                <div className="product-price">
                  ${prod.price_range.maximum_price.final_price.value}
                </div>
              </div>
            </Grid>
          );
        })}
      </Grid>
      <style jsx>
        {`
          .title {
            padding: 20px;
          }
          .img-product {
            width: 20px;
          }
          .product-detail {
            width: 100%;
            height: 200px;
            border: 1px solid #3333;
            position: relative;
          }
          .product-price {
            position: absolute;
            bottom: 10px;
            right: 10px;
          }
          .product-detail--title {
            text-align: center;
            padding: 20px;
          }
          .product-detail--title a {
            text-align: center;
            text-decoration: none;
            display: inline-block;
            color: green;
          }
          .product-detail--image {
            height: 130px;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            position: relative;
          }
          .product-detail--image img {
            height: 100%;
            width: auto;
          }
        `}
      </style>
    </Fragment>
  );
};

const CategoryPage = (props) => {
  const { slug } = props;
  const category = getCategory(slug[1]);
  const data = !category.loading ? category.data.categoryList[0] : {};
  return (
    <Fragment>
      {data && data.id ? (
        <Fragment>
          <Box>
            <div>ID :{data.id}</div>
            <div>Name :{data.name}</div>
            <div>
              Description :{" "}
              <span dangerouslySetInnerHTML={{ __html: data.description }} />
            </div>
          </Box>
          <ProductCom category_id={data.id} />
        </Fragment>
      ) : (
        <div>loading</div>
      )}
    </Fragment>
  );
};

CategoryPage.getInitialProps = async (props) => {
  return {
    slug: props.slug,
  };
};

export default CategoryPage;
