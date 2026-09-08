# 🧹 X Post Cleaner — Eliminar Tweets, Reposts y Likes Masivamente

Una extensión de Chrome gratuita y de código abierto para **eliminar tweets masivamente**, reposts, respuestas y likes en X (antes Twitter). Sin servicios de terceros, sin claves API — todo se ejecuta localmente en tu navegador.

> ⚡ Funciona con la interfaz más reciente de X.com (2024+). Soporta interfaz en inglés y español.

🌐 **[Read this in English](README.md)**

---

## ✨ Características

- **Eliminar tweets masivamente** — Borra todos tus posts en un clic
- **Eliminar reposts** (retweets) — Limpia el contenido compartido
- **Eliminar respuestas** — Remueve todo tu historial de respuestas
- **Quitar likes** — Elimina likes masivamente desde tu pestaña de Me Gusta
- **Filtrar por palabras clave** — Solo elimina posts que contengan palabras específicas
- **Filtrar por rango de fechas** — Elimina posts de un período específico
- **Establecer un límite** — Controla cuántos posts eliminar por sesión
- **Modo Simulación (Dry Run)** — Previsualiza qué se eliminará antes de borrar nada (resaltado en verde)
- **Modo Eliminar Todo** — Salta los filtros y elimina todo
- **Sin claves API** — Funciona directamente a través del navegador
- **100% local** — Tus datos nunca salen de tu computadora

---

## 📦 Instalación

Esta extensión no está en la Chrome Web Store, así que necesitas instalarla manualmente usando el **Modo Desarrollador**.

### Paso 1: Descargar la Extensión

**Opción A — Clonar con Git:**
```bash
git clone https://github.com/canaldepancho-debug/bulk-delete-tweets.git
```

**Opción B — Descargar ZIP:**
1. Haz clic en el botón verde **"Code"** en la parte superior de esta página
2. Selecciona **"Download ZIP"**
3. Extrae el ZIP en una carpeta de tu computadora

### Paso 2: Abrir la Página de Extensiones de Chrome

1. Abre Google Chrome
2. Escribe `chrome://extensions` en la barra de direcciones y presiona Enter
3. Activa el **Modo Desarrollador** con el interruptor en la esquina superior derecha

### Paso 3: Cargar la Extensión

1. Haz clic en el botón **"Cargar descomprimida"** (arriba a la izquierda)
2. Navega hasta la carpeta donde descargaste/clonaste la extensión
3. Selecciona la carpeta y haz clic en **"Seleccionar carpeta"**

### Paso 4: Fijar la Extensión (Opcional)

1. Haz clic en el **ícono de pieza de puzzle** 🧩 en la barra de herramientas de Chrome
2. Busca **"X (Twitter) Post Cleaner"** en la lista
3. Haz clic en el **ícono de pin** 📌 para mantenerla visible

---

## 🚀 Cómo Usar

1. **Navega a tu perfil** en [x.com](https://x.com) (o twitter.com)
   - Para tweets: ve a tu página de perfil
   - Para likes: ve a tu perfil → pestaña **Me gusta**
2. **Haz clic en el ícono de la extensión** en la barra de herramientas de Chrome
3. **Configura tus opciones:**
   - Elige qué eliminar: Posts, Reposts, Respuestas o Me Gusta
   - Opcionalmente configura filtros por palabras clave, rangos de fecha o un límite de eliminación
4. **Activa o desactiva la Simulación:**
   - ✅ **Simulación ACTIVADA** (por defecto): Los posts se resaltarán en verde pero **no se eliminarán** — úsalo para previsualizar
   - ❌ **Simulación DESACTIVADA**: Los posts se eliminarán realmente. **¡Esto es irreversible!**
5. Haz clic en **"Iniciar Limpieza"**
6. La extensión se desplazará por tu timeline y procesará los posts automáticamente
7. Puedes hacer clic en **"Detener"** en cualquier momento para pausar

---

## ⚠️ Notas Importantes

- **Las eliminaciones son permanentes.** Una vez que un post es eliminado, no se puede recuperar. Siempre usa la Simulación primero.
- **Mantente en la pestaña de X.com** mientras la extensión esté ejecutándose. Cambiar de pestaña puede interrumpir el proceso.
- **Límites de velocidad:** X puede limitar temporalmente tus acciones si eliminas demasiados posts muy rápido. La extensión incluye retrasos aleatorios para minimizar esto.
- **Likes:** Para quitar likes, debes estar en la pestaña **Me gusta** de tu perfil (`x.com/usuario/likes`).

---

## 🌐 Soporte de Idiomas

La interfaz de la extensión está en **español**, pero funciona tanto en la versión en inglés como en español de X.com. La detección de posts (reposts, respuestas) es compatible con ambos idiomas.

---

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la [Licencia MIT](LICENSE).

---

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! No dudes en abrir un issue o enviar un pull request.

---

<p align="center">
  <b>Si esta herramienta te ayudó, ¡considera darle una ⭐ en GitHub!</b>
</p>
