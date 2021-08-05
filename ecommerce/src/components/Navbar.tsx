import Link from "next/link";
import { useUser } from "src/hooks/useUser";
import NewProduct from "./modals/NewProduct";
import { useMutation, useQueryClient } from "react-query";
import { useRouter } from "next/router";
import { GraphQLClient } from "graphql-request";
import { URI_GRAPHQL } from "src/graphql/constants";
import { LOGOUT } from "src/graphql/mutations";
import { useShoppinCard } from "./context/ShoppingCartProvider";

async function fetcherLogout() {
  const token = window.localStorage.getItem("access-token");
  if (!token) {
    throw new Error("no tienes un token de acceso");
  }
  const headers = {
    headers: {
      authorization: `Bearer ${token ? token : ""}`,
    },
  };
  const graphqlClient = new GraphQLClient(URI_GRAPHQL, headers);
  const data = await graphqlClient.request(LOGOUT);
  return data.logout;
}

function Navbar(): JSX.Element {
  const { data } = useUser();
  const router = useRouter();
  const products = useShoppinCard();
  const mutate = useMutation("logout", fetcherLogout);
  const queryClient = useQueryClient();

  const handlerLogout = async () => {
    try {
      await mutate.mutateAsync();
      window.localStorage.removeItem("access-token");
      queryClient.invalidateQueries();
      router.push("/store/products");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="grid grid-cols-5 bg-blue-300 py-3">
      <Link href="/store/products">
        <a className="text-2xl font-bold flex flex-row col-start-2 ">
          <p className="transform -rotate-45 pr-3">E</p>
          <p> commerce</p>
        </a>
      </Link>
      <ul className="flex flex-row justify-center items-center col-span-3 gap-x-3">
        <li>
          <Link href="/shopping">
            <a className="hover:text-white relative">
              <span className="absolute -top-3 text-white -left-6 bg-green-500 px-2 rounded-full">
                {products.length}
              </span>
              Carrito de Compras
            </a>
          </Link>
        </li>
        {data?.role === "USER-ADMIN-STORE" && <NewProduct />}
        {data ? (
          <>
            <li>
              <Link href="/profile">
                <a className="hover:text-white">
                  {data.name + " "} {data.surname}
                </a>
              </Link>
            </li>
            <li className="cursor-pointer" onClick={handlerLogout}>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </li>
          </>
        ) : (
          <li>
            <Link href="/signin">
              <a>Iniciar Sesión</a>
            </Link>
          </li>
        )}
        <li></li>
      </ul>
    </nav>
  );
}

export default Navbar;
