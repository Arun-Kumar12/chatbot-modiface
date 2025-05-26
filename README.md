# ModiFace ChefBot

A cooking assistant chatbot built with FastAPI, React, Docker Compose, and Ollama.

## Prerequisites

1. **Ollama**  
  Make sure Ollama is installed and running locally. If you don’t have it yet, follow the install instructions here:  
  https://ollama.com/docs/installation

2. **Start the Ollama daemon**  
  In a separate terminal window, run:
  `ollama serve`

3. **Pull the model**
  `ollama pull phi3:mini`
  
4. **Building & Running with Docker**
  Ensure you have Node.js installed.
  From the project root, install frontend dependencies:
    `cd frontend`
    `npm install`
    `cd ..`
  Build the Docker images:
    `docker compose build`

5. **Start the services**
  `docker-compose up`

6. **Access the apps**
  Backend (FastAPI) - http://localhost:8000
  Frontend (React) - http://localhost:3000

7. **Stop & clean up**
docker-compose down
