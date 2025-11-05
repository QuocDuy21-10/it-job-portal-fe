"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, Lock, Trash2 } from "lucide-react";

export default function SettingsPage({
  onNavigateToCCV,
}: {
  onNavigateToCCV: () => void;
}) {
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const handlePasswordChange = () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (passwords.new !== passwords.confirm) {
      alert("Mật khẩu mới không trùng khớp");
      return;
    }

    alert("Mật khẩu đã được cập nhật thành công");
    setPasswords({ current: "", new: "", confirm: "" });
  };

  const handleDeleteAccount = () => {
    if (!verificationCode) {
      alert("Vui lòng nhập mã xác thực");
      return;
    }

    alert("Tài khoản của bạn sẽ bị xóa vĩnh viễn");
    setShowDeleteModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Cài đặt</h1>

      {/* Account Information */}
      <Card className="p-6 bg-card border border-border">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Thông tin tài khoản
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Email
            </label>
            <p className="px-3 py-2 bg-secondary text-foreground rounded-lg text-sm">
              john@example.com
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Tên đăng nhập
            </label>
            <p className="px-3 py-2 bg-secondary text-foreground rounded-lg text-sm">
              johndoe
            </p>
          </div>
          <Button
            onClick={onNavigateToCCV}
            className="bg-primary hover:bg-primary/90 w-full"
          >
            Cập nhật hồ sơ
          </Button>
        </div>
      </Card>

      {/* Change Password */}
      <Card className="p-6 bg-card border border-border">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">
            Đổi mật khẩu
          </h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Mật khẩu hiện tại
            </label>
            <input
              type="password"
              value={passwords.current}
              onChange={(e) =>
                setPasswords({ ...passwords, current: e.target.value })
              }
              className="w-full px-3 py-2 border border-border rounded-lg bg-secondary text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Mật khẩu mới
            </label>
            <input
              type="password"
              value={passwords.new}
              onChange={(e) =>
                setPasswords({ ...passwords, new: e.target.value })
              }
              className="w-full px-3 py-2 border border-border rounded-lg bg-secondary text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Xác nhận mật khẩu mới
            </label>
            <input
              type="password"
              value={passwords.confirm}
              onChange={(e) =>
                setPasswords({ ...passwords, confirm: e.target.value })
              }
              className="w-full px-3 py-2 border border-border rounded-lg bg-secondary text-foreground"
            />
          </div>
          <Button
            onClick={handlePasswordChange}
            className="bg-primary hover:bg-primary/90 w-full"
          >
            Cập nhật mật khẩu
          </Button>
        </div>
      </Card>

      {/* Delete Account */}
      <Card className="p-6 bg-destructive/10 border border-destructive/30">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Xóa tài khoản
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Hành động này không thể hoàn tác. Tất cả dữ liệu của bạn sẽ bị xóa
              vĩnh viễn.
            </p>
            <Button
              onClick={() => setShowDeleteModal(true)}
              variant="destructive"
              className="bg-destructive hover:bg-destructive/90"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Xóa tài khoản
            </Button>
          </div>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="p-6 bg-card border border-border w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Xác nhận xóa tài khoản
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Chúng tôi đã gửi mã xác thực đến email của bạn. Vui lòng nhập mã
              xác thực để tiếp tục.
            </p>
            <input
              type="text"
              placeholder="Nhập mã xác thực"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-secondary text-foreground mb-4"
            />
            <div className="flex gap-3">
              <Button
                onClick={() => setShowDeleteModal(false)}
                variant="outline"
                className="flex-1"
              >
                Hủy
              </Button>
              <Button
                onClick={handleDeleteAccount}
                className="flex-1 bg-destructive hover:bg-destructive/90"
              >
                Xóa vĩnh viễn
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
