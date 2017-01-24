var test = require('tape')
var tasking = require('./')
var create = tasking.create
var add = tasking.add
var run = tasking.run

test('create', function (t) {
  t.plan(2)

  var system = tasking('testing')
  t.is(system.name, 'testing', 'using tasking')

  var system2 = create('testing')
  t.is(system2.name, 'testing', 'using tasking.create')
})

test('add', function (t) {
  t.plan(3)

  var system = tasking('testing')

  add(system, 'foo', function () { })
  add(system, 'bar', ['foo'], function () {})
  add(system, 'qux', ['foo', 'bar'])

  t.true(!system.tasks.foo.deps && system.tasks.foo.fn, 'task with no deps and function')
  t.true(system.tasks.bar.deps.length && system.tasks.bar.fn, 'task with deps and function')
  t.true(system.tasks.qux.deps.length && !system.tasks.qux.fn, 'task with deps and no function')
})

test('run', function (t) {
  t.plan(8)

  var system = tasking('testing')

  add(system, 'foo', function () {
    t.true(true, 'runs foo sync')
  })

  add(system, 'bar', function (done) {
    setTimeout(function () {
      t.true(true, 'runs async')
      done()
    }, 250)
  })

  add(system, 'baz', function () {
    t.true(true, 'runs dependency task')
  })

  add(system, 'qux', ['baz'], function () {
    t.true(true, 'runs task with dependency')
  })

  add(system, 'human', function () { t.true(true, 'runs as dep-only task 1') })
  add(system, 'horse', function () { t.true(true, 'runs as dep-only task 2') })
  add(system, 'centaur', ['human', 'horse'])

  run(system, 'foo', function (err) {
    t.false(err, 'finishes single task')
  })

  run(system, ['bar', 'qux', 'centaur'], function (err) {
    t.false(err, 'finishes multiple tasks')
  })
})
