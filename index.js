var each = require('async-each')
var once = require('once')
function loud (err) { if (err) throw err }

module.exports = tasking

tasking.create = tasking
tasking.add = add
tasking.run = run

function tasking (name) {
  // Create "system" object:
  return { name: name, tasks: {} }
}

function add (system, name, deps, fn) {
  if (!fn && !Array.isArray(deps)) fn = deps, deps = null

  // Add task:
  var task = { name: name, deps: deps, fn: fn }
  system.tasks[name] = task
  return task
}

function run (system, name, done, ran) {
  done = once(done || loud)
  ran = ran || {}

  if (Array.isArray(name)) {
    return each(name, function (item, next) {
      run(system, item, next, ran)
    }, function (err) {
      done(err)
    })
  }

  var task = system.tasks[name]
  var deps = task.deps
  var fn = task.fn

  function runMain () {
    if (!fn) return done()
    if (!fn.length) {
      // Sync task:
      var err = null
      try { fn() }
      catch (caught) {
        err = caught
      }
      done(err)
    } else {
      // Async task:
      fn(done)
    }
  }

  if (deps && deps.length) {
    // Run dependencies before main:
    each(deps, function (depName, next) {
      if (!ran[depName]) {
        run(system, depName, function (err) {
          ran[depName] = true
          next(err)
        }, ran)
      } else {
        next()
      }
    }, function (err) {
      if (err) return done(err)
      runMain()
    })
  } else {
    // Run main:
    runMain()
  }
}
