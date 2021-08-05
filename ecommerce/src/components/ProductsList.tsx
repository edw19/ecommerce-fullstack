import { useProducts } from "src/hooks/useProducts";
import Product from "./Product";

function ProductsList({ products }): JSX.Element {
  const { data } = useProducts({ initialData: products });
  
  if (Object.keys(data).length === 0) {
    return (
      <div className="flex flex-col items-center mt-20">
        <h2 className="text-4xl font-light">Sin productos para vender</h2>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-8 gap-4 px-4">
      {data?.map((product, index) => {
        return <Product key={index} product={product} />;
      })}
    </div>
  );
}

export default ProductsList;
