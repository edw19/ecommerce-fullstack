import { Modal } from "react-responsive-modal";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { GraphQLClient } from "graphql-request";
import { URI_GRAPHQL } from "src/graphql/constants";
import { CREATE_PRODUCT } from "src/graphql/mutations";

interface INewProduct {
  name: string;
  price: string;
  stock: number;
}

async function fetcherNewProduct(variables: any) {
  const token = window.localStorage.getItem("access-token");
  const headers = {
    headers: {
      authorization: `Bearer ${token ? token : ""}`,
    },
  };
  const graphqlClient = new GraphQLClient(URI_GRAPHQL, headers);
  const data = await graphqlClient.request(CREATE_PRODUCT, variables);
  return data.createProduct;
}

function NewProduct(): JSX.Element {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [newProduct, setNewProduct] = useState<INewProduct>({
    name: "",
    price: "",
    stock: 1,
  });

  const mutate = useMutation("newProduct", fetcherNewProduct, {
    onSuccess: async () => {
      await queryClient.invalidateQueries("getProducts");
    },
  });
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  const handlerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewProduct({
      ...newProduct,
      [event.target.name]:
        event.target.type === "number"
          ? parseInt(event.target.value)
          : event.target.value,
    });
  };
  const handlerChangeImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImage(event.target.files[0]);
  };

  const handlerSubmitNewProduct = async (
    event: React.FormEvent<EventTarget>
  ) => {
    event.preventDefault();
    const { name, price, stock } = newProduct;

    const empty = !name || !price || !stock || !image;

    if (empty) {
      return alert("debes llenar todos los campos");
    }
    try {
      await mutate.mutateAsync({ product: newProduct, image });
      setNewProduct({ name: "", price: "", stock: 1 });
      setImage(null)
      onCloseModal();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <button className="hover:text-white" onClick={onOpenModal}>
        Nuevo Producto
      </button>
      <Modal open={open} onClose={onCloseModal} center>
        <h2>Nuevo Producto</h2>
        <form
          onSubmit={handlerSubmitNewProduct}
          className="grid grid-cols-2 gap-y-3 gap-x-3"
        >
          <input
            type="text"
            className="py-3 px-2 bg-gray-50 placeholder-blue-900 rounded-md"
            placeholder="Nombre del producto"
            onChange={handlerChange}
            value={newProduct.name}
            name="name"
          />
          <input
            type="text"
            className="py-3 px-2 bg-gray-50 placeholder-blue-900 rounded-md"
            placeholder="Precio del producto"
            onChange={handlerChange}
            value={newProduct.price}
            name="price"
          />
          <input
            type="number"
            className="py-3 px-2 bg-gray-50 placeholder-blue-900 rounded-md"
            placeholder="pricio del producto"
            onChange={handlerChange}
            value={newProduct.stock}
            name="stock"
          />
          <input
            type="file"
            onChange={handlerChangeImage}
            accept="image/*"
            className="py-3 px-2 bg-gray-50 placeholder-blue-900 rounded-md"
          />
          <button className="flex flex-row items-center justify-center bg-blue-400 col-span-2 px-2 py-2 text-white">
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
            Crear Producto
          </button>
        </form>
      </Modal>
    </div>
  );
}

export default NewProduct;
