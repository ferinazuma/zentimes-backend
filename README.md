Zentimes

Zentimes es una plataforma modular de gestión empresarial (SaaS) orientada a PYMEs y autónomos. El objetivo es ofrecer un ecosistema rápido, seguro y extensible con módulos como fichaje, inventario, citas, TPV, contabilidad, etc.
Este repo cubre el backend (API REST) y el roadmap de lo que viene en backend y frontend.

Producción: https://zentimes.es (API servida bajo /api detrás de Nginx + HTTPS)

⚙️ Stack técnico (Backend)

Runtime: Node.js LTS

Framework: Express

ORM: Sequelize

DB: MySQL 8 (Cloud SQL – IP pública)

Infra: Debian 12 en GCP (Compute Engine)

Proxy / TLS: Nginx + Let’s Encrypt (Certbot)

Process manager: PM2

Validación: express-validator

Auth: JWT + bcrypt

```text
📁 Estructura del proyecto
zentimes-backend/
├─ src/
│  ├─ config/           # Conexión DB, carga de .env
│  ├─ controllers/      # Lógica de negocio transversal
│  ├─ middlewares/      # JWT, validación, errores
│  ├─ models/           # Modelos base (User, Company, etc.)
│  ├─ routes/           # Enrutadores generales (/auth, /health...)
│  ├─ modules/
│  │  └─ inventory/     # Módulo Inventario (routes, controllers, models)
│  └─ index.js          # Entry point Express
├─ .env                 # Variables de entorno (no commitear)
├─ package.json
└─ README.md
```

🔐 Variables de entorno

Crea un archivo .env en la raíz:

PORT=3000
DB_HOST=34.140.177.7        # IP pública de Cloud SQL
DB_PORT=3306
DB_USER=zentimes-user
DB_PASSWORD=***************
DB_NAME=zentimes
JWT_SECRET=zentimes_super_clave


En despliegues públicos usar Secret Manager / secretos cifrados.

🚀 Puesta en marcha (local / servidor)

Instalar dependencias

npm install


Levantar el servidor de desarrollo

npx nodemon src/index.js
# o
node src/index.js


Producción con PM2

pm2 start src/index.js --name zentimes-api
pm2 save
pm2 startup   # ejecuta la línea que te devuelva para habilitar arranque automático


Nginx (proxy)

https://zentimes.es sirve frontend (cuando exista)

https://zentimes.es/api → http://localhost:3000

Bloque típico:

server {
    listen 80;
    server_name zentimes.es www.zentimes.es;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name zentimes.es www.zentimes.es;

    ssl_certificate /etc/letsencrypt/live/zentimes.es/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/zentimes.es/privkey.pem;

    # Frontend (cuando esté desplegado con build estático)
    root /var/www/zentimes-frontend;
    index index.html;

    # API
    location /api/ {
        proxy_pass http://localhost:3000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # SPA fallback (React/Vue)
    location / {
        try_files $uri /index.html;
    }
}


Certificado TLS:

sudo certbot --nginx -d zentimes.es -d www.zentimes.es
sudo certbot renew --dry-run

🧪 Endpoints iniciales (MVP)
Salud
GET /api/health
→ 200 { status: "ok" }

Autenticación
POST /api/auth/register   # Crea usuario (admin/empleado), hash de contraseña
POST /api/auth/login      # Devuelve JWT
GET  /api/auth/verify     # Verifica JWT (protegido)

Inventario
GET    /api/inventory             # Listado paginado/filtrado
POST   /api/inventory             # Crear producto
PUT    /api/inventory/:id         # Actualizar producto
DELETE /api/inventory/:id         # Borrar producto
POST   /api/inventory/:id/stock   # Ajustes (+/-) de stock


Todas las rutas de inventario requieren JWT y pertenencia a la compañía.

🧱 Modelos base (resumen)

User: id, name, email (único), passwordHash, role (admin | employee), companyId, timestamps.

Company: id, name, vat/cif, timezone, plan, timestamps.

Product (módulo inventario): id, companyId, name, sku, category, price, stock, minStock, status, timestamps.

Asociaciones:
Company 1—N User
Company 1—N Product

🔒 Seguridad y buenas prácticas

HTTPS obligatorio (redirigir HTTP → HTTPS)

JWT con expiración + rotación si aplica

bcrypt para passwords

Validación de inputs (express-validator) y sanitización

CORS controlado (origin de frontend)

Principio de mínimo privilegio (roles y scopes)

Logs (morgan / winston) + trazabilidad

Backups de DB y migraciones versionadas

📦 Scripts útiles
{
  "scripts": {
    "dev": "nodemon src/index.js",
    "start": "node src/index.js",
    "lint": "eslint .",
    "test": "jest"
  }
}


(ESLint/Jest opcionales; se añadirán en la fase de calidad.)

🗺️ Roadmap
✅ Entregado (Fase 0 / Infra)

VM Debian en GCP, dominio y DNS

Nginx + Let’s Encrypt (HTTPS)

PM2 en producción (auto-arranque)

Conexión MySQL (Cloud SQL)

🚧 En curso (MVP – Agosto)

Backend

 Auth: registro/login/roles/JWT

 Inventario: CRUD + ajustes de stock

 Validaciones y control de errores

 Documentación OpenAPI (Swagger)

 Seeds mínimos (empresa demo)

Frontend (landing + app)

 Proyecto React + Vite

 Landing (hero, módulos, CTA)

 Pantalla de login

 Dashboard base + listado de productos

 Consumo de API bajo /api

🔜 Próximas fases (Q4)

Módulos

 Fichaje: entrada/salida/pausas, geolocalización opcional

 Citas/Reservas

 TPV y ventas

 Contabilidad (básica)

 Nóminas (cálculo rápido y exportación)

Plataforma

 Multi-idioma / zonas horarias

 Roles avanzados y permisos granulares

 Exportación (PDF/Excel)

 Notificaciones (email/push)

 Integraciones (ERP/contabilidad externa)

 Observabilidad (metrics, alertas, dashboards)

🧩 Convenciones

Rutas bajo /api

RESTful con respuestas JSON { data, meta, error }

Commit messages: conventional commits (feat, fix, chore, docs…)

Branching: main (producción), develop (staging), feature branches

🤝 Contribuir

Crea un branch desde develop

Añade tests si aplica

Abre PR con descripción y screenshots/logs

Revisión y merge

📄 Licencia

MIT (pendiente de confirmar).

📬 Contacto

Proyecto: Zentimes

Dominio: https://zentimes.es

Responsable: Fernando Aportafranco — fernandoaportafranco@gmail.com
