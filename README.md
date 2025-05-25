# Proyecto RefriExpert

## Configuración e Integración de Servicios

Este documento describe cómo configurar e integrar los servicios principales del proyecto.

---

## 1. Variables de Entorno (`.env`)

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

EMAIL_USER=tu_correo@gmail.com 
EMAIL_PASS=tu_contraseña_o_app_password 
PORT=10000 
RECAPTCHA_SECRET=tu_clave_secreta_recaptcha 
ADMIN_PASSWORD=tu_contraseña_admin 
SESSION_SECRET=tu_clave_secreta_sesion


> **Nota:** No subas el archivo `.env` a ningún repositorio público.

---

## 2. Google reCAPTCHA

- **Registro:** Crea un proyecto en [Google reCAPTCHA](https://www.google.com/recaptcha/admin).
- **Obtén:** el `site key` (para el frontend) y el `secret key` (para el backend).
- **Configura:**  
  - Coloca el `site key` en el formulario de contacto:
    ```html
    <div class="g-recaptcha" data-sitekey="TU_SITE_KEY"></div>
    ```
  - Coloca el `secret key` en el archivo [.env](http://_vscodecontentref_/0) como `RECAPTCHA_SECRET`.
- **Verificación:** El backend valida el captcha usando la clave secreta antes de procesar el formulario.

---

## 3. Google Analytics

- **Registro:** Crea una propiedad en [Google Analytics](https://analytics.google.com/).
- **Obtén:** el ID de medición (por ejemplo, `G-XXXXXXXXXX`).
- **Agrega el script** en la cabecera de tus vistas (por ejemplo, en `template/cabecera.ejs`):

    ```html
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-XXXXXXXXXX');
    </script>
    ```

---

## 4. Notificación por Correo Electrónico

- **Servicio:** Se utiliza [Nodemailer](https://nodemailer.com/) para enviar correos.
- **Configura:**  
  - `EMAIL_USER` y `EMAIL_PASS` en el archivo [.env](http://_vscodecontentref_/1).
  - Si usas Gmail, utiliza una [App Password](https://myaccount.google.com/apppasswords).
- **Destinatarios:** El correo se envía a `programacion2ais@yopmail.com` y otros definidos en el controlador.
- **Contenido:** El correo incluye nombre, correo, comentario, IP, país, ciudad y fecha/hora de la solicitud.

---

## 5. Autenticación de Admin

- **Contraseña:** Define la contraseña de acceso en `ADMIN_PASSWORD` en el archivo [.env](http://_vscodecontentref_/2).
- **Sesión:** Define una clave secreta en `SESSION_SECRET`.
- **Acceso:** Al ingresar a `/admin`, se solicita la contraseña antes de mostrar el panel.
- **Cerrar sesión:** Hay un botón "Cerrar sesión" que elimina la autenticación y vuelve a pedir la contraseña.

---

## 6. Fake Payment API

- **Endpoint:** [https://fakepayment.onrender.com/pay](https://fakepayment.onrender.com/pay)
- **Integración:**  
  - El formulario de pagos envía los datos requeridos a la API.
  - Los campos enviados deben cumplir con el formato y nombres esperados por la API:
    - `amount` (string)
    - `card-number` (string, sin espacios)
    - `cvv` (string)
    - `expiration-month` (string, dos dígitos)
    - `expiration-year` (string, dos dígitos)
    - `full-name` (string)
    - `currency` (string)
    - `description` (string)
    - `reference` (string)
  - El monto puede ser fijo o dinámico según el servicio seleccionado.

---

## 7. Ejecución del Proyecto

1. Instala dependencias:
    ```bash
    npm install
    ```
2. Ejecuta el servidor:
    ```bash
    npm start
    ```
3. Accede a la aplicación en [http://localhost:10000](http://localhost:10000) (o el puerto configurado).

---

**Recuerda:**  
- Mantén tus claves y contraseñas seguras.
- No subas el archivo [.env](http://_vscodecontentref_/3) a repositorios públicos.