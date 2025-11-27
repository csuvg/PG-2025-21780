# Estimación de tiempos de llegada de Transmetro mediante modelos de aprendizaje automático y visualización interactiva

En este repositorio puede encontrarse el preprocesamiento de datos, el entrenamiento de modelos de aprendizaje automático, el backend y el frontend realizados para implementar un sistema de estimación de tiempos de llegada de las unidades de Transmetro a las estaciones en la ciudad de Guatemala.

## 📝 Descripción

Este proyecto implementa un sistema completo para predecir **tiempos estimados de llegada (ETA)** de las unidades del sistema **Transmetro** utilizando **modelos de aprendizaje automático**, un **backend** que expone endpoints para interactuar con dichos modelos y un **frontend** interactivo para el consumo de datos. Incluye:

 - **Scripts** de recolección, preprocesamiento y limpieza de datos históricos de posición de las unidades de Transmetro; ingeniería de características y generación de datasets.
 - **Modelos de ML** entrenados con los datos preprocesados mencionados anteriormente.
 - **Backend en FastAPI** que expone endpoints para predicción de ETA y duración de viajes entre estaciones de una misma línea.
 - **Frontend en React + Vite** que permite la visualización dinámica de las predicciones.

## 🛠️ Tecnologías utilizadas

**Recolección de datos**
- [![Python][Python]][Python-url]
- [![Selenium][Selenium]][Selenium-url]
- [![Chromedriver][Chromedriver]][Chromedriver-url]

**Preprocesamiento de datos**
- [![Numpy][Numpy]][Numpy-url]
- [![Pandas][Pandas]][Pandas-url]
- [![Scikit][Scikit]][Scikit-url]
- [![Folium][Folium]][Folium-url]
- PyArrow (Parquet)

**Machine Learning**
- LightGBM
- XGBoost

**Backend (API)**
- [![FastAPI][FastAPI]][FastAPI-url]
- Uvicorn
- Pydantic

**Frontend**
- [![React][React.js]][React-url]
- [![Vite][Vite]][Vite-url]
- [![MUI][MUI]][MUI-url]
- [![Maps][Maps]][Maps-url]
- [![GSAP][GSAP]][GSAP-url]

**Otras utilidades**
- Git
- PowerShell / Bash

## 📦 Requisitos previos

- **Sistema operativo**: Windows, macOS o Linux
- **Python**: 3.11+ (recomendado). El backend usa dependencias listadas en `src/backend/api/requirements.txt`.
- **Node.js**: 18+ (LTS recomendado) y `npm` (se usa para el frontend en `src/frontend`).
- **Git**: Para clonar el repositorio.

## ⚙️ Instalación (Backend y frontend)

Clonar el repositorio:

```bash
git clone https://github.com/csuvg/PG-2025-21780.git
cd PG-2025-21780
```

Backend (API)

```powershell
# Crear y activar un entorno virtual (PowerShell)
cd src/backend/api/
python -m venv .venv
.\.venv\Scripts\Activate
```

```bash
# Crear y activar un entorno virtual (Bash)
cd src/backend/api/
python -m venv .venv
source .venv/bin/activate
```

```bash
# Instalar dependencias del backend una vez creado y activado el entorno virtual
pip install --upgrade pip
pip install -r requirements.txt
```

Notas:

- Si no es posible ejecutar `Activate.ps1` por política de ejecución, utilizar `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force` antes de activar.
- Las dependencias exactas están en `src/backend/api/requirements.txt`.

Frontend (cliente React + Vite)

```bash
cd src/frontend
npm install
```

También es posible utilizar los gestores de paquetes `pnpm` y `yarn` en lugar de `npm`.

## ▶️ Ejecución del proyecto

**Configurar modelos(s) a utilizar por el backend**

Se debe indicar el *Path* absoluto del modelo a utilizar para relizar las predicciones
en `src/backend/api/models.py`:

```bash
MODEL_PATH = <PATH_ABSOLUTO_DE_MODELO_SELECCIONADO>
```

Los modelos se encuentran en `src/backend/models/` y puede elegirse entre modelos LightGBM y XGBoost.


**Configurar variables de entorno del frontend (opcional, pero recomendado)**

