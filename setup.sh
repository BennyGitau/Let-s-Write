#!/bin/bash

# Step 1: Install backend dependencies and set up the virtual environment
pipenv install
pipenv shell

# Step 2: Navigate into the server directory and run the backend
cd server
python seed.py &
python app.py &

# Step 3: In another terminal, install frontend dependencies and run the frontend
cd ..
npm install --prefix client
npm start --prefix client
