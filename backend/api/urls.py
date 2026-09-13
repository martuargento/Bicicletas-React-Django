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
