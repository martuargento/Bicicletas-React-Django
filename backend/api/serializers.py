from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Producto, Pedido

# este archivo es la capa de validación y transformación de datos
# es el equivalente a la parte donde en Node usualmente validamos
# inputs y convertimos datos antes de guardarlos o devolverlos.
#
# en Django, los serializers hacen dos cosas importantes:
# 1. convierten modelos de Django a JSON
# 2. validan los datos que vienen del frontend
#
# esto es clave porque el frontend no habla con Python directamente,
# habla con JSON. Entonces el serializer sirve como puente entre
# la base de datos y el cliente.

#serializador para cuando cargamos un nuevo usuario
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')




#serializador para cuando cargamos un nuevo producto
class ProductoSerializer(serializers.ModelSerializer):
    imagen = serializers.SerializerMethodField()

    class Meta:
        model = Producto
        fields = ('id', 'nombre', 'descripcion', 'precio', 'stock', 'imagen', 'creado_en')

    def validate_nombre(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError('El nombre es obligatorio.')
        return value.strip()

    def validate_precio(self, value):
        if value < 0:
            raise serializers.ValidationError('El precio no puede ser negativo.')
        return value

    def validate_stock(self, value):
        if value < 0:
            raise serializers.ValidationError('El stock no puede ser negativo.')
        return value

    def get_imagen(self, obj):
        if obj.imagen and hasattr(obj.imagen, 'url'):
            return obj.imagen.url
        return None

    

#serializador para cuando cargamos un nuevo pedido
class PedidoSerializer(serializers.ModelSerializer):
    usuario = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Pedido
        fields = ('id', 'usuario', 'total', 'creado_en')
        read_only_fields = ('id', 'usuario', 'creado_en')

    def validate_total(self, value):
        if value < 0:
            raise serializers.ValidationError('El total no puede ser negativo.')
        return value
