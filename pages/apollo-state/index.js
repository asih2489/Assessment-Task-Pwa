import { useState } from "react";
import { withApollo } from "../../lib/apollo";
import { compose } from "redux";
import { ApolloConsumer, Query } from "@apollo/react-components";
import Button from "@material-ui/core/Button";
import gql from "graphql-tag";
import Link from "next/link";
import Layout from "../../components/Layout";

const AddDataState = () => {
  const [visibility, setVisibility] = useState(0);
  return (
    <ApolloConsumer>
      {(client) => {
        return (
          <Button
            variant="contained"
            fullWidth
            color="primary"
            onClick={() => {
              client.writeData({
                data: { visibilityFilter: visibility === 0 ? 1 : 0 },
              });
              setVisibility(visibility === 0 ? 1 : 0);
            }}
          >
            Test Set Data
          </Button>
        );
      }}
    </ApolloConsumer>
  );
};

const GET_VISIBILITY_FILTER = gql`
  {
    visibilityFilter @client
  }
`;

const GetDataState = () => {
  return (
    <div>
      <Query query={GET_VISIBILITY_FILTER}>
        {({ data = {}, client }) => {
          return (
            <h1>
              visibilityFilter :{" "}
              {data && typeof data.visibilityFilter !== "undefined"
                ? data.visibilityFilter
                : 0}
            </h1>
          );
        }}
      </Query>
    </div>
  );
};

const LocalState = () => {
  return (
    <Layout>
      <AddDataState />
      <GetDataState />
      <Link href="/local-state/2">
        <a>Page 2</a>
      </Link>
    </Layout>
  );
};

export default compose(withApollo)(LocalState);
