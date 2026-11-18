// Strings used outside NextIntlClientProvider: the root error boundary and the Redux error
// middleware. They live here so those files do not pull the whole en/vi objects into every page.
const en = {
  errorPage: {
    title: "Something went wrong",
    description: "An unexpected error occurred. Please try again.",
    retry: "Try again",
    goHome: "Go to Home",
    devDetails: "Error details (Dev only)",
  },
  middleware: {
    forbidden: "You do not have permission to perform this action",
    serverError: "Server error. Please try again later",
    networkError:
      "Cannot connect to server. Please check your network connection",
    tooManyRequests:
      "Too many attempts. Please wait a few minutes and try again",
  },
};

const vi: typeof en = {
  errorPage: {
    title: "Có lỗi xảy ra",
    description: "Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.",
    retry: "Thử lại",
    goHome: "Về trang chủ",
    devDetails: "Chi tiết lỗi (Dev only)",
  },
  middleware: {
    forbidden: "Bạn không có quyền thực hiện hành động này",
    serverError: "Lỗi server. Vui lòng thử lại sau",
    networkError:
      "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng",
    tooManyRequests:
      "Bạn thao tác quá nhiều lần. Vui lòng đợi vài phút rồi thử lại",
  },
};

export const standaloneMessages = { en, vi };

export type StandaloneLocale = keyof typeof standaloneMessages;

// The root layout sets <html lang> from the request locale, and I18nProvider keeps it in sync.
export function getDocumentLocale(): StandaloneLocale {
  if (typeof document === "undefined") return "en";
  return document.documentElement.lang === "vi" ? "vi" : "en";
}
