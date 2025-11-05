"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2 } from "lucide-react";

interface Subscription {
  id: string;
  skills: string[];
  location: string;
  isActive: boolean;
  createdDate: string;
}

export default function EmailSubscriptionPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    {
      id: "1",
      skills: ["React", "TypeScript", "Node.js"],
      location: "Ho Chi Minh City",
      isActive: true,
      createdDate: "2024-01-10",
    },
    {
      id: "2",
      skills: ["Python", "Django"],
      location: "Hanoi",
      isActive: false,
      createdDate: "2024-01-05",
    },
  ]);

  const [formData, setFormData] = useState({
    skills: "",
    location: "",
  });

  const handleRegister = () => {
    if (!formData.skills || !formData.location) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }

    const newSubscription: Subscription = {
      id: Date.now().toString(),
      skills: formData.skills.split(",").map((s) => s.trim()),
      location: formData.location,
      isActive: true,
      createdDate: new Date().toISOString().split("T")[0],
    };

    setSubscriptions([...subscriptions, newSubscription]);
    setFormData({ skills: "", location: "" });
    alert("Đăng ký thành công!");
  };

  const deleteSubscription = (id: string) => {
    setSubscriptions(subscriptions.filter((s) => s.id !== id));
  };

  const toggleSubscription = (id: string) => {
    setSubscriptions(
      subscriptions.map((s) =>
        s.id === id ? { ...s, isActive: !s.isActive } : s
      )
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Kỹ năng đã đăng ký</h1>

      {/* Register Form */}
      <Card className="p-6 bg-card border border-border">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Đăng ký nhận công việc
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Kỹ năng (cách nhau bởi dấu phẩy)
            </label>
            <input
              type="text"
              placeholder="React, TypeScript, Node.js"
              value={formData.skills}
              onChange={(e) =>
                setFormData({ ...formData, skills: e.target.value })
              }
              className="w-full px-3 py-2 border border-border rounded-lg bg-secondary text-foreground"
            />
          </div>
          {/* <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Địa điểm
            </label>
            <select
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="w-full px-3 py-2 border border-border rounded-lg bg-secondary text-foreground"
            >
              <option value="">Chọn địa điểm</option>
              <option value="Ho Chi Minh City">Hồ Chí Minh</option>
              <option value="Hanoi">Hà Nội</option>
              <option value="Da Nang">Đà Nẵng</option>
              <option value="Can Tho">Cần Thơ</option>
            </select>
          </div> */}
          <Button
            onClick={handleRegister}
            className="w-full bg-primary text-primary-foreground"
          >
            Đăng ký
          </Button>
        </div>
      </Card>

      {/* Subscriptions List */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground">
          Đăng ký của bạn ({subscriptions.length})
        </h2>
        {subscriptions.map((sub) => (
          <Card key={sub.id} className="p-4 bg-card border border-border">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex flex-wrap gap-2">
                    {sub.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Địa điểm:{" "}
                  <span className="text-foreground font-medium">
                    {sub.location}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Đăng ký:{" "}
                  {new Date(sub.createdDate).toLocaleDateString("vi-VN")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleSubscription(sub.id)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                    sub.isActive
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {sub.isActive ? "Bật" : "Tắt"}
                </button>
                <button
                  onClick={() => deleteSubscription(sub.id)}
                  className="p-2 hover:bg-secondary rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
