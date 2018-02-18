# sequelize-sortable

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

// CASE: Accept all of attributes as sort key.
Sorter.sortable(Project);

// CASE: Accept part of attributes as sort key.
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
Each components of the comma separated string are `the model's properties` which may decorated with `+`/`-`.

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
