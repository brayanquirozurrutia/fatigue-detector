# Fatigue Detector

## Descripción
Fatigue Detector es una aplicación web que utiliza inteligencia artificial para detectar somnolencia en el usuario a través de la cámara. Se basa en el uso de MediaPipe FaceMesh y TensorFlow.js para identificar los puntos faciales y determinar si los ojos están cerrados durante un período prolongado. La herramienta puede emitir una alerta sonora si detecta fatiga visual.

## Características
- **Detección en tiempo real:** Utiliza la cámara del dispositivo para detectar la cara y los ojos del usuario.
- **Detección de cierre de ojos:** Calcula el Eye Aspect Ratio (EAR) para determinar si los ojos están cerrados.
- **Alerta sonora:** Emite un sonido de advertencia cuando detecta somnolencia.
- **Superposición visual:** Dibuja puntos faciales detectados en un canvas superpuesto al video.

## Requisitos previos
Asegúrate de tener instalado lo siguiente:
- [Node.js](https://nodejs.org/) (v14 o superior)
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)

## Instalación
1. Clona este repositorio:
   ```bash
   git clone https://github.com/tu-usuario/fatigue-detector.git
   ```

2. Ve al directorio del proyecto:
   ```bash
   cd fatigue-detector
   ```

3. Instala las dependencias:
   ```bash
   npm install
   ```

   o si usas `yarn`:
   ```bash
   yarn install
   ```

## Uso
1. Inicia la aplicación:
   ```bash
   npm start
   ```

   o si usas `yarn`:
   ```bash
   yarn start
   ```

2. Abre tu navegador y accede a `http://localhost:3000`.

3. Otorga permiso para acceder a la cámara.

## Estructura del proyecto
- **`src/components/VideoFeed.jsx`**: Componente encargado de iniciar y mostrar el video de la cámara.
- **`src/components/FatigueDetector.jsx`**: Componente principal que realiza la detección de somnolencia y emite alertas.
- **`src/App.jsx`**: Punto de entrada principal de la aplicación.

## Tecnologías utilizadas
- **React.js**: Biblioteca para construir interfaces de usuario.
- **TensorFlow.js**: Biblioteca para realizar cálculos en el navegador y usar modelos de aprendizaje automático.
- **MediaPipe FaceMesh**: Modelo de detección de puntos faciales.
- **Tone.js**: Biblioteca para generar sonidos.

## Autor
Creado por [Brayan Nicolas Quiroz Urrutia](https://github.com/brayanquirozurrutia).

