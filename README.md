# sequelize-sortable
sequelize plugin to support sort query using scope.

## HowToUse

This module add a `sortable` scope to the target Sequelize Model class.

```javascript
const Sorter = require('sequelize-sortable');
const Project = require('./project.js');

Sorter.sortable(Project);

const params = {
  sort: "id,-name"
};

Project.scope({method: ["sortable", params]).findAll();
```
