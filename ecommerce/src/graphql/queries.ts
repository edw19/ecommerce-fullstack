import { gql } from "graphql-request";

export const GET_PRODUCT = gql`
  query getProduct($id: String!) {
    getProduct(id: $id) {
      id
      name
      stock
      price
      image
    }
  }
`;

export const getProducts = gql`
  query getProducts {
    getProducts {
      name
      id
      price
      stock
      image
    }
  }
`;

export const GET_USER = gql`
  query getUser {
    getUser {
      id
      name
      secondName
      surname
      secondSurname
      address
      email
      role
      expenses {
        expense
        createAt
      }
    }
  }
`;
