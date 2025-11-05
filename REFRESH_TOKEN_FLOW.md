# Auto Refresh Token Flow - RTK Query

## Overview

Hệ thống tự động làm mới access token khi hết hạn, sử dụng RTK Query với Mutex để tránh duplicate refresh calls.

## Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     Component gọi API /auth/me                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              RTK Query gọi baseQueryWithReauth                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│    Check if another refresh is in progress (mutex.isLocked)    │
└────────────┬────────────────────────────────────┬───────────────┘
             │                                    │
    NO (not locked)                        YES (locked)
             │                                    │
             ▼                                    ▼
┌─────────────────────────┐         ┌─────────────────────────────┐
│  Acquire mutex lock     │         │  Wait for mutex unlock      │
└──────────┬──────────────┘         └──────────┬──────────────────┘
           │                                   │
           ▼                                   │
┌─────────────────────────────────────────────┼────────────────────┐
│  BaseQuery adds access_token from           │                    │
│  localStorage → Send request                │                    │
└──────────┬──────────────────────────────────┼────────────────────┘
           │                                   │
           ▼                                   │
┌─────────────────────────┐                   │
│  Response Status Check  │                   │
└──────┬─────────┬────────┘                   │
       │         │                            │
  200 OK    401 Unauthorized                  │
       │         │                            │
       │         ▼                            │
       │  ┌──────────────────────────┐        │
       │  │ Call /auth/refresh API   │        │
       │  └──────┬──────────┬────────┘        │
       │         │          │                 │
       │    Success     Failed               │
       │         │          │                 │
       │         ▼          ▼                 │
       │  ┌──────────┐  ┌─────────────────┐  │
       │  │Save new  │  │ handleLogout()  │  │
       │  │token to  │  │ - Clear token   │  │
       │  │localStorage│ │ - Redirect to  │  │
       │  └──────┬───┘  │   /auth/login   │  │
       │         │      └─────────────────┘  │
       │         ▼                            │
       │  ┌──────────────────────┐            │
       │  │ Retry original       │            │
       │  │ request with new     │◄───────────┘
       │  │ token                │
       │  └──────┬───────────────┘
       │         │
       │         ▼
       │  ┌──────────────────────┐
       │  │ Release mutex lock   │
       │  └──────────────────────┘
       │
       ▼
┌─────────────────────────┐
│  Return data to         │
│  component              │
└─────────────────────────┘
```

## Implementation Details

### 1. Mutex Pattern

- **Package**: `async-mutex`
- **Purpose**: Đảm bảo chỉ 1 refresh token request chạy tại một thời điểm
- **Mechanism**:
  - Request đầu tiên acquire lock
  - Các request tiếp theo wait for unlock
  - Sau khi unlock, retry với token mới

### 2. Key Features

#### ✅ Prevent Duplicate Refresh Calls

```typescript
if (!mutex.isLocked()) {
  const release = await mutex.acquire();
  try {
    // Refresh token logic
  } finally {
    release();
  }
} else {
  await mutex.waitForUnlock();
  // Retry with new token
}
```

#### ✅ Automatic Token Storage

```typescript
if (newAccessToken) {
  localStorage.setItem("access_token", newAccessToken);
}
```

#### ✅ Automatic Retry

```typescript
// Retry original request with new token
result = await baseQuery(args, api, extraOptions);
```

#### ✅ Logout on Failure

```typescript
const handleLogout = () => {
  localStorage.removeItem("access_token");
  window.location.href = "/auth/login";
};
```

### 3. Request Flow Examples

#### Scenario 1: Single Request with Expired Token

```
1. User calls /auth/me → 401
2. Mutex not locked → Acquire lock
3. Call /auth/refresh → Success
4. Save new token
5. Retry /auth/me → 200 OK
6. Release lock
7. Return data
```

#### Scenario 2: Multiple Requests with Expired Token

```
Request A: /auth/me → 401
Request B: /users/profile → 401
Request C: /jobs/list → 401

Timeline:
- Request A acquires mutex → refreshes token
- Request B waits for unlock
- Request C waits for unlock
- Request A completes → releases mutex
- Request B retries with new token → 200 OK
- Request C retries with new token → 200 OK

Result: Only 1 refresh token call instead of 3!
```

### 4. Error Handling

| Scenario                          | Action                          |
| --------------------------------- | ------------------------------- |
| 401 + Refresh Success             | Save token → Retry request      |
| 401 + Refresh Failed              | Clear token → Redirect to login |
| 401 + No access_token in response | Clear token → Redirect to login |
| Other errors                      | Propagate error to component    |

### 5. Integration with Redux

#### Auth Slice

- Automatic logout handled by `handleLogout()`
- Can dispatch actions via `api.dispatch()` if needed
- State updates via RTK Query auto-generated reducers

#### Usage in Components

```typescript
// Component automatically benefits from auto-refresh
const { data, isLoading, error } = useGetMeQuery();

// No manual token refresh logic needed!
```

## Configuration

### API Base URL

```typescript
// src/shared/constants/constant.ts
export const API_BASE_URL = "http://localhost:8000/api/v1";
```

### Token Storage

- **Location**: `localStorage`
- **Key**: `access_token`
- **Format**: JWT string

### Refresh Token

- **Method**: Cookies (httpOnly)
- **Endpoint**: `POST /auth/refresh`
- **Response Format**:

```json
{
  "data": {
    "access_token": "new_jwt_token_here"
  }
}
```

## Testing

### Manual Test Cases

1. **Test Token Expiration**

   - Login → Get valid token
   - Wait for token expiration
   - Make API call → Should auto-refresh

2. **Test Multiple Concurrent Requests**

   - Clear token / Use expired token
   - Make 5+ API calls simultaneously
   - Verify only 1 refresh token call in Network tab

3. **Test Refresh Token Expiration**
   - Logout → Clear refresh token cookie
   - Try to access protected route
   - Should redirect to /auth/login

## Debugging

### Console Logs

```
Access token expired, attempting to refresh...
Token refreshed successfully, retrying original request...
```

### Network Tab

- Watch for `/auth/refresh` calls
- Verify only 1 refresh call even with multiple 401s
- Check retry requests have new token in headers

## Security Considerations

1. **Access Token**: Stored in localStorage (vulnerable to XSS)
2. **Refresh Token**: Stored in httpOnly cookies (protected from XSS)
3. **Token Rotation**: New access token on each refresh
4. **Auto Logout**: On refresh failure or invalid tokens

## Performance

- **Mutex overhead**: Minimal (~1ms per wait)
- **Retry delay**: Automatic, no artificial delay
- **Cache invalidation**: Handled by RTK Query tags
- **Request deduplication**: Built-in RTK Query feature

## Future Improvements

- [ ] Add exponential backoff for failed refreshes
- [ ] Add token expiry check before making requests
- [ ] Implement token refresh before expiration (proactive)
- [ ] Add metrics/monitoring for refresh frequency
- [ ] Queue requests during refresh instead of waiting

## References

- [RTK Query - Automatic Re-authorization](https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#automatic-re-authorization-by-extending-fetchbasequery)
- [async-mutex Documentation](https://github.com/DirtyHairy/async-mutex)
