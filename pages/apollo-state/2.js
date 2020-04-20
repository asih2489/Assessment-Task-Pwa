import { Fragment, useState } from "react";
import { withApollo } from "../../lib/apollo";
import { compose } from "redux";
import { Query } from "@apollo/react-components";
import gql from "graphql-tag";
import Button from "@material-ui/core/Button";
import Layout from "../../components/Layout";

const GET_VISIBILITY_FILTER = gql`
  {
    visibilityFilter @client
  }
`;

const GetDataPage2 = () => {
  const [visibility, setVisibility] = useState(0);
  return (
    <Layout>
      <Query query={GET_VISIBILITY_FILTER}>
        {({ data = {}, client }) => {
          return (
            <Fragment>
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
                Test Set Data on Other Page
              </Button>

              <h1>
                visibilityFilter :{" "}
                {data && typeof data.visibilityFilter !== "undefined"
                  ? data.visibilityFilter
                  : 0}
              </h1>
            </Fragment>
          );
        }}
      </Query>
    </Layout>
  );
};

export default compose(withApollo)(GetDataPage2);
