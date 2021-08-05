import { buildSchemaSync } from "type-graphql";
import { authChecker } from "../utils/auth";

import { RegisterResolver } from "../modules/users/Register";
import { UpdateUserResolver } from "../modules/users/UpdateUser";
import { SignResolver } from "../modules/users/Signin";
import { UserResolver } from "../modules/users/UserResolvers";
import { LogoutResolver } from "../modules/users/Logout";

import { NewProductResolver } from "../modules/products/NewProduct";
import { ProductsResolver } from "../modules/products/ProductsResolver";
import { UpdateProductResolver } from "../modules/products/UpdateProduct";

export function createSchemaGraphql() {
  const schema = buildSchemaSync({
    resolvers: [
      RegisterResolver,
      UpdateUserResolver,
      SignResolver,
      UserResolver,
      NewProductResolver,
      UpdateProductResolver,
      ProductsResolver,
      LogoutResolver,
    ],
    authChecker,
  });
  return schema;
}