Crear un archivo .env en `src/frontend/` con la variable de entorno `VITE_GOOGLE_MAPS_API_KEY`, tal como se muestra
en el archivo de ejemplo .env.example:

```bash
VITE_GOOGLE_MAPS_API_KEY = <API_KEY_VÁLIDA_DE_GOOGLE_MAPS>
```

Esto permite visualizar la posición de la mejor unidad candidata en un mapa de Google Maps. No es necesaria para mostrar las predicciones, pero se recomienda para una mejor experiencia de usuario.

**Iniciar el backend**

```bash
cd src/backend/api
python -m uvicorn main:app --reload --port 8000
```

El servidor FastAPI quedará escuchando en `http://localhost:8000`. La documentación automática estará en `http://localhost:8000/docs`.

**Iniciar el frontend**

```powershell
cd src\frontend
npm run dev
```

Por defecto Vite sirve el frontend en `http://localhost:5173`.

**Ejemplos de uso (API)**

Ejemplo en bash con `curl` para solicitar ETA a una estación:

```bash
curl -X POST "http://127.0.0.1:8000/eta" -H "Content-Type: application/json" -d '{"target_line":"Linea_12","target_station":"MONTE MARÍA","target_direction":"IDA"}'
```

Ejemplo en PowerShell con `Invoke-RestMethod` para solicitar ETA a una estación:

```powershell
$body = @{ target_line = 'Linea_12'; target_station = 'MONTE MARÍA'; target_direction = 'IDA' } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri http://127.0.0.1:8000/eta -Body $body -ContentType 'application/json'
```

Endpoints:

- `POST /eta` : predicción ETA para una estación (modelo de request: `PredictRequest`)
- `POST /trip` : predicción de duración entre estaciones (modelo de request: `TripRequest`)
- `GET /stations` : listado de estaciones
- `GET /stations/:id` : información de la estación con el ID indicado
- `GET /stations/line/:lineName` : Listado de estaciones de la línea indicada
- `GET /lines` : listado de líneas

## ▶️ Ejecución del pipeline de recolección, preprocesamiento y entrenamiento (opcional)

En caso de desear replicar el proceso de recolección de datos, preprocesamiento de datos y entrenamiento de modelos, el proceso a seguir sería el siguiente:

1. Recolectar los datos de posición GPS con `src/backend/data_collection/data_collector.py` y unificar todos los informes de cada unidad con `src/backend/data_collection/data_joining.ipynb`

2. Conservar únicamente las trayectorias útiles de estos datos con `src/backend/data_preprocessing/data_cleaning.py`

3. Inferir la línea de cada trayectoria útil con `src/backend/data_preprocessing/fe_line_adhesion.py`.

4. Inferir la próxima estación teórica de cada punto con `src/backend/data_preprocessing/fe_next_station.py`

5. Calcular la variable objetivo con `src/backend/data_preprocessing/target_variable_ETA.py`

6. Construir los datasets compactos con `src/backend/data_preprocessing/build_compact_datasets.py` y obtener las características causales con `src/backend/data_preprocessing/build_parquet_features.py`

7. Obtener una muestra representativa por línea de los datos con `src/backend/models/sampling.ipynb`

8. Entrenar los modelos XGBoost y LightGBM con dicha muestra en `src/backend/models/xgboost_training.ipynb` y `src/backend/models/lightgbm_training.ipynb`

## 📁 Estructura del proyecto

- `src/backend/data_collection` → Scripts para la recolección de datos de posición GPS de las unidades de Transmetro
- `src/backend/preprocessing` → Scripts para el preprocesamiento de dichos datos
- `src/backend/models` → Modelos entrenados
- `src/backend/api/` → API FastAPI
- `src/backend/api/requirements.txt` → Dependencias Python
- `src/frontend/` → Interfaz React + Vite

## 🏗️ Arquitectura del sistema

El sistema está compuesto por un pipeline completo de datos, un backend de predicción y un frontend interactivo, organizados bajo una arquitectura modular y desacoplada.

A continuación se presenta el diagrama general:

                        ┌──────────────────────────┐
                        │    Fuentes de Datos      │
                        │  (Logs GPS históricos)   │
                        └───────────┬──────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │   Módulo de Procesamiento     │
                    │  (Limpieza, Feature Eng., ML) │
                    │       Python / Notebooks      │
                    └──────────────┬────────────────┘
                                   │  
                                   │    Modelos entrenados
                                   ▼
                ┌───────────────────────────────────────────┐
                │               Backend API                 │
                │              (FastAPI, ML)                │
                │   - Carga de modelos LightGBM o XGBoost   │
                │   - Endpoints /eta, /trip, /stations...   │
                └──────────────────┬────────────────────────┘
                                   │
                                   │    JSON/REST
                                   ▼
                       ┌──────────────────────────┐
                       │        Frontend          │
                       │  React + Vite + MUI      │
                       │  - ETA de las unidades   │
                       │  - Duración de viajes    │
                       │  - Mapa/visualizaciones  │
                       └────────────┬─────────────┘
                                    │
                                    ▼ 
                          ┌───────────────────┐
                          │   Usuario final   │
                          │ (desktop / mobile)│
                          └───────────────────┘


## 🎥 Demo

El video demostrativo del proyecto se encuentra en:

```bash
/demo/demo.mp4
```

## 📄 Documentación

El informe final está disponible en:

```bash
/docs/informe_final.pdf
```

**Notas y recomendaciones**

- Asegurarse de utilizar versiones compatibles de Python y Node.js (Python 3.11+, Node 18+).
- Para producción, se recomienda empaquetar el backend con un servidor ASGI robusto (ej. usar Uvicorn + Gunicorn en Linux), construir el frontend (`npm run build`) y servir los estáticos desde un servidor web o CDN.

## Autor
**Pablo Andrés Zamora Vásquez**</br>
Carné 21780</br>
Universidad del Valle de Guatemala

[![Static Badge](https://img.shields.io/badge/github-pabloozamora-blue?logo=github)](https://github.com/pabloozamora)

<!-- Imágenes y links -->
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[FastAPI]: https://img.shields.io/badge/FastAPI-20232A?style=for-the-badge&logo=fastapi&logoColor=009688
[FastAPI-url]: https://fastapi.tiangolo.com/
[Vite]: https://img.shields.io/badge/Vite-20232A?style=for-the-badge&logo=vite&logoColor=646CFF
[Vite-url]: https://vite.dev/
[MUI]: https://img.shields.io/badge/MaterialUI-20232A?style=for-the-badge&logo=mui&logoColor=007FFF
[MUI-url]: https://mui.com/material-ui/
[Maps]: https://img.shields.io/badge/GoogleMapsAPI-20232A?style=for-the-badge&logo=googlemaps&logoColor=4285F4
[Maps-url]: https://developers.google.com/maps
[GSAP]: https://img.shields.io/badge/GSAP-20232A?style=for-the-badge&logo=gsap&logoColor=0AE448
[GSAP-url]: https://gsap.com/
[Selenium]: https://img.shields.io/badge/Selenium-20232A?style=for-the-badge&logo=selenium&logoColor=43B02A
[Selenium-url]: https://www.selenium.dev/
[Chromedriver]: https://img.shields.io/badge/Chromedriver-20232A?style=for-the-badge&logo=googlechrome&logoColor=4285F4
[Chromedriver-url]: https://developer.chrome.com/docs/chromedriver/downloads
[Python]: https://img.shields.io/badge/Python-20232A?style=for-the-badge&logo=python&logoColor=3776AB
[Python-url]: https://www.python.org/
[Numpy]: https://img.shields.io/badge/Numpy-20232A?style=for-the-badge&logo=numpy&logoColor=013243
[Numpy-url]: https://numpy.org/
[Pandas]: https://img.shields.io/badge/Pandas-20232A?style=for-the-badge&logo=pandas&logoColor=150458
[Pandas-url]: https://pandas.pydata.org/
[Scikit]: https://img.shields.io/badge/Scikit-20232A?style=for-the-badge&logo=scikitlearn&logoColor=F7931E
[Scikit-url]: https://scikit-learn.org/
[Folium]: https://img.shields.io/badge/Folium-20232A?style=for-the-badge&logo=folium&logoColor=77B829
[Folium-url]: https://python-visualization.github.io/folium/latest/