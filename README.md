# LENDERO HUACHI - Frontend

Interfaz web para la plataforma de gestión de estrategias fiscales.

## 🚀 Quick Start

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env

# 3. Iniciar en modo desarrollo
npm run dev
```

Aplicación corriendo en: `http://localhost:5173`

## 📦 Scripts

- `npm run dev` - Modo desarrollo
- `npm run build` - Build para producción
- `npm run preview` - Preview del build

## 🔑 Login de Prueba

**Corporativo (Despacho):**
- Email: `maria@fiscalcorp.com`
- Password: `password123`

**Administrador (Cliente):**
- Email: `juan@miempresa.com`
- Password: `password123`

## 🛠️ Stack

- React 18
- Vite
- React Router DOM
- Zustand (state)
- Axios
- Tailwind CSS
- Lucide React (icons)
- React Hot Toast

## 📁 Estructura

```
src/
├── components/
│   ├── common/      # Componentes reutilizables
│   └── layout/      # Layout components
├── pages/           # Páginas/vistas
│   ├── auth/
│   ├── dashboard/
│   └── solicitudes/
├── services/        # API calls
├── store/           # Zustand stores
├── utils/           # Utilidades
├── App.jsx
├── main.jsx
└── index.css
```

## 🚢 Deployment

### Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify

1. Conectar repo de GitHub
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Deploy

## 📝 Notas

- El proxy en `vite.config.js` redirige `/api` a `http://localhost:3000`
- Autenticación con JWT almacenado en localStorage
- Dark mode: pendiente implementar

## 📄 Licencia

Propietario - LENDERO HUACHI © 2025
