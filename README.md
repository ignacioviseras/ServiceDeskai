# ServiceDeskai
ServiceDeskai es una web que hace un analisis de oficinas desde un punto de vista de diseño de interiores, utliza una ia para analizar las fotogradias que se le presentan y asi poder hacer un asesoramiento a los clientes de como se podrian mejorar sus espacios de trabajo

El proyecto se levanta creando un `/backend/.env` y añadimos esto

```c
MONGO_URI=mongodb://${XXXXXXX}:${XXXXXXXXX}@mongodb:27017/service_desk_db?authSource=admin
PORT=5555
JWT_SECRET=XXXXXXXXXXXXXXX==
ACCESS_TOKEN_EXPIRATION=3d
REFRESH_TOKEN_EXPIRATION=30d
ADMIN_EMAIL=XXXXXXXXXXXX@gmail.com
ADMIN_PASSWORD=xxxxxxxxxxx
ADMIN_NAME=xxxxxxxxxxxxx
```

El proyecto se levanta creando un `/fronted/.env` y añadimos esto
  La clave GEMINI_API_KEY se genera [aqui](https://aistudio.google.com/api-keys)
```c
REACT_APP_GEMINI_API_KEY="xxxxxxxxxxxxxxxxxxxxxxx"

```
El proyecto se levanta creando un `/ex00/.env` y añadimos esto
```c
MONGO_USER=xxxxxxxx
MONGO_PASSWORD=xxxxxxxxxx

```

Una vez q este todo nos vamos a la carpeta `ex00/` y hacemos estos comandos

```c
docker-compose build
docker-compose up
```
luego podremos acceder a localhost y ya estara funcionando [localhost](http://localhost:5173)
