from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Producto, Pedido


#serializador para ver, crear o modificar un usuario
#convirtiendolo del modelo de Django a JSON
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')




#serializador para ver, crear o modificar un Producto
#convirtiendolo del modelo de Django a JSON
#tambien valida los datos recibidos en caso de creacion o modificacion de un producto
class ProductoSerializer(serializers.ModelSerializer):
    imagen = serializers.ImageField(required=False, allow_null=True)

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

    

#serializador para ver, crear o modificar un Pedido
#convirtiendolo del modelo de Django a JSON
#tambien valida los datos recibidos en caso de creacion o modificacion de un Pedido
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
