from django.urls import path
from .views import (
    registro,
    login,
    perfil,
    productos,
    crear_producto,
    actualizar_producto,
    eliminar_producto,
    pedidos,
    crear_pedido,
)

# este archivo define todas las rutas del backend
# es el equivalente a src --> routes --> auth.routes.js o products.routes.js en Node
#
# cada URL va a apuntar a una vista concreta en views.py
# por ejemplo:
# /api/auth/login/ -> login
# /api/productos/ -> productos
# /api/pedidos/crear/ -> crear_pedido
#
# en otras palabras, aca se arma el mapa de endpoints del proyecto.
urlpatterns = [
    path('auth/registro/', registro, name='registro'),
    path('auth/login/', login, name='login'),
    path('auth/perfil/', perfil, name='perfil'),
    path('productos/', productos, name='productos'),
    path('productos/crear/', crear_producto, name='crear_producto'),
    path('productos/<int:pk>/actualizar/', actualizar_producto, name='actualizar_producto'),
    path('productos/<int:pk>/eliminar/', eliminar_producto, name='eliminar_producto'),
    path('pedidos/', pedidos, name='pedidos'),
    path('pedidos/crear/', crear_pedido, name='crear_pedido'),
]
