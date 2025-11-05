/**
 * Auto Refresh Token Demo Component
 *
 * This component demonstrates the auto-refresh token flow in action.
 * Use it in a dev/test environment to verify the implementation.
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useGetMeQuery } from "@/features/auth/redux/auth.api";
import { Badge } from "@/components/ui/badge";

export function AutoRefreshTokenDemo() {
  const [logs, setLogs] = useState<string[]>([]);
  const { data, isLoading, error, refetch } = useGetMeQuery();

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `[${timestamp}] ${message}`]);
  };

  const simulateExpiredToken = () => {
    addLog("🔧 Setting expired token in localStorage...");
    localStorage.setItem("access_token", "expired_token_for_testing");
    addLog("✅ Expired token set. Next API call will trigger refresh.");
  };

  const makeSingleRequest = async () => {
    addLog("📡 Making single API request to /auth/me...");
    try {
      await refetch();
      addLog("✅ Request completed successfully!");
    } catch (err) {
      addLog(`❌ Request failed: ${err}`);
    }
  };

  const makeMultipleRequests = async () => {
    addLog("📡 Making 5 concurrent API requests...");
    const promises = Array(5)
      .fill(null)
      .map(() => refetch());

    try {
      await Promise.all(promises);
      addLog("✅ All requests completed! Check Network tab for refresh calls.");
    } catch (err) {
      addLog(`❌ Requests failed: ${err}`);
    }
  };

  const clearLogs = () => setLogs([]);

  const currentToken =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  return (
    <Card className="p-6 space-y-4 max-w-4xl mx-auto">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Auto Refresh Token Demo</h2>
        <p className="text-muted-foreground">
          Test the automatic token refresh flow with Mutex-based duplicate
          prevention.
        </p>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">Current Status</h3>
        <div className="flex gap-2">
          <Badge variant={data ? "default" : "secondary"}>
            {data ? "✅ Authenticated" : "❌ Not Authenticated"}
          </Badge>
          <Badge variant={isLoading ? "outline" : "secondary"}>
            {isLoading ? "⏳ Loading..." : "✅ Ready"}
          </Badge>
        </div>
        {currentToken && (
          <div className="p-2 bg-muted rounded text-xs font-mono truncate">
            Token: {currentToken.substring(0, 50)}...
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">Test Actions</h3>
        <div className="flex flex-wrap gap-2">
          <Button onClick={simulateExpiredToken} variant="outline">
            1️⃣ Set Expired Token
          </Button>
          <Button onClick={makeSingleRequest} variant="outline">
            2️⃣ Single Request
          </Button>
          <Button onClick={makeMultipleRequests} variant="outline">
            3️⃣ Multiple Requests
          </Button>
          <Button onClick={clearLogs} variant="destructive" size="sm">
            Clear Logs
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">Test Instructions</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
          <li>Open Browser DevTools → Network tab</li>
          <li>Click "Set Expired Token" to simulate token expiration</li>
          <li>Click "Multiple Requests" to trigger 5 concurrent calls</li>
          <li>Observe: Only 1 refresh token call in Network tab!</li>
          <li>Check logs below for detailed flow</li>
        </ol>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Activity Logs</h3>
          <Badge variant="outline">{logs.length} logs</Badge>
        </div>
        <div className="bg-black text-green-400 p-4 rounded font-mono text-xs h-64 overflow-y-auto space-y-1">
          {logs.length === 0 ? (
            <div className="text-muted-foreground">
              No logs yet. Run a test to see activity...
            </div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="whitespace-pre-wrap">
                {log}
              </div>
            ))
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive rounded">
          <h4 className="font-semibold text-destructive">Error</h4>
          <pre className="text-xs mt-2 overflow-auto">
            {JSON.stringify(error, null, 2)}
          </pre>
        </div>
      )}

      <div className="p-4 bg-blue-50 border border-blue-200 rounded text-sm">
        <h4 className="font-semibold text-blue-900 mb-2">
          💡 Expected Behavior
        </h4>
        <ul className="space-y-1 text-blue-800">
          <li>• Expired token → Auto refresh → Retry request</li>
          <li>
            • Multiple 401s → Only 1 refresh call (Mutex prevents duplicates)
          </li>
          <li>• Refresh failure → Auto logout → Redirect to login</li>
          <li>• All handled automatically, no manual intervention needed!</li>
        </ul>
      </div>
    </Card>
  );
}
