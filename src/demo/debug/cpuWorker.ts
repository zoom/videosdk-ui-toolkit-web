let lastTime = performance.now();
let lastUsage = 0;

function calculateCPULoad() {
  const start = performance.now();
  const iterations = 1000000;

  // Simulate heavy computation
  let result = 0;
  for (let i = 0; i < iterations; i++) {
    result = Math.random() * Math.random();
  }

  const end = performance.now();
  const timeDiff = end - lastTime;
  const usage = Math.min(100, ((end - start) / timeDiff) * 100);

  lastTime = end;
  lastUsage = usage * 0.1 + lastUsage * 0.9; // Smooth the values

  postMessage(lastUsage);
  setTimeout(calculateCPULoad, 1000);
}

calculateCPULoad();
