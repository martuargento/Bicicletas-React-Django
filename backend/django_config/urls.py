from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# este archivo es la ruta principal del proyecto Django

# es el equivalente a src --> config --> app.js en Node
#
# aca se arma la app principal del backend
# se montan las rutas del proyecto
# y se delegan las rutas de la API a api --> urls.py
#
# en este proyecto, todas las rutas de la API quedan bajo /api/
# y tambien se habilita la entrega de archivos multimedia cuando DEBUG = True
#
# esto es importante porque src --> config --> app.js en Node no es el servidor que prende la app,
# sino el archivo donde se arma y se configuran las rutas y la estructura general.
# en Django, este archivo cumple esa misma funcion.

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
