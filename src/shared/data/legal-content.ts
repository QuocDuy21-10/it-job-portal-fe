import type { AppLocale } from "@/i18n/routing";

export type LegalPageKey = "terms" | "privacy";

type LegalSection = {
  heading: string;
  paragraphs: string[];
};

type LegalPageContent = {
  title: string;
  description: string;
  lastUpdated: string;
  draftNotice: string;
  sections: LegalSection[];
};

// DRAFT: generic sample text so the /terms and /privacy links resolve. It has not been reviewed by a lawyer.
// Replace it with the real documents before launch. Kept out of the locale files so it is never sent to the client.
export const LEGAL_CONTENT: Record<
  AppLocale,
  Record<LegalPageKey, LegalPageContent>
> = {
  en: {
    terms: {
      title: "Terms of Service",
      description: "The rules for using DevLink as a candidate or an employer.",
      lastUpdated: "Last updated: 14 November 2026",
      draftNotice:
        "This is a draft sample. It is not the final legal text and will be replaced before launch.",
      sections: [
        {
          heading: "1. About the service",
          paragraphs: [
            "DevLink is a job portal where candidates search and apply for IT jobs, build CVs and follow companies, and where employers publish job listings and review applications.",
            "By creating an account or using the site, you agree to these terms.",
          ],
        },
        {
          heading: "2. Your account",
          paragraphs: [
            "You must give accurate information when you register and keep your password secret. You are responsible for what happens under your account.",
            "You can ask to delete your account at any time from your account settings.",
          ],
        },
        {
          heading: "3. Content you post",
          paragraphs: [
            "You keep ownership of the CVs, profiles and job listings you post. You allow DevLink to store and show that content so the service can work, for example by sending your CV to an employer you apply to.",
            "Do not post content that is false, unlawful, discriminatory, or that belongs to someone else without their permission.",
          ],
        },
        {
          heading: "4. Acceptable use",
          paragraphs: [
            "Do not use the service to send spam, collect other users' data, interfere with the site, or publish job listings that are fake or misleading.",
            "We may remove content or suspend accounts that break these rules.",
          ],
        },
        {
          heading: "5. Jobs and applications",
          paragraphs: [
            "Job listings are written by employers. DevLink does not guarantee that a listing is accurate, that a job is still open, or that an application leads to an interview or an offer.",
          ],
        },
        {
          heading: "6. Changes and contact",
          paragraphs: [
            "We may update these terms. When a change is significant, we will tell you on the site or by email before it takes effect.",
            "If you have questions about these terms, contact the DevLink team.",
          ],
        },
      ],
    },
    privacy: {
      title: "Privacy Policy",
      description: "What personal data DevLink collects and how it is used.",
      lastUpdated: "Last updated: 14 November 2026",
      draftNotice:
        "This is a draft sample. It is not the final legal text and will be replaced before launch.",
      sections: [
        {
          heading: "1. Data we collect",
          paragraphs: [
            "Account data: your name, email address and password (stored in hashed form). If you sign in with Google, we receive your name, email address and profile picture from Google.",
            "Profile and CV data: the information you add to your profile and CV, such as education, work experience, skills and contact details.",
            "Activity data: jobs you save or apply for, companies you follow, messages you send to the AI career assistant, and basic technical logs.",
          ],
        },
        {
          heading: "2. How we use your data",
          paragraphs: [
            "To run the service: sign you in, show your profile, send your application and CV to the employers you choose, and send you notifications you asked for.",
            "To keep the service safe and to fix problems.",
          ],
        },
        {
          heading: "3. Who we share it with",
          paragraphs: [
            "Employers see your application and CV only for the jobs you apply to.",
            "We use service providers to host the site, send email and power the AI assistant. They process data on our behalf. We do not sell your personal data.",
          ],
        },
        {
          heading: "4. Cookies",
          paragraphs: [
            "We use cookies that are needed to keep you signed in and to remember your language and theme.",
          ],
        },
        {
          heading: "5. Your choices",
          paragraphs: [
            "You can view and edit your profile and CV at any time, unsubscribe from emails, and ask to delete your account. Deleting your account removes your profile and CV from the service.",
          ],
        },
        {
          heading: "6. Changes and contact",
          paragraphs: [
            "We may update this policy. When a change is significant, we will tell you on the site or by email.",
            "If you have questions about your data, contact the DevLink team.",
          ],
        },
      ],
    },
  },
  vi: {
    terms: {
      title: "Điều khoản dịch vụ",
      description:
        "Quy định khi dùng DevLink với vai trò ứng viên hoặc nhà tuyển dụng.",
      lastUpdated: "Cập nhật lần cuối: 14/11/2026",
      draftNotice:
        "Đây là bản nháp mẫu. Đây chưa phải văn bản pháp lý chính thức và sẽ được thay trước khi ra mắt.",
      sections: [
        {
          heading: "1. Về dịch vụ",
          paragraphs: [
            "DevLink là cổng việc làm, nơi ứng viên tìm và ứng tuyển việc làm IT, tạo CV, theo dõi công ty; nhà tuyển dụng đăng tin tuyển dụng và xem hồ sơ ứng tuyển.",
            "Khi tạo tài khoản hoặc dùng trang, bạn đồng ý với các điều khoản này.",
          ],
        },
        {
          heading: "2. Tài khoản của bạn",
          paragraphs: [
            "Bạn phải cung cấp thông tin chính xác khi đăng ký và giữ bí mật mật khẩu. Bạn chịu trách nhiệm về mọi hoạt động trên tài khoản của mình.",
            "Bạn có thể yêu cầu xóa tài khoản bất cứ lúc nào trong phần cài đặt tài khoản.",
          ],
        },
        {
          heading: "3. Nội dung bạn đăng",
          paragraphs: [
            "Bạn vẫn là chủ sở hữu CV, hồ sơ và tin tuyển dụng mình đăng. Bạn cho phép DevLink lưu và hiển thị nội dung đó để dịch vụ hoạt động, ví dụ gửi CV của bạn tới nhà tuyển dụng mà bạn ứng tuyển.",
            "Không đăng nội dung sai sự thật, trái pháp luật, phân biệt đối xử, hoặc thuộc về người khác khi chưa được họ cho phép.",
          ],
        },
        {
          heading: "4. Sử dụng hợp lệ",
          paragraphs: [
            "Không dùng dịch vụ để gửi thư rác, thu thập dữ liệu của người dùng khác, can thiệp vào hoạt động của trang, hoặc đăng tin tuyển dụng giả mạo hay gây hiểu nhầm.",
            "Chúng tôi có thể gỡ nội dung hoặc tạm khóa tài khoản vi phạm các quy định này.",
          ],
        },
        {
          heading: "5. Việc làm và hồ sơ ứng tuyển",
          paragraphs: [
            "Tin tuyển dụng do nhà tuyển dụng viết. DevLink không bảo đảm tin đăng là chính xác, vị trí còn tuyển, hay hồ sơ ứng tuyển sẽ dẫn tới phỏng vấn hoặc lời mời làm việc.",
          ],
        },
        {
          heading: "6. Thay đổi và liên hệ",
          paragraphs: [
            "Chúng tôi có thể cập nhật các điều khoản này. Với thay đổi quan trọng, chúng tôi sẽ thông báo trên trang hoặc qua email trước khi áp dụng.",
            "Nếu có câu hỏi về các điều khoản này, hãy liên hệ đội ngũ DevLink.",
          ],
        },
      ],
    },
    privacy: {
      title: "Chính sách bảo mật",
      description:
        "DevLink thu thập những dữ liệu cá nhân nào và dùng chúng ra sao.",
      lastUpdated: "Cập nhật lần cuối: 14/11/2026",
      draftNotice:
        "Đây là bản nháp mẫu. Đây chưa phải văn bản pháp lý chính thức và sẽ được thay trước khi ra mắt.",
      sections: [
        {
          heading: "1. Dữ liệu chúng tôi thu thập",
          paragraphs: [
            "Dữ liệu tài khoản: họ tên, địa chỉ email và mật khẩu (lưu ở dạng đã băm). Nếu bạn đăng nhập bằng Google, chúng tôi nhận họ tên, địa chỉ email và ảnh đại diện từ Google.",
            "Dữ liệu hồ sơ và CV: thông tin bạn thêm vào hồ sơ và CV, như học vấn, kinh nghiệm làm việc, kỹ năng và thông tin liên hệ.",
            "Dữ liệu hoạt động: việc làm bạn lưu hoặc ứng tuyển, công ty bạn theo dõi, tin nhắn bạn gửi cho trợ lý nghề nghiệp AI, và nhật ký kỹ thuật cơ bản.",
          ],
        },
        {
          heading: "2. Cách chúng tôi dùng dữ liệu",
          paragraphs: [
            "Để vận hành dịch vụ: đăng nhập cho bạn, hiển thị hồ sơ, gửi hồ sơ ứng tuyển và CV tới nhà tuyển dụng bạn chọn, và gửi các thông báo bạn đã đăng ký.",
            "Để giữ an toàn cho dịch vụ và khắc phục sự cố.",
          ],
        },
        {
          heading: "3. Chúng tôi chia sẻ với ai",
          paragraphs: [
            "Nhà tuyển dụng chỉ thấy hồ sơ ứng tuyển và CV của bạn ở những việc làm bạn ứng tuyển.",
            "Chúng tôi dùng các nhà cung cấp dịch vụ để lưu trữ trang, gửi email và vận hành trợ lý AI. Họ xử lý dữ liệu thay mặt chúng tôi. Chúng tôi không bán dữ liệu cá nhân của bạn.",
          ],
        },
        {
          heading: "4. Cookie",
          paragraphs: [
            "Chúng tôi dùng các cookie cần thiết để giữ trạng thái đăng nhập và ghi nhớ ngôn ngữ, giao diện bạn chọn.",
          ],
        },
        {
          heading: "5. Lựa chọn của bạn",
          paragraphs: [
            "Bạn có thể xem và sửa hồ sơ, CV bất cứ lúc nào, hủy nhận email, và yêu cầu xóa tài khoản. Khi xóa tài khoản, hồ sơ và CV của bạn bị gỡ khỏi dịch vụ.",
          ],
        },
        {
          heading: "6. Thay đổi và liên hệ",
          paragraphs: [
            "Chúng tôi có thể cập nhật chính sách này. Với thay đổi quan trọng, chúng tôi sẽ thông báo trên trang hoặc qua email.",
            "Nếu có câu hỏi về dữ liệu của mình, hãy liên hệ đội ngũ DevLink.",
          ],
        },
      ],
    },
  },
};
