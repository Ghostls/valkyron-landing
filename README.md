# Valkyron Group — Landing Page

Stack: React 18 + TypeScript + Vite

## Instalación

```bash
npm install
npm run dev
```

## Build para producción

```bash
npm run build
```

El output queda en `/dist` — listo para subir a Vercel, Netlify o cualquier hosting estático.

## Deploy en Vercel (recomendado)

1. Sube el proyecto a GitHub
2. Importa el repo en [vercel.com](https://vercel.com)
3. Vercel detecta Vite automáticamente — solo dale Deploy

## Estructura

```
src/
  components/
    Navbar.tsx        — Navegación fija con blur
    Hero.tsx          — Hero con grid táctico animado
    MisionVision.tsx  — Cards de Misión y Visión
    QuienesSomos.tsx  — Identidad + 4 pilares
    Servicios.tsx     — Grid de 6 capacidades
    Portafolio.tsx    — 4 proyectos (MIA, Águilas, Rayocero, Alchaplast)
    ContactoCTA.tsx   — CTA final con email
    Footer.tsx        — Footer minimalista
    Divider.tsx       — Separador con gradiente purple
  App.tsx             — Ensamblado de secciones
  main.tsx            — Entry point
  index.css           — Variables CSS + reset
```

## Personalización

- **Logo:** Reemplaza el texto en `Navbar.tsx` con tu `<img>` cuando tengas el logo
- **Email:** Cambia `info@valkyron.com` en `ContactoCTA.tsx`
- **Stats hero:** Edita los números en `Hero.tsx`
- **Colores:** Las variables CSS están en `index.css`
