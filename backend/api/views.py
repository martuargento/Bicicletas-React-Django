from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Producto, Pedido
from .serializers import ProductoSerializer, PedidoSerializer, UserSerializer


def obtener_token_para_el_usuario(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


#vista para registrarse
@api_view(['POST'])
@permission_classes([AllowAny])
def registro(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    if not username or not email or not password:
        return Response({'error': 'Completa username, email y password.'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Ese usuario ya existe.'}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, email=email, password=password)
    tokens = obtener_token_para_el_usuario(user)
    return Response({
        'user': UserSerializer(user).data,
        'tokens': tokens,
    }, status=status.HTTP_201_CREATED)


#vista para loguearse
@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)
    if user is None:
        return Response({'error': 'Credenciales inválidas.'}, status=status.HTTP_401_UNAUTHORIZED)

    
    tokens = obtener_token_para_el_usuario(user)
    #si el usuario es correcto, pasa por aca y respondemos con un json.. que va a tener el token
    return Response({
        'user': UserSerializer(user).data,
        'tokens': tokens,
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def perfil(request):
    return Response(UserSerializer(request.user).data)


#vista para ver/listar todos los productos
@api_view(['GET'])
@permission_classes([AllowAny])
def productos(request):
    productos = Producto.objects.all().order_by('-id')
    #aca pasamos esos productos en formato objetos de django a JSON:
    serializer = ProductoSerializer(productos, many=True)
    #y mandamos la respuesta ya en formato JSON
    return Response(serializer.data)

# Nota: en settings.py el permiso por defecto es IsAuthenticated,
# por lo que los endpoints sensibles quedan protegidos automáticamente.
# Solo se abren explícitamente los que deben ser públicos (login, registro,
# catalogo de productos).


#vista para crear un producto
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def crear_producto(request):
    serializer = ProductoSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response({'error': 'Datos inválidos.', 'details': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


#vista para actualizar un producto
@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def actualizar_producto(request, pk):
    try:
        producto = Producto.objects.get(pk=pk)
    except Producto.DoesNotExist:
        return Response({'error': 'Producto no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

    serializer = ProductoSerializer(producto, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response({'error': 'Datos inválidos.', 'details': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


#vista para eliminar un producto
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def eliminar_producto(request, pk):
    try:
        producto = Producto.objects.get(pk=pk)
    except Producto.DoesNotExist:
        return Response({'error': 'Producto no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

    producto.delete()
    return Response({'mensaje': 'Producto eliminado.'}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def pedidos(request):
    pedidos = Pedido.objects.filter(usuario=request.user).order_by('-id')
    serializer = PedidoSerializer(pedidos, many=True)
    return Response(serializer.data)


#vista para crear un pedido
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def crear_pedido(request):
    data = request.data.copy()
    data['usuario'] = request.user.id

    serializer = PedidoSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
