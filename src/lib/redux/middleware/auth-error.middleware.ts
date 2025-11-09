// import { Middleware } from "@reduxjs/toolkit";
// import { isRejectedWithValue } from "@reduxjs/toolkit";

// /**
//  * Redux middleware to handle API errors globally
//  * Axios interceptor đã xử lý 401 và refresh token
//  * Middleware này chỉ xử lý các case đặc biệt khác
//  */
// export const authErrorMiddleware: Middleware =
//   (store) => (next) => (action: any) => {
//     // Check if this is a rejected action
//     if (isRejectedWithValue(action)) {
//       const status = action.payload?.status;

//       // Handle 403 Forbidden - User lacks permission
//       if (status === 403) {
//         console.log("� 403 Forbidden - User lacks permission");
//         // You can dispatch an action to show a permission denied message
//         // toast.error("Bạn không có quyền thực hiện hành động này");
//       }

//       // Handle 404 Not Found (optional)
//       if (status === 404) {
//         console.log("🔍 404 Not Found");
//       }

//       // Handle 500 Server Error (optional)
//       if (status === 500) {
//         console.log("� 500 Internal Server Error");
//       }
//     }

//     return next(action);
//   };
