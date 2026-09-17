# Encuesta de Automatización

Aplicación web sencilla para realizar la encuesta de detección de procesos manuales y oportunidades de automatización.

## Funciones

- 19 preguntas de la encuesta.
- Interfaz responsive para computadora y celular.
- Navegación pregunta por pregunta.
- Guarda las respuestas en `localStorage`.
- Consulta de encuestas guardadas.
- Eliminación individual.
- Exportación a CSV.
- No necesita servidor ni base de datos para funcionar.

## Uso

Abre `index.html` en el navegador.

También puedes publicarlo gratis con GitHub Pages.

## Publicarlo en GitHub Pages

1. Crea un repositorio en GitHub.
2. Sube `index.html`, `css/`, `js/` y `README.md`.
3. En el repositorio entra a **Settings → Pages**.
4. Selecciona la rama principal y la carpeta raíz.
5. Guarda y espera a que GitHub genere la página.

## Importante

Los datos se guardan solamente en el navegador/dispositivo mediante `localStorage`. Si borras los datos del navegador o cambias de dispositivo, no aparecerán allí. Usa **Exportar CSV** después de realizar las encuestas para conservar una copia.

Para una versión empresarial se puede agregar PostgreSQL/Supabase, login, dashboard, análisis automático con IA y sincronización en la nube.
