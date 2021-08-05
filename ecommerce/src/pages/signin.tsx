import React, { useState } from "react";
import { useMutation } from "react-query";
import { request } from "graphql-request";
import { SIGNIN } from "../graphql/mutations";
import { useRouter } from "next/router";
import Link from "next/link";
import { URI_GRAPHQL } from "src/graphql/constants";

export interface IUser {
  email: string;
  password: string;
}

async function fetcher(user: IUser): Promise<boolean> {
  const data = await request(URI_GRAPHQL, SIGNIN, {
    credentials: { email: user.email, password: user.password },
  });
  window.localStorage.setItem("access-token", data.signin);
  return true;
}

function Login(): JSX.Element {
  const router = useRouter();
  const [user, setUser] = useState<IUser>({
    email: "",
    password: "",
  });
  const mutate = useMutation<boolean, Error, IUser>("signin", fetcher);

  const handlerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };

  const handlerLogin = async (event: React.FormEvent<EventTarget>) => {
    event.preventDefault();
    const { email, password } = user;
    const empty = !email || !password;

    if (empty) {
      return alert("Ingresa tus credenciales");
    }

    try {
      await mutate.mutateAsync(user);
      router.push("/store/products");
    } catch (error) {
      alert(
        error.response?.errors[0].message.replace("ValidationError: Error:", "")
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form
        onSubmit={handlerLogin}
        action=""
        className="w-2/4 md:w-1/3 grid grid-cols-1 gap-y-4"
      >
        <div className="text-6xl flex flex-row  justify-center">
          <p className="transform -rotate-45 pr-3">E </p>
          <p> commerce</p>
        </div>
        <input
          type="text"
          className="py-3 px-2 bg-blue-100 placeholder-blue-900 rounded-md"
          placeholder="Ingresa tu email"
          onChange={handlerChange}
          value={user.email}
          name="email"
        />
        <input
          type="password"
          className="py-3 px-2 bg-blue-100 placeholder-blue-900 rounded-md"
          placeholder="Ingresa tu contraseña"
          onChange={handlerChange}
          value={user.password}
          name="password"
        />
        <button
          type="submit"
          className="py-2 bg-blue-400 text-white rounded-md flex flex-row items-center justify-center"
        >
          {mutate.isLoading && (
            <svg
              className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          )}
          Iniciar Sesión
        </button>
        <Link href="/signup">
          <a className="text-center mt-10 underline font-thin">
            Crear un cuenta
          </a>
        </Link>
      </form>
    </div>
  );
}

export default Login;
