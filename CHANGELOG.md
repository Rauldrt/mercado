# Bitácora de Cambios del Proyecto

Este archivo documenta los cambios más importantes realizados en la aplicación para facilitar el seguimiento y la depuración.

---

### **Semana del 22 de Julio de 2024**

**Restauración del Flujo de Autenticación (26/07/2024)**
- **Problema:** No se podían ver, agregar o editar productos, clientes y promociones.
- **Causa Raíz:** Se detectó que la página de inicio de sesión (`/login`) y el contexto de autenticación se habían eliminado accidentalmente en una corrección anterior, impidiendo que el administrador se autenticara y obtuviera los permisos necesarios para interactuar con la base de datos de Firebase.
- **Solución:**
    - Se restauró la página `/login` para permitir el inicio de sesión con Google.
    - Se verificó y restauró el `auth-context` para gestionar la sesión del usuario.
    - Se ajustó el encabezado para mostrar el botón de "Ingresar" solo a usuarios no autenticados, y el menú de administrador a los usuarios que sí lo están.

**Añadida Página de Prueba para Firebase (25/07/2024)**
- Se creó la página `/test-firebase` para diagnosticar de forma rápida y sencilla el estado de la conexión con la base de datos de Firestore.
- La página intenta leer la colección de productos y muestra un mensaje de éxito o de error.

**Reversión de Cambios y Corrección de Errores (25/07/2024)**
- **Reversión del nombre:** Se revirtió el nombre del proyecto de "Ndera-Store" a "Mercado Argentino Online" para asegurar la estabilidad, atendiendo a la preocupación de que el cambio pudiera haber afectado la conexión con Firebase.
- **Reversión del fix de Firestore:** Se deshizo el cambio en `src/lib/firebase.ts` que intentaba solucionar un error de "cliente offline", ya que estaba causando otros problemas.
- **Corrección de `module not found`:** Se recreó el archivo `src/contexts/auth-context.tsx` que se había eliminado por error, solucionando fallos de importación en varios componentes.
- **Corrección de error Cliente/Servidor:** Se añadió la directiva `"use client";` a `src/components/layout/footer.tsx` para solucionar el error `Attempted to call useAuth() from the server`.

**Cambio de Nombre del Proyecto (24/07/2024)**
- Se cambió el nombre del proyecto de "Mercado Argentino Online" a "Ndera-Store" a través de todos los archivos relevantes de la aplicación.
- *Nota: Este cambio fue revertido posteriormente.*
