# sequelize-sortable

[![CircleCI](https://circleci.com/gh/leonis/sequelize-sortable.svg?style=shield&circle-token=d135493bbd37dff56fb5c76141311158427bb580)](https://circleci.com/gh/leonis/sequelize-sortable)
[![Maintainability](https://api.codeclimate.com/v1/badges/dc7d1314d97f43eb4d78/maintainability)](https://codeclimate.com/github/leonis/sequelize-sortable/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/dc7d1314d97f43eb4d78/test_coverage)](https://codeclimate.com/github/leonis/sequelize-sortable/test_coverage)

`sequelize-sortable` is a Sequelize plugin to support simple sort query using scope.

# Usage

## Configuration

Just pass Sequelize model class to make the emodel class sortable.

```javascript
// Initialize
const Sorter = require('sequelize-sortable');

// Model definition
const Project = sequelize.define('project', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  name: {
    allowNull: false,
    type: Sequelize.STRING
  }
});

// CASE: Use just sortable method if accept all of attributes as sort key.
Sorter.sortable(Project);

// CASE: Use sortable method with options which has sortableKeys property if accept part of attributes as sort key.
// (ex: only "id", other keys are ignored.)
Sorter.sortable(Project, {sortableKeys: ["id"]})
```

## HowToUse

Use `sortable` scope on fetching the resources.

```javascript
const params = {sort: "id,-name"};

Project.scope({method: ["sortable", params]).findAll();
// => SELECT "id", "name" FROM "users" AS "user" ORDER BY "user"."id" ASC, "user"."name" DESC;
```

The value of the `sort` property is a comma separated string.
Each component of the comma separated string are `the model's properties` which may decorat with `+`/`-`.

# HowToDevelop

## Prepare

### Install packages

```
$ cd path/to/this/repo/root
$ npm install
```

### Define environment variables.

```
export TEST_DB=postgres://postgres:pass@127.0.0.1:5432/testdb
```

### Launch a database for test.

```
$ docker-compose up
```

### Test

Use tasks in package.json.

```
$ npm run ci
```
