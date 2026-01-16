# Portal USEBEQ - Frontend (React + Tailwind)

Interfaz de usuario del Portal USEBEQ construida con React y Tailwind CSS.

## Inicio Rápido

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Iniciar servidor de desarrollo
npm run dev
```

Accede a: http://localhost:5173

## 🔑 Usuarios de Prueba

Una vez que el backend esté corriendo, puedes usar estas credenciales para iniciar sesión:

| Email | Password | Alumnos Vinculados |
|-------|----------|-------------------|
| `juan.gomez@email.com` | `password123` | 2 estudiantes |
| `maria.lopez@email.com` | `password123` | 2 estudiantes |
| `pedro.hernandez@email.com` | `password123` | 2 estudiantes |
| `alonso@email.com` | `password123` | 2 estudiantes |

### Ejemplo de uso:

1. Abre http://localhost:5173
2. Haz clic en "Iniciar sesión"
3. Ingresa:
   - Email: `juan.gomez@email.com`
   - Password: `password123`
4. Verás el dashboard con 2 alumnos vinculados

### Crear una cuenta nueva:

Si prefieres crear tu propia cuenta:
1. Haz clic en "Regístrate aquí"
2. Llena el formulario
3. Por ahora, la cuenta quedará en estado PENDIENTE (necesitarías activarla manualmente en la base de datos)
4. Recuperar contrasena

## Tecnologías

- **React 18** - UI Library
- **Tailwind CSS** - Utility-first CSS
- **React Router** - Routing
- **Zustand** - State Management
- **Axios** - HTTP Client
- **Vite** - Build Tool

## Estructura

```
src/
├── components/
│   ├── auth/           # Componentes de autenticación
│   ├── dashboard/      # Componentes del dashboard
│   └── layout/         # Componentes de layout
├── pages/              # Páginas principales
├── services/           # Servicios API
├── store/              # Estado global (Zustand)
└── App.jsx             # Componente raíz
```

## Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Lint
npm run lint
```
