# tasking

> Tiny tasking system

```js
var { create, add, run } = require('tasking')

// Create a task system:
var task = create('my-example')

// Add a sync task:
add(task, 'foo', function () {
  // ...
})

// Add an async task:
add(task, 'bar', ['foo'], function (done) {
  something(function (err) {
    if (err) return done(err)
    // ...
    done()
  })
})

// Run tasks:
run(task, 'bar', function (err) {
  if (err) throw err
  // ...
})
```

Tiny tasking system based on three simple functions: `create`, `add`, and `run`.

## Installation

```sh
$ npm install --save tasking
```

## Usage

### `tasking(name)`
### `tasking.create(name)`

Create a task system where tasks and other meta info is stored.  `tasking.create` alias useful when destructuring

 - `name` (`String`): Name of the system.

```js
var task = tasking('my-build')
// Or:
var task = tasking.create('my-build')
```

**Note:** It is nice to name it `task` when used with `add(task, ...)` and `run(task, ...)`, but is also referred to as `system`

### `tasking.add(system, name, [deps], [fn])`

Add task to a system.  Each task has a name associated to dependencies and/or a function

 - `system` (`Object`): The return system from `tasking.create`
 - `name` (`String`): Name of the task you are creaing
 - `deps` (`Array`): Tasks to run before this one starts
 - `fn` (`Function`): Function for the task.  Sync or async if it has `done` param

```js
var add = tasking.add

add(task, 'foo', function () {
  // Task to be run
})

add(task, 'bar', ['foo'], function () {
  // ...
})

add(task, 'baz', function (done) {
  setTimeout(function () {
    // ...
    done()
  }, 1000)
})

add(task, 'qux', ['foo', 'bar'])
```

When ran, the dependencies are run first.  Dependencies reference names to other tasks on the same system

If the task's function has a `done` parameter, it is ran as async, otherwise it is ran as sync

### `tasking.run(system, name, [done])`

Run task in system.  Will run specified dependency tasks first, but only once during the whole execution

- `system` (`Object`): The return system from `tasking.create`
- `name` (`String`|`Array`): Name or array of names of what you are running
- `done` (`Function`): Callback after task(s) completed.  Defaults to throwing error.

```js
run(task, 'foo', function (err) {
  // ...
})

run(task, ['foo', 'bar'], function (err) {
  // ...
})
```

It is important to know that async tasks are run in parallel, use `add` + `run` to create serially running tasks:

```js
add(task, 'foo', function (done) {
  // run a dependency serially:
  run(task, 'bar', function () {
    // ...
    done()
  })
})
```

Also see [`async-series`](https://www.npmjs.com/package/async-series)

### Structure

The system and tasks follow an easy-to-use structure:

```js
// System properties:
system.name
system.tasks

// Get tasks by name:
var foo = system.tasks.foo

// Task properties:
foo.fn
foo.deps
foo.name
```

## License

MIT © [Jamen Marz](https://git.io/jamen)

---

[![version](https://img.shields.io/npm/v/tasking.svg?style=flat-square)][package] [![travis](https://img.shields.io/travis/jamen/tasking.svg?style=flat-square)](https://travis-ci.org/jamen/tasking) [![downloads](https://img.shields.io/npm/dt/tasking.svg?style=flat-square)][package] [![license](https://img.shields.io/npm/l/tasking.svg?style=flat-square)][package] [![support me](https://img.shields.io/badge/support%20me-paypal-green.svg?style=flat-square)](https://paypal.me/jamenmarz/5usd) [![follow](https://img.shields.io/github/followers/jamen.svg?style=social&label=Follow)](https://github.com/jamen)

[package]: https://npmjs.org/package/tasking
