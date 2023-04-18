![badge](https://img.shields.io/github/watchers/wdpedroborges/brasil-quiz?style=social)
![badge](https://img.shields.io/github/stars/wdpedroborges/brasil-quiz?style=social)
![badge](https://img.shields.io/github/license/wdpedroborges/brasil-quiz)
![badge](https://img.shields.io/badge/powered%20by-vite-blue)
![badge](https://img.shields.io/badge/powered%20by-react.js-blue)
![badge](https://img.shields.io/badge/powered%20by-typescript-blue)
![badge](https://img.shields.io/badge/powered%20by-sass.js-blue)

# Brasil Quiz
## A quiz based in the model Better Quiz

The quiz app made in React.js and Typescript offers an exciting way to learn more about Brazil. The app focuses on various aspects of Brazil, including its geography, history, and culture. The app uses maps of the Brazilian states, coats of arms and even the hymns to quiz users on their knowledge of Brazil.

## Live Demo

wdpedroborges.github.io/brasil-quiz

## Features

- Filter questions by categories
- Suggestions
- Configurable timer
- Points counting
- Performance calculation
- Record storage in Local Storage
- Processes text, images, and audio

## Tech

- Vite
- React.js
- Typescript
- Sass

## Installation

Clone the repository:

```bash
git clone https://github.com/wdpedroborges/brasil-quiz
```

For production:

```sh
cd brasil-quiz
npm install
npm run dev
```

Debug in Typescript:

```bash
tsc --noEmit --watch
```

Build:

```bash
npm run build
```

## Deploy

- Add to vite.config.js:

```bash
base: "/<repo>/"
```

- Then:

```bash
npm install gh-pages --save-dev
```

- Add to package.json

```bash
 "homepage": "https://<username>.github.io/<repo>/",
  ...
  "scripts": {
...
"build": "vite build",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist",
...
```

## License

This project is licensed under the MIT License. Please see the LICENSE file for more details.