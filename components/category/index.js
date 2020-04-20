import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Fragment } from "react";
import Link from "next/link";
import { Box, Grid } from "@material-ui/core";

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

export const ALL_PRODUCT_QUERY = gql`
  query getProduct($category_id: String!) {
    products(search: "", filter: { category_id: { eq: $category_id } }) {
      total_count
      items {
        id
        name
        color
        url_key
        image {
          url
          label
        }
      }
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

const getProduct = (category_id) => {
  return useQuery(ALL_PRODUCT_QUERY, {
    variables: {
      category_id,
    },
    ssr: true,
  });
};

const ProductCom = (props) => {
  const product = getProduct(props.category_id);
  const data = !product.loading ? product.data.products : {};
  if (product.loading) {
    return <div>loading</div>;
  }
  return (
    <Fragment>
      <div className="title">Product</div>
      <Grid container spacing={1}>
        {data.items.map((prod, idx) => {
          return (
            <Grid item xs={3} key={idx}>
              <div className="product-detail">
                <div className="product-detail--title">
                  <Link
                    href="/[...slug]"
                    as={`/${prod.url_key}.html`}
                  >
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
