# Melissa — Coach

A private, single-user fitness and nutrition Progressive Web App. Plain
HTML/CSS/vanilla JavaScript — no build step, no server, no accounts. All of the
user's data stays on their own device (browser local storage); nothing is sent
anywhere.

> Educational and supportive — **not medical advice.**

## Features
- Personalized, phased training plan with exercise form cues + demo links
- A meals-first nutrition planner: add your own meals (ingredients + steps),
  see how they fit your targets, auto-plan the week, and get a shopping list
- Quick daily / weekly check-ins and simple trend charts
- One-tap data backup/restore (your data never leaves your device otherwise)

## Run locally
It uses ES modules + a service worker, so serve it over http (not `file://`):
```
python -m http.server 8080
```
Then open `http://localhost:8080`.

## Install on a phone
Open the site in Safari (iOS) or Chrome (Android) → **Add to Home Screen**. It
then runs full-screen like a native app and works offline.

## Project layout
```
index.html  manifest.webmanifest  sw.js
css/        design system
js/
  app.js store.js state.js util.js ui.js export.js
  data/    exercises, program, meals, questions, copy
  engine/  signals + deterministic training/nutrition rules
  views/   onboarding, today, train, eat, log, progress
icons/      app icons
```
