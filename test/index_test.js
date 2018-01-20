'use strict';

const co = require('co');
const chai = require('chai');
chai.use(require('chai-as-promised'));
const expect = chai.expect;

const Util = require('./support/util.js');
const Sorter = require('../index.js');
console.log(Sorter);
const User = Sorter.sortable(require('./support/model.js'));

const makeIds = (start, count) => {
  return Array.rom(new Array(count)).map((_, i) => {
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
    describe('with undefined', () => {
      it('should not throw error.', () => {
        co(function * () {
          const params = {sort: undefined};
          const userIds = yield User.scope({method: ['sortable', params]})
            .findAll()
            .then((users) => {
              return users.map((user) => user.get('id'));
            });

          expect(userIds).to.eql(makeIds(1, 100));
        });
      });
    });

    describe('with id', () => {
      it('should return sorted result', () => {
        co(function * () {
          const params = {sort: "id"};
          const userIds = yield User.scope({method: ['sortable', params]})
            .findAll({limit: 1})
            .then((users) => {
              return users.map((user) => user.get('id'));
            });

          expect(userIds[0]).to.eq(1);
        });
      });
    });

    describe('with +id', () => {
      it('should return sorted result', () => {
        co(function * () {
          const params = {sort: "+id"};
          const userIds = yield User.scope({method: ["sortable", params]})
            .findAll({limit: 1})
            .then((users) => {
              return users.map((user) => user.get("id"));
            });

          expect(userIds[0]).to.eq(1);
        });
      });
    });

    describe('with -id', () => {
      it('should return sorted result', () => {
        co(function * () {
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
        co(function * () {
          const params = {sort: "name,+id"};
          const users = yield User.scope({method: ['sortable', params]})
            .findAll();

          expect(users[0].toJSON()).to.eql({id: 9, name: "name-9"});
          expect(users[1].toJSON()).to.eql({id: 19, name: "name-9"});
        });
      });
    });

    describe('with non-attribute key', () => {
      it('should return result (sort keys will be ignored)', () => {
        co(function * () {
          const params = {sort: "non-attr-key"};
          const userIds = yield User.scope({method: ['sortable', params]})
            .findAll()
            .then((users) => {
              return users.map((user) => user.get("id"));
            });

          // default sort order (dependent on database...)
          expect(userIds).to.eql(makeIds(1, 100));
        });
      });
    });

    describe('with unsupported direction symbol', () => {
      it('should return result (sort keys will be ignored)', () => {
        co(function * () {
          const params = {sort: "^id"};
          const userIds = yield User.scope({method: ['sortable', params]})
            .findAll()
            .then((users) => {
              return users.map((user) => user.get("id"));
            });

          // default sort order (dependent on database...)
          expect(userIds).to.eql(makeIds(1, 100));
        });
      });
    });
  });
});
/* eslint-enable max-nested-callbacks */
