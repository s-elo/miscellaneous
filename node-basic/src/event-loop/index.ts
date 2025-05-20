/**
 * stages of each batch:
 * - timer queue
 * - poll queue
 * - check queue
 * - close queue
 * The actual event loop does not include nextTick and microTask queue,
 *
 * 1. The nextTick will be executed after main thread finished in any given stage, then continue to the next stage.
 * (fires immediately on the same phase)
 *
 * 2. The microTask will be executed after the nextTick and before the actual event loop,
 * but if adding more microTasks in a microTask, the added microTasks will be executed before the nextTick.
 *
 * 3. setImmediate() fires on the following iteration or 'tick' of the event loop
 *
 * 4. if current phase is microTask queue, will continue util the microTask queue is empty,
 * namly if more microTaks are added in a microTask, the added microTasks will be executed before continuing the nextTick and eventloop
 */
async function eventLoopDemo() {
  console.log('main start');

  setTimeout(() => {
    console.log(' ');
    console.log('setTimeout start');

    setTimeout(() => {
      console.log('setTimeout inner');
    }, 0);

    setImmediate(() => {
      console.log('setImmediate inner');
      Promise.resolve().then(() => {
        console.log('Promise.resolve inner 3');
      });
      // will be executed after the current thread finished, then the microTask queue will be executed
      process.nextTick(() => {
        console.log('process.nextTick inner 3');
      });
      // fires on the next batch
      setImmediate(() => {
        console.log('setImmediate inner 2');
      });
    });

    Promise.resolve().then(() => {
      console.log('Promise.resolve inner 1');

      Promise.resolve()
        .then(() => {
          console.log('Promise.resolve inner 2');
        })
        .then(() => {
          console.log('Promise.resolve inner then');
        });

      // will be executed after the microTask queue is empty
      process.nextTick(() => {
        console.log('process.nextTick inner 2');
      });
    });

    process.nextTick(() => {
      console.log('process.nextTick inner 1');
    });

    console.log('setTimeout end');
  }, 0);

  // the order between setImmediate and setTimeout is not guaranteed
  // if when main thread finished and setTimeout cb has added to the timer queue, setImmediate will be executed first
  // if when main thread finished and setTimeout cb has not added to the timer queue, setImmediate will be executed after setTimeout
  setImmediate(() => {
    console.log('setImmediate');
  });

  Promise.resolve().then(() => {
    console.log('Promise.resolve');
  });

  // will be executed immediately after main thread finished, then microTask queue will be executed
  process.nextTick(() => {
    console.log('process.nextTick');
    // will be executed immediately after current thread finished
    process.nextTick(() => {
      console.log('process.nextTick inner 0');
    });

    Promise.resolve().then(() => {
      console.log('Promise.resolve inner 0');

      process.nextTick(() => {
        console.log('process.nextTick inner #');
      });
      // this will be executed after the current thread finished, and before the nextTick
      // because nextTick will be executed when the microTask queue is empty
      Promise.resolve().then(() => {
        console.log('Promise.resolve inner #');
      });
    });
  });

  console.log('main end');
}

eventLoopDemo();
