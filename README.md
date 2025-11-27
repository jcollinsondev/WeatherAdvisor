# WeatherAdvisor

WeatherAdvisor is a weather advisory system powered by a Large Language Model (LLM) service. It provides weather insights and recommendations through an intelligent backend built with Deno, a PostgreSQL database, and a static HTML interface. The LLM integration is handled via the Ollama service running within the Docker environment.

### Built With

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)](#)
[![Deno](https://img.shields.io/badge/Deno-000?logo=deno&logoColor=fff)](#)
[![Postgres](https://img.shields.io/badge/Postgres-%23316192.svg?logo=postgresql&logoColor=white)](#)
[![HTML](https://img.shields.io/badge/HTML-%23E34F26.svg?logo=html5&logoColor=white)](#)
[![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=fff)](#)
[![Ollama](https://img.shields.io/badge/Ollama-fff?logo=ollama&logoColor=000)](#)
[![nginx](https://img.shields.io/badge/nginx-009639?logo=nginx&logoColor=fff)](#)

## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

Before running the application, ensure the following are installed on your system:
* Docker (which includes Docker Compose)
* Git

### Installation

Clone the repository
```sh
git clone https://github.com/jcollinsondev/WeatherAdvisor.git
```
Navigate into the project directory
```sh
cd WeatherAdvisor
```
Start all services using Docker Compose
```sh
docker compose up
```
Pull the Ollama model (0.7GB)
```sh
docker exec -it ollama ollama pull tinyllama
```

## Usage

Once the application is running, open the web interface in your browser at http://localhost:8080.

1. Enter a location in the search bar.

1. Select a timeframe from the available options: Today, This Week or This Weekend

1. Ask a question related to the weather conditions for the selected location and timeframe.

1. The system will process your query through the integrated Large Language Model (LLM) and return a response containing weather insights and recommendations.

### Shutdown

To stop the running containers, use
```sh
docker compose down
```