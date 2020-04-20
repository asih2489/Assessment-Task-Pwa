import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { compose } from "redux";
import { withApollo } from "../lib/apollo";
import Link from "next/link";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import Layout from "../components/Layout";

export const ALL_CATEGORY_QUERY = gql`
  {
    categoryList {
      children_count
      children {
        id
        level
        name
        path
        url_path
        url_key
        children {
          id
          level
          name
          path
          url_path
          url_key
        }
      }
    }
  }
`;
export const allPostsQueryVars = {
  skip: 0,
  first: 10,
};

const IndexPage = (props) => {
  const { loading, data } = useQuery(ALL_CATEGORY_QUERY);
  if (loading) {
    return (
      <Layout>
        <div>loading</div>
      </Layout>
    );
  }
  const { categoryList } = data;
  return (
    <Layout>
      <h1>Select Your Favorite Category</h1>
      {categoryList[0].children.map((childLv1, idx) => {
        return (
          <List component="nav" aria-label="main mailbox folders" key={idx}>
            <ListItem button>
              <ListItemText primary={childLv1.name} />
            </ListItem>
            <Divider />
            <ul>
              {childLv1.children.map((childLv2, num) => {
                return (
                  <li key={num}>
                    <Link
                      href="/[...slug]"
                      as={`/${childLv1.url_key}/${childLv2.url_key}.html`}
                    >
                      <a>{childLv2.name}</a>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </List>
        );
      })}
    </Layout>
  );
};

export default compose(withApollo)(IndexPage);
