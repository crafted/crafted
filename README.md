Crafted
===

This repository is an Angular monorepo consisting of the following projects:

- **data** - A library package that makes it simple to configure and perform filtering, sorting, grouping, and viewing of data.
- **components** - A library package made up of Angular components used to manipulate and view data.
- **github-dashboard** - An Angular application that downloads GitHub data to the browser to perform quick exploration over issues and pull requests. 
- **docs** - An Angular application that showcases the use of the `data` and `components` library.


## Getting Started

Run the following commands to run the GitHub applications:
1. `npm i` or `yarn` (downloads dependencies)
2. `npm run build-all` (builds libraries)
3. `ng serve` (starts GitHub Dashboard app)

If you want to start the docs app, you can run `ng serve docs`.
