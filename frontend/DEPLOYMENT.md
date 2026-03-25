# 🚀 Guía de Despliegue (Deployment)

Este documento explica cómo funciona la configuración actual para GitHub Pages y cómo puedes migrarla a un entorno de producción tradicional (ej. Vercel, AWS o un servidor Node personalizado) en cualquier momento.

## 1. Configuración Actual: GitHub Pages (Sitio Estático)
Actualmente, la aplicación está configurada para exportarse como de forma **100% estática**. 
GitHub Pages solo sirve archivos estáticos (HTML, CSS, JS), por lo que Next.js se compila en una carpeta `out/` sin necesidad (ni posibilidad) de tener un servidor de Node en segundo plano.

**¿Qué modifiqué para lograr esto?**
1. **`frontend/next.config.ts`**: Se añadió `output: 'export'` (le dice a Next que genere los HTMLs) y `images: { unoptimized: true }` (GitHub pages no tiene servidor embebido de Next para optimizar imágenes).
2. **`.github/workflows/deploy.yml`**: Un pipeline preconfigurado de GitHub actions. Cuando subas tu código al branch `main`, GitHub instalará las dependencias y alojará la web automáticamente.

---

## 2. Cómo cambiar a Nivel de "Producción Full-Stack"
Si en el futuro la página requiere características dinámicas como Server-Side Rendering (SSR), rutas de API privadas, o una base de datos directamente con Next.js, deberás quitar la limitante de la web estática.

### Pasos exactos para revertir al modo Full-Stack:

**A. Editar en `next.config.ts`**
Borra la opción de exportación estática y la des-optimización de las imágenes. Tu archivo debe volver a quedar así:
```typescript
const nextConfig: NextConfig = {
  reactCompiler: true,
  // output: 'export',     <--- ELIMINA ESTA LÍNEA
  images: {
    // unoptimized: true,  <--- ELIMINA ESTA LÍNEA
    remotePatterns: [ ... ]
  }
};
```

**B. Opciones de Hosting a nivel producción:**

1. **🚀 Vercel (Altamente Recomendado)**
   Vercel son los creadores de Next.js y el despliegue es "Plug & Play".
   - Si migras a Vercel, puedes eliminar la carpeta `.github/workflows` que hemos creado.
   - Crea cuenta en [Vercel.com](https://vercel.com/), enlaza tu repositorio de GitHub, escoge el directorio de proyecto `frontend` y aprieta Deploy. Tendrás caché global, APIs y optimización de imágenes instantáneos.

2. **☁️ Servidor Propio (DigitalOcean, AWS EC2, VPS local)**
   Si prefieres control absoluto de tu infra:
   - Sube el repo a tu servidor.
   - Clona e ingresa en `cd /frontend`
   - Instala paquetes `npm ci`
   - Configura un "build" de servidor: `npm run build` (esto ahora crearía la carpeta oculta `.next`)
   - Para encenderlo: `npm start`
   - (Pro Tip: En servidores se suele utilizar una herramienta como de mantenimiento de procesos como `pm2` para mantener la web online si crashéa: `pm2 start npm --name "mi-web" -- start`).

---

Con esto, puedes lanzar tu web ahora de forma gratuita en GitHub, y en el futuro crecer sin dolores de cabeza.
