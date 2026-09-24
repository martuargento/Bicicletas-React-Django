from django.db import models
from django.contrib.auth.models import User

# este archivo define la estructura de la base de datos
# es el equivalente a prisma --> schema.prisma en Node
#
# aca decimos que tablas existen, que columnas tienen y
# como se relacionan entre si.
#
# En este proyecto tenemos dos tablas principales:
# - Producto
# - Pedido
#
# cada clase representa una tabla y cada atributo representa una columna.
# esto es lo que Django usa para crear la base con SQLite.


#vamos a tener la tabla para los Productos
class Producto(models.Model):
    nombre = models.CharField(max_length=150)
    descripcion = models.TextField(blank=True, default='')
    precio = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    stock = models.IntegerField(default=0)
    imagen = models.ImageField(upload_to='bicicletas', blank=True, null=True)
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nombre


#vamos a tener la tabla para los Pedidos
class Pedido(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='pedidos')
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Pedido {self.id} - {self.usuario.username}'
