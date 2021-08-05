import Image from "next/image";
import { useRouter } from "next/router";
import { ADD_PRODUCT_TO_SHOPPING_CART } from "./context/ShoppingCartActions";
import { useShoppinCardDispatch } from "./context/ShoppingCartProvider";

interface IProducts {
  product: {
    id: string;
    name: string;
    stock: number;
    price: number;
    image: string;
  };
}

function Product({
  product: { id, name, stock, image, price },
}: IProducts): JSX.Element {
  const router = useRouter();
  const { dispatch } = useShoppinCardDispatch();
  return (
    <div className="col-span-2 text-center hover:shadow-lg  py-8">
      <Image
        src={image}
        width={100}
        height={100}
        placeholder="blur"
        blurDataURL={image}
        className="rounded-md"
      />
      <p>{name}</p>
      <p>
        Unidades Disponibles{" "}
        <span className="text-green-400 font-bold">{stock}</span>
      </p>
      <div className="flex flex-row gap-x-3 justify-center">
        <button
          onClick={() => {
            dispatch({
              type: ADD_PRODUCT_TO_SHOPPING_CART,
              payload: { id, name, units: 1, price, image },
            });
            alert(`Producto agregado al carrito ${name}`);
          }}
          className="bg-green-400 text-white rounded-md px-2 py-1"
        >
          Agregar al carrito
        </button>
        <button
          className="hover:bg-blue-500 hover:text-white rounded-md px-2 py-1"
          onClick={() =>
            router.push({
              pathname: `/store/products/${id}`,
            })
          }
        >
          Ver producto
        </button>
      </div>
    </div>
  );
}

export default Product;
