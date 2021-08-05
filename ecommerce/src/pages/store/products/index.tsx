import Layout from "components/Layout";
import ProductsList from "components/ProductsList";
import { fetcherGetProducts } from "src/hooks/useProducts";

function Index({ products }): JSX.Element {
  return (
    <Layout>
      <ProductsList products={products} />
    </Layout>
  );
}

export async function getStaticProps() {
  const products = await fetcherGetProducts();
  return { props: { products } };
}

export default Index;
