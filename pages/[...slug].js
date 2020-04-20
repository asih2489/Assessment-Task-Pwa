import gql from "graphql-tag";
import { compose } from "redux";
import { withApollo } from "../lib/apollo";
import { useQuery } from "@apollo/react-hooks";
import Layout from "../components/Layout";
import Category from "../components/category/index";
import Product from "../components/product/index";

export const ALL_RESOLVER_QUERY = gql`
  query getResolver($url: String!) {
    urlResolver(url: $url) {
      id
      redirectCode
      relative_url
      type
    }
  }
`;

const getComponent = (resolver, slug) => {
  if (!resolver) {
    return <div>Page not found</div>;
  } else if (resolver.type === "CATEGORY") {
    return <Category slug={slug} />;
  } else if (resolver.type === "PRODUCT") {
    return <Product url_key={slug[0]} />;
  }
  return <span />;
};

const getResolver = (url) => {
  return useQuery(ALL_RESOLVER_QUERY, {
    variables: {
      url,
    },
    ssr: true,
  });
};

const DynamicPage = (props) => {
  const { query } = props;
  let url = "";
  let slug = [];
  query.slug.map((val) => {
    val = val.replace(".html", "");
    slug.push(val);
    url += `/${val}`;
  });
  url += ".html";

  const { loading, data } = getResolver(url);

  if (loading) {
    return (
      <Layout>
        <div>loading</div>
      </Layout>
    );
  }
  const resolver = data.urlResolver;
  return <Layout>{getComponent(resolver, slug)}</Layout>;
};

DynamicPage.getInitialProps = async ({ query }) => {
  return {
    query,
  };
};

export default compose(withApollo)(DynamicPage);
