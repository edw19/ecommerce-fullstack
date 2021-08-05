import { useQuery } from "react-query";
import { request } from "graphql-request";
import { getProducts } from "../graphql/queries";
import { URI_GRAPHQL } from "src/graphql/constants";

export async function fetcherGetProducts() {
  const data = await request(URI_GRAPHQL, getProducts);
  return data.getProducts;
}

export function useProducts({ initialData }) {
  return useQuery("getProducts", fetcherGetProducts, { initialData });
}
