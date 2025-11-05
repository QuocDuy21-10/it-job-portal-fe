/**
 * Test Auto Refresh Token Implementation
 *
 * Run these tests manually in the browser console to verify the auto-refresh flow
 */

// Test 1: Simulate expired token and multiple concurrent requests
async function testConcurrentRequests() {
  console.log("🧪 Test 1: Multiple concurrent requests with expired token");

  // Set an expired or invalid token
  localStorage.setItem("access_token", "expired_token_for_testing");

  // Make multiple API calls simultaneously
  const requests = [
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      credentials: "include",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    }),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
      credentials: "include",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    }),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs`, {
      credentials: "include",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    }),
  ];

  try {
    const results = await Promise.all(requests);
    console.log(
      "✅ All requests completed:",
      results.map((r) => r.status)
    );

    // Check if token was refreshed
    const newToken = localStorage.getItem("access_token");
    console.log(
      "🔑 Token after refresh:",
      newToken !== "expired_token_for_testing"
        ? "✅ Refreshed"
        : "❌ Not refreshed"
    );
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

// Test 2: Monitor refresh token calls
function monitorRefreshCalls() {
  console.log("🧪 Test 2: Monitoring refresh token calls");

  let refreshCount = 0;

  // Intercept fetch calls
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    const url = args[0];
    if (typeof url === "string" && url.includes("/auth/refresh")) {
      refreshCount++;
      console.log(`🔄 Refresh token call #${refreshCount}`);
    }
    return originalFetch.apply(window, args);
  };

  console.log("✅ Monitor installed. Make some API calls and check the count.");

  // Restore after 60 seconds
  setTimeout(() => {
    window.fetch = originalFetch;
    console.log(`📊 Total refresh calls in 60s: ${refreshCount}`);
  }, 60000);
}

// Test 3: Check mutex behavior
async function testMutexBehavior() {
  console.log("🧪 Test 3: Testing mutex locking behavior");

  // This should be run while observing Network tab
  // You should see only 1 refresh token call even with multiple failed requests

  const startTime = Date.now();

  // Trigger multiple requests that will fail
  localStorage.setItem("access_token", "definitely_expired");

  const promises = Array(10)
    .fill(null)
    .map((_, i) =>
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }).then(() => console.log(`Request ${i + 1} completed`))
    );

  await Promise.allSettled(promises);

  const duration = Date.now() - startTime;
  console.log(`✅ Test completed in ${duration}ms`);
  console.log("👀 Check Network tab - should see only 1 refresh token call");
}

// Export for console use
if (typeof window !== "undefined") {
  (window as any).authTests = {
    testConcurrentRequests,
    monitorRefreshCalls,
    testMutexBehavior,
  };

  console.log(`
  🧪 Auto Refresh Token Tests Available:
  
  Run these in console:
  - authTests.testConcurrentRequests()
  - authTests.monitorRefreshCalls()
  - authTests.testMutexBehavior()
  `);
}

export {};
