# Manual: Crear y Desplegar Static Web App en Azure (React + Vite)

## Requisitos Previos
- Cuenta de Azure activa
- Repositorio en GitHub con el código del frontend
- Node.js instalado localmente (para desarrollo)

---

## Paso 1: Crear Static Web App en Azure Portal

1. Ir a [Azure Portal](https://portal.azure.com)
2. Click en **"Create a resource"** (+ Crear un recurso)
3. Buscar **"Static Web App"**
4. Click en **"Create"**

### Configuración Básica

| Campo | Valor |
|-------|-------|
| Subscription | Tu suscripción de Azure |
| Resource Group | Crear nuevo o usar existente (ej: `rg-portal-usebeq`) |
| Name | `portal-usebeq-frontend` |
| Plan type | **Free** (para desarrollo) o **Standard** (producción) |
| Region | `Mexico Central` o la más cercana |
| Source | **GitHub** |

### Conectar con GitHub

1. Click en **"Sign in with GitHub"**
2. Autorizar Azure Static Web Apps en tu cuenta de GitHub
3. Seleccionar:
   - **Organization**: Tu organización o usuario
   - **Repository**: `portal-usebeq-frontend`
   - **Branch**: `main`

### Build Details

| Campo | Valor |
|-------|-------|
| Build Presets | **Vite** |
| App location | `/` |
| Api location | (dejar vacío) |
| Output location | `dist` |

5. Click en **"Review + create"**
6. Click en **"Create"**

---

## Paso 2: Configurar Variables de Entorno

Las variables de entorno en Vite se configuran en el archivo de GitHub Actions, NO en Azure Portal.

1. Ir a tu repositorio en GitHub
2. Navegar a `.github/workflows/azure-static-web-apps-*.yml`
3. Editar el archivo y agregar las variables en la sección `env`:

```yaml
- name: Build And Deploy
  id: builddeploy
  uses: Azure/static-web-apps-deploy@v1
  env:
    # Variables de entorno para el build de Vite
    VITE_API_URL: https://tu-backend.azurewebsites.net/api/v1
    VITE_GOOGLE_AUTH_ENABLED: "true"
  with:
    azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_* }}
    repo_token: ${{ secrets.GITHUB_TOKEN }}
    action: "upload"
    app_location: "/"
    api_location: ""
    output_location: "dist"
```

---

## Paso 3: Configurar Dominio Personalizado (Opcional)

1. En Azure Portal, ir a tu Static Web App
2. Click en **"Custom domains"** en el menú lateral
3. Click en **"+ Add"**
4. Ingresar tu dominio (ej: `portal.usebeq.edu.mx`)
5. Seguir las instrucciones para configurar el DNS:
   - Agregar registro CNAME o TXT según indique Azure
6. Esperar validación (puede tomar hasta 24 horas)

---

## Paso 4: Verificar Despliegue

1. Cada vez que hagas push a la rama `main`, se desplegará automáticamente
2. Ver el progreso en GitHub > Actions
3. La URL de tu app estará en Azure Portal > Static Web App > Overview
   - Ejemplo: `https://jolly-coast-03240f610.4.azurestaticapps.net`

---

## Estructura del Proyecto React/Vite

```
frontend/
├── .github/
│   └── workflows/
│       └── azure-static-web-apps-*.yml  # CI/CD automático
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   │   └── api.js          # Configuración de API
│   ├── store/
│   └── App.jsx
├── .env                     # Variables locales (NO subir a git)
├── .env.example             # Ejemplo de variables
├── package.json
└── vite.config.js
```

---

## Variables de Entorno

### Desarrollo Local (`.env`)
```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_GOOGLE_AUTH_ENABLED=false
```

### Producción (GitHub Actions)
```yaml
env:
  VITE_API_URL: https://tu-backend.azurewebsites.net/api/v1
  VITE_GOOGLE_AUTH_ENABLED: "true"
```

---

## Comandos Útiles

```bash
# Instalar dependencias
npm install

# Desarrollo local
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview
```

---

## Solución de Problemas

### El build falla en GitHub Actions
- Verificar que `package.json` tenga el script `build`
- Verificar que las dependencias estén correctas
- Revisar los logs en GitHub > Actions

### Las variables de entorno no funcionan
- Las variables de Vite DEBEN empezar con `VITE_`
- Se configuran en el workflow de GitHub, NO en Azure Portal
- Después de cambiarlas, hacer un nuevo push para rebuild

### Error 404 en rutas
- Agregar archivo `staticwebapp.config.json` en la raíz:
```json
{
  "navigationFallback": {
    "rewrite": "/index.html"
  }
}
```

---

## Costos Estimados

| Plan | Costo | Límites |
|------|-------|---------|
| Free | $0 | 100GB bandwidth, 2 custom domains |
| Standard | ~$9/mes | 100GB bandwidth, 5 custom domains, más features |
