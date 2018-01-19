'use strict';

const parseDirection = (str) => {
  if (str.length === 0 || str === '+') {
    return "ASC";
  } else if (str === '-') {
    return "DESC";
  }

  throw new Error(`Unsupported Order Direction: ${str}`);
}

const ComponentPattern = /^([\+|\-]?)(\w+)/;
const parseOrderComponent = (str) => {
  const matches = str.match(ComponentPattern);
  if (matches === null) {
    throw new Error(`Invalid format: ${str}`);
  }

  const direction = parseDirection(matches[1]);
  const key = matches[2].toLowerCase();

  return {key, direction};
};

const parseOrder = (sortValue, sortableKeys) => {
  return sortValue.split(',').map((component) => {
    const parsed = parseOrderComponent(component);

    if (sortableKeys.indexOf(parsed.key) === -1) {
      throw new Error(`Invalid attribute name: ${parsed.key}`);
    }

    return [parsed.key, parsed.direction];
  });
};

const selectSortableKeys = (cls, acceptableKeys) => {
  const attrs = Object.keys(cls.attributes);

  if (acceptableKeys && Array.isArray(acceptableKeys)) {
    for (const i =0; i < acceptableKeys.length; i++) {
      const key = acceptableKeys[i].toLowerCase();

      if (attrs.indexOf(key) === -1) {
        throw new Error(`The key is not included in the model: ${key}`);
      }
    }

    return acceptableKeys;
  }

  return cls.sortableKeys;
};

const sortable = (cls, options) => {
  /**
   * Sortable keys (whilte list)
   */
  cls.sortableKeys = Object.keys(cls.attributes);

  /**
   * sortable Scope
   *
   * @param {Object} params - query params
   * @param {string} params.sort - sort string.
   * @param {Array<string>|undefined} acceptableKeys - Acceptable sort keys. (accept all attrs in this Model if undefined.)
   */
  cls.addScope('sortable', function(params, acceptableKeys) {
    if (!params.sort || params.sort.length === 0) {
      return {};
    }

    const keys = selectSortableKeys(cls, acceptableKeys);

    return {
      order: parseOrder(params.sort, keys);
    }
  }, {override: true});

  return cls;
}

module.exports = sortable;
