Proyecto Final de Backend

1- Dentro del profile de cada usuario registrado se podra ver la opción de UploadFiles y Admin Controller.

2- Solo los user pueden agregar productos al carrito y realizar compras, si se intenta agregar productos al carrito o acceder al carrito siendo admin dara error, los usuarios premium no pueden agregar sus productos al carrito.

3- Si se intenta eliminar usuarios siendo user o premium no se lograra.

4- Si se intenta crear productos nuevos siendo user no se podra, solo los usuarios premium y admin estan autorizados para cargar productos

5- Para obtener todos los usuarios: /api/users

6- Para eliminar usuarios inactivos: /api/users/inactive

7- En la ruta /apidocs se podra obtener informacion de la documentacion para carts y products