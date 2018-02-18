'use strict';

const co = require('co');
const chai = require('chai');
chai.use(require('chai-as-promised'));
const expect = chai.expect;

const Util = require('./support/util.js');
const Sorter = require('../index.js');
const User = Sorter.sortable(require('./support/model.js'));

const makeIds = (start, count) => {
  return Array.from(new Array(count)).map((_, i) => {
    return i + start;
  });
};

/* eslint-disable max-nested-callbacks */
describe('Sorter', () => {
  before(Util.init);
  after(Util.cleanup);

  describe('sortable', () => {
    it('should extend model', () => {
      expect(User.sortableKeys).to.eql(["id", "name"]);
      expect(User.options.scopes.sortable).to.not.eq(undefined);
    });
  });

  describe('sortable scope', () => {
    describe('without sort key', () => {
      it('should not throw error.', () => {
        return co(function * () {
          const userIds = yield User.scope({method: ['sortable', undefined]})
            .findAll()
            .then((users) => {
              return users.map((user) => user.get('id'));
            });

          expect(userIds).to.eql(makeIds(0, 100));
        });
      });
    });

    describe('with undefined value', () => {
      it('should not throw error.', () => {
        return co(function * () {
          const params = {sort: undefined};
          const userIds = yield User.scope({method: ['sortable', params]})
            .findAll()
            .then((users) => {
              return users.map((user) => user.get('id'));
            });

          expect(userIds).to.eql(makeIds(0, 100));
        });
      });
    });

    describe('with id', () => {
      it('should return sorted result', () => {
        return co(function * () {
          const params = {sort: "id"};
          const userIds = yield User.scope({method: ['sortable', params]})
            .findAll({limit: 1})
            .then((users) => {
              return users.map((user) => user.get('id'));
            });

          expect(userIds[0]).to.eq(0);
        });
      });
    });

    describe('with +id', () => {
      it('should return sorted result', () => {
        return co(function * () {
          const params = {sort: "+id"};
          const userIds = yield User.scope({method: ["sortable", params]})
            .findAll({limit: 1})
            .then((users) => {
              return users.map((user) => user.get("id"));
            });

          expect(userIds[0]).to.eq(0);
        });
      });
    });

    describe('with -id', () => {
      it('should return sorted result', () => {
        return co(function * () {
          const params = {sort: "-id"};
          const userIds = yield User.scope({method: ['sortable', params]})
            .findAll({limit: 1})
            .then((users) => {
              return users.map((user) => user.get("id"));
            });

          expect(userIds[0]).to.eq(99);
        });
      });
    });

    describe('with multi keys', () => {
      it('should return sorted result', () => {
        return co(function * () {
          const params = {sort: "name,+id"};
          const users = yield User.scope({method: ['sortable', params]})
            .findAll();

          expect(users[0].toJSON()).to.eql({id: 0, name: "name-0"});
          expect(users[1].toJSON()).to.eql({id: 10, name: "name-0"});
        });
      });
    });

    describe('with non-attribute key', () => {
      it('should return result (sort keys will be ignored)', () => {
        return co(function * () {
          const params = {sort: "non-attr-key"};
          const userIds = yield User.scope({method: ['sortable', params]})
            .findAll()
            .then((users) => {
              return users.map((user) => user.get("id"));
            });

          // default sort order (dependent on database...)
          expect(userIds).to.eql(makeIds(0, 100));
        });
      });
    });

    describe('with unsupported direction symbol', () => {
      it('should return result (sort keys will be ignored)', () => {
        return co(function * () {
          const params = {sort: "^id"};
          const userIds = yield User.scope({method: ['sortable', params]})
            .findAll()
            .then((users) => {
              return users.map((user) => user.get("id"));
            });

          // default sort order (dependent on database...)
          expect(userIds).to.eql(makeIds(0, 100));
        });
      });
    });
  });
});
/* eslint-enable max-nested-callbacks */
