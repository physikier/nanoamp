# Nanoamp

Nanoamp (which stand for ...) is a projects, that ...


## Table of Contents

- [Installation](#installation)
  - [Backend](#backend-installation)
  - [Frontend](#frontend-installation)
- [Folder Structure](#folder-structure)
  - [Backend](#backend-structure)
  - [Frontend](#frontend-structure)
- [Supported Browsers](#supported-browsers)

## Installation

The nanoamp application is a web app consisting of a flask backend and a react frontend. That's why you have to install both applications separately.

### Backend Installation

The backend is written in python (version 3.6) and is a flask application. The communication to the frontend is mainly done via sockets.

First change into the backend folder with `cd backend`.

We're using [Pipenv](https://docs.pipenv.org/) as a package manager. So you just have to run `pipenv install` to install all required packages.

To start the application you first have to activate your virtual environment with `pipenv shell` and then call

    ./nanoamp_web.py

to start the nanoamp web app in the normal mode (connected to the Arduino boards) or

    ./nanoamp_web.py --mock

to start the nanoamp web app with mocked Arduino boards.

### Frontend Installation

The frontend is written in javascript (>= es6) and is a react application. The communication to the backend is mainly done via sockets.

First change into the frontend folder with `cd frontend`.

Call `npm install` or `yarn install` to install all required packages.

After the installation you can start the frontend with `npm start` or `yarn start`.

## Folder Structure

### Backend Structure

### Frontend Structure

## Supported browsers
