var _ = require('underscore'),
  bag = require('bagofholding'),
  sandbox = require('sandboxed-module'),
  should = require('should'),
  checks, mocks,
  util;

describe('util', function () {

  function create(checks, mocks) {
    return sandbox.require('../lib/util', {
      requires: mocks ? mocks.requires : {},
      globals: {}
    });
  }

  beforeEach(function () {
    checks = {};
    mocks = {};

    checks.queue = [];
    util = new (create(checks, mocks))({}, checks.queue);
  });

  describe('util', function () {

    it('stat should be empty when no initial stat is specified', function () {
      _.keys(util.stat).length.should.equal(0);
    });

    it('queue should be empty when no initial queue is specified', function () {
      util.queue.length.should.equal(0);
    });

    it('stat should be initialised when specified', function () {
      util = new (create(checks, mocks))({ foo: 1000 });
      util.stat.foo.should.equal(1000);
    });

    it('queue should be initialised when specified', function () {
      util = new (create(checks, mocks))(null, [ { foo: 'bar' } ]);
      util.queue.length.should.equal(1);
      util.queue[0].foo.should.equal('bar');
    });
  });

  describe('increment', function () {

    it('should set stat to increment value when key does not exist', function () {
      util.increment('somekey', 1000);
      util.stat.somekey.should.equal(1000);
    });

    it('should increment stat by specified increment value when key already exists', function () {
      util.increment('somekey', 10);
      util.increment('somekey', 1000);
      util.stat.somekey.should.equal(1010);
    });
  });

  describe('count', function () {
    
    it('should set stat to 1 when key does not exist', function () {
      util.count('somekey');
      util.stat.somekey.should.equal(1);
    });

    it('should increment stat by 1 when key already exists', function () {
      util.count('somekey');
      util.count('somekey');
      util.stat.somekey.should.equal(2);
      util.count('somekey');
      util.stat.somekey.should.equal(3);
    });
  });

  describe('save', function () {

    it('should add save count when save is called', function () {
      util.save({});
      util.stat._couchtato_save.should.equal(1);
      util.save({});
      util.stat._couchtato_save.should.equal(2);
    });

    it('should queue doc when save is called', function () {
      util.save({ foo: 1000 });
      checks.queue.length.should.equal(1);
      checks.queue[0].foo.should.equal(1000);
      util.save({ bar: 2000 });
      checks.queue.length.should.equal(2);
      checks.queue[0].foo.should.equal(1000);
      checks.queue[1].bar.should.equal(2000);
    });
  });

  describe('remove', function () {

    it('should add remove count when remove is called', function () {
      util.remove({});
      util.stat._couchtato_remove.should.equal(1);
      util.remove({});
      util.stat._couchtato_remove.should.equal(2);
    });

    it('should queue doc when remove is called', function () {
      util.remove({ foo: 1000 });
      checks.queue.length.should.equal(1);
      checks.queue[0].foo.should.equal(1000);
      util.remove({ bar: 2000 });
      checks.queue.length.should.equal(2);
      checks.queue[0].foo.should.equal(1000);
      checks.queue[1].bar.should.equal(2000);
    });

    it('should mark queued doc as deleted when remove is called', function () {
      util.remove({});
      checks.queue.length.should.equal(1);
      checks.queue[0]._deleted.should.equal(true);
    });
  });

  describe('log', function () {
    // TODO
  });
});
 