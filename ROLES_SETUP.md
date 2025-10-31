# Sistema de Roles y Permisos - Configuración

## 1. Configurar variables de entorno
Copia `.env.example` a `.env` y configura tus valores:

```bash
cp .env.example .env
```

## 2. Iniciar la aplicación
```bash
npm run start:dev
```

## 3. Ejecutar el seeder (crear roles, permisos y SuperAdmin)
```bash
POST http://localhost:3000/api/v1/seed
```

## 4. Hacer login como SuperAdmin
```bash
POST http://localhost:3000/api/v1/auth/login
Content-Type: application/json

{
  "email": "super@admin.local",
  "password": "admin123"
}
```

## 5. Probar endpoints protegidos
Usar el token JWT en el header Authorization:

```bash
# Probar acceso al dashboard
GET http://localhost:3000/api/v1/test-roles/dashboard
Authorization: Bearer YOUR_JWT_TOKEN

# Probar acceso solo para admins
GET http://localhost:3000/api/v1/test-roles/admin-only
Authorization: Bearer YOUR_JWT_TOKEN

# Ver todos los roles
GET http://localhost:3000/api/v1/roles
Authorization: Bearer YOUR_JWT_TOKEN
```

## Estructura de Permisos Creados

### Super Admin
- Todos los permisos excepto `roles:manage_employees`

### Store Admin  
- Gestión completa de tienda
- No puede gestionar otros admins
- Puede gestionar empleados

### Seller
- Solo lectura: `orders:read`, `products:read`, `customers:read`

## Endpoints Disponibles

### Autenticación
- `POST /auth/login` - Login
- `POST /seed` - Crear datos iniciales

### Roles (requiere permisos)
- `GET /roles` - Listar roles
- `POST /roles` - Crear rol (Super Admin)
- `GET /roles/permissions` - Listar permisos
- `PUT /roles/:id/permissions` - Asignar permisos (Super Admin)

### Pruebas
- `GET /test-roles/dashboard` - Requiere `dashboard:read`
- `GET /test-roles/products` - Requiere `products:read`
- `GET /test-roles/admin-only` - Requiere rol Admin
- `GET /test-roles/super-admin-only` - Requiere Super Admin + permisos