import {
  DELETE_PRODUCTS_FROM_SHOPPING_CART,
  DELETE_PRODUCTS_WITH_STOCK_ZERO,
  DELETE_PRODUCT_FROM_SHOPPING_CART,
} from "components/context/ShoppingCartActions";
import {
  useShoppinCard,
  useShoppinCardDispatch,
} from "components/context/ShoppingCartProvider";
import Layout from "components/Layout";
import Image from "next/image";
import { useUser } from "src/hooks/useUser";
import Link from "next/link";
import { useMutation, useQueryClient } from "react-query";
import { GraphQLClient } from "graphql-request";
import { URI_GRAPHQL } from "src/graphql/constants";
import { CREATE_BUY } from "src/graphql/mutations";
import { useState } from "react";

async function fetcherCreateBuy(variables) {
  const token = window.localStorage.getItem("access-token");
  if (!token) return null;
  const headers = {
    headers: {
      authorization: `Bearer ${token ? token : ""}`,
    },
  };
  const graphqlClient = new GraphQLClient(URI_GRAPHQL, headers);
  const data = await graphqlClient.request(CREATE_BUY, variables);
  return data.createBuy;
}

function Shopping(): JSX.Element {
  const queryClient = useQueryClient();
  const { dispatch } = useShoppinCardDispatch();
  const [error, setError] = useState<string[]>();
  const mutate = useMutation<any, Error, any>("createBuy", fetcherCreateBuy, {
    onSuccess: async (data) => {
      if (data) {
        dispatch({
          type: DELETE_PRODUCTS_WITH_STOCK_ZERO,
          payload: data.map((d: any) => d.id),
        });
        await queryClient.invalidateQueries("getProducts");
        setError(data);
        return;
      }
      dispatch({
        type: DELETE_PRODUCTS_FROM_SHOPPING_CART,
      });
      setError(null);
    },
  });
  const products = useShoppinCard();
  const { data } = useUser();

  const handlerBuy = async () => {
    try {
      const variables = {
        products: products.map((product) => ({
          id: product.id,
          units: product.units,
        })),
        total: handlerTotal(),
      };
      await mutate.mutateAsync(variables);
    } catch (error) {
      alert("hubo un error en la compra");
    }
  };

  const handlerTotal = () => {
    const totalByProducts = products.map(
      (product) => product.units * Number(product.price)
    );

    const total = totalByProducts.reduce(
      (preValue, currentValue) => preValue + currentValue,
      0
    );

    return total.toFixed(2);
  };

  return (
    <Layout>
      <h2 className="text-center text-2xl py-4 font-bold">
        Carrito de Compras
      </h2>
      <div className="grid grid-cols-12">
        {products.map((product, index) => {
          return (
            <li
              className="col-start-3 col-span-8 text-center  grid grid-flow-col items-center list-none rounded-md hover:bg-blue-400 hover:text-white py-2 px-2"
              key={product.name + index}
            >
              <Image
                src={product.image}
                width={50}
                height={50}
                layout="responsive"
                className="rounded-md"
              />
              <p className="ml-5">{product.name}</p>
              <p>Unidades {product.units}</p>
              <p>Precio {product.price}</p>
              <p>Total {Number(product.price) * product.units}</p>
              <button
                className="hover:text-red-500"
                onClick={() =>
                  dispatch({
                    type: DELETE_PRODUCT_FROM_SHOPPING_CART,
                    payload: { id: product.id },
                  })
                }
              >
                Eliminar
              </button>
            </li>
          );
        })}
      </div>
      {error && (
        <div className="flex flex-row items-center justify-center mt-2">
          <div className="grid grid-cols-1 rounded-md border-2 p-4">
            {error?.map((err: any, index) => {
              return (
                <li className="list-none" key={err.name + index}>
                  El producto{" "}
                  <span className="text-red-500 font-semibold">{err.name}</span>{" "}
                  ha removido de la lista, porque se su stock es 0
                </li>
              );
            })}
          </div>
        </div>
      )}
      <div className="flex flex-row items-center justify-center mt-2">
        <p>Total a pagar: {handlerTotal()}</p>
        {data ? (
          <button
            onClick={handlerBuy}
            className="bg-green-400 ml-5 px-2 py-2 rounded-md text-white"
          >
            Comprar
          </button>
        ) : (
          <Link href="/signin">
            <a className="ml-5 underline font-semibold">Iniciar Sesión</a>
          </Link>
        )}
      </div>
    </Layout>
  );
}

export default Shopping;
