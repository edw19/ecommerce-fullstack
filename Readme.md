# Prueba Técnica

La creación de la presente prueba técnica se adapto a los requisitos solicitados

    - versión de node recomendada node@14.17.4 LTS

## Usuarios Creados

Mi solución al reto planteado consta de la creación de usuarios con diferentes roles.
El primer usuario con el rol USER-ADMIN-STORE es el encargado de crear,
actualizar y eliminar productos

    - Usuario: admin@admin.com
    - Password: asdasd

El segundo usuario con el rol USER-CLIENT es el cliente de nuestro e-commerce

    - Usuario: client@client.com
    - Password: asdasd

La funcionalidad de comprar productos y almacenar el historal de gastos esta
activo para ambos roles de usuario.

La aplicación esta enlazada a una base de datos en mongodb atlas, puede crear
los productos y usuarios que desee

## Pasos para iniciar la aplicación

    1. clone ecommerce-fullstack
    2. cd api-graphql
    3. npm install
    4. npm run dev 
    - Esto hara que el servidor este ejecutandose en http://localhost:4000/graphql
    5. cd ecommerce
    6. npm install
    7. npm run dev
    8. abrir navegador en http://localhost:3000

## Tecnologías en BackEnd

    - NodeJs
    - Typescript
    - Graphql con Type-graphql y ExpressJS
    - MongoDb con el ODM @typegoose

## Tecnologías en FrontEnd

    - NextJS
    - Tailwindcss
    - React Query
    - graphql-request
