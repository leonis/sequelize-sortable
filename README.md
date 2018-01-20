# sequelize-sortable
sequelize plugin to support sort query using scope.

## HowToUse

This module add a `sortable` scope to the target Sequelize Model class.

```javascript
// Initialize
const Sorter = require('sequelize-sortable');
const Project = require('./project.js');

// CASE: Accept all of attributes as sort key.
Sorter.sortable(Project);

// CASE: Accept part of attributes as sort key.
// (ex: only "id", other keys are ignored.)
Sorter.sortable(Project, {sortableKeys: ["id"]})

const params = {
  sort: "id,-name"
};

Project.scope({method: ["sortable", params]).findAll();
// => SELECT "id", "name" FROM "users" AS "user" ORDER BY "user"."id" ASC, "user"."name" DESC;
```
