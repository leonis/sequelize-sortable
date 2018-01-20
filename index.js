'use strict';

/**
 * Translate direction string to SQL keyword.
 *
 * @param {string} str - target string.
 * @return {string} "ASC" or "DESC"
 * @throws Error if the target string is not supported.
 */
const translateDirection = (str) => {
  if (str.length === 0 || str === '+') {
    return "ASC";
  } else if (str === '-') {
    return "DESC";
  }

  throw new Error(`Unsupported Order Direction: ${str}`);
};

const ComponentPattern = /^([+|-]?)(\w+)/;
/**
 * Parse order component.
 *
 * "order component" is the parts of sort string,
 * such like "propA", "+propB", "-propC"
 *
 * @param {string} str - order component string.
 * @return {Object} parsed result.
 */
const parseOrderComponent = (str) => {
  const matches = str.match(ComponentPattern);
  if (matches === null) {
    throw new Error(`Invalid format: ${str}`);
  }

  const direction = translateDirection(matches[1]);
  const key = matches[2].toLowerCase();

  return {key, direction};
};

/**
 * Parse order string
 *
 * This function parse the sort order string (ex: "propA,-propB,+propC")
 * to sort order object for sequelize.
 * (ex: [ ["propA", "ASC"], ["propB", "DESC"], ["propC", "ASC"] ])
 *
 * @param {string} sortValue - sort order string (ex: "propA,-propB,+propC")
 * @param {Array<string>} sortableKeys - acceptable sort keys.
 * @return {Array<Array<string>>} parsed result.
 */
const parseOrder = (sortValue, sortableKeys) => {
  return sortValue.split(',').map((component) => {
    try {
      const parsed = parseOrderComponent(component);
      if (sortableKeys.indexOf(parsed.key) === -1) {
        // Ignore the order component.
        return [];
      }

      return [parsed.key, parsed.direction];
    } catch (err) {
      return [];
    }
  }).filter((v) => (v.length !== 0));
};

/**
 * Select sortableKeys
 *
 * @param {Sequelize.Model} cls - subclass of Sequelize.Model.
 * @param {Array<string>|undefined} acceptableKeys - acceptable attribute names.
 * @return {Array<string>} attribute names which can use to sort order keys.
 */
const selectSortableKeys = (cls, acceptableKeys) => {
  const attrs = Object.keys(cls.attributes);

  if (acceptableKeys && Array.isArray(acceptableKeys)) {
    return acceptableKeys.filter((key) => {
      return (attrs.indexOf(key) === -1);
    });
  }

  return cls.sortableKeys;
};

const Sorter = {
  sortable: (cls, options) => {
    /**
     * Sortable keys (whilte list)
     */
    cls.sortableKeys = Object.keys(cls.attributes);

    /**
     * sortable Scope
     *
     * ```
     * // NOTE: users table has "propA", "propB", "propC" columns.
     *
     * try {
     *   const params = {sort: "propA,+propB,-propC"};
     *
     *   // If accept all keys as sort column.
     *   User.scope({method: ["sortable", params]}).findAll();
     *
     *   // If you want to filter the sort keys.
     *   User.scope({method: ["sortable", params, ["propA"]]}).findAll();
     * } catch (err) {
     *   // when the params.sort is invalid sort order vaule.
     *   throw err;
     * }
     * ```
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
      if (keys.length === 0) {
        return {};
      }

      return {
        order: parseOrder(params.sort, keys)
      };
    }, {override: true});

    return cls;
  }
};

module.exports = Sorter;
