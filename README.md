Proyecto Final Backend:

1- Dentro del perfil de cada usuario registrado, se podrá ver la opción de "Upload Files" y "Admin Controller".

2- Solo los usuarios pueden agregar productos al carrito y realizar compras. Si se intenta agregar productos al carrito o acceder al carrito siendo administrador, dará error. Los usuarios premium no pueden agregar sus productos al carrito.

3- Si se intenta eliminar usuarios siendo usuario o premium, no se logrará.

4- Si se intenta crear productos nuevos siendo usuario, no se podrá. Solo los usuarios premium y administradores están autorizados para cargar productos.

5- Para obtener todos los usuarios: /api/users

6- Para eliminar usuarios inactivos: /api/users/inactive

7- En la ruta /apidocs, se podrá obtener información de la documentación para carts y products.

8- Proyecto desplegado: proyectofinalbackend-production-f241.up.railway.app