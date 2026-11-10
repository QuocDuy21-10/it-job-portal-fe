"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "@/hooks/use-i18n";
import { Link } from "@/i18n/navigation";
import type { UserInfo } from "@/features/auth/schemas/auth.schema";
import { USER_MENU_ITEMS } from "./nav-config";

interface UserMenuProps {
  user: UserInfo;
  isAdmin: boolean;
  onSignOut: () => void;
}

export function UserMenu({ user, isAdmin, onSignOut }: UserMenuProps) {
  const { t, mounted } = useI18n();
  const label = (key: string, fallback: string) =>
    mounted ? t(key) : fallback;
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 150);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-primary/20 bg-secondary overflow-hidden focus:outline-none focus-visible:outline-none hover:shadow-md transition-all duration-300 hover:scale-105 data-[state=open]:ring-2 data-[state=open]:ring-primary/20"
          aria-label="User menu"
        >
          <Image
            src={user?.avatar || "/images/avatar-default.jpg"}
            alt={user?.name || user?.email || "avatar"}
            width={40}
            height={40}
            className="object-cover rounded-full"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <DropdownMenuLabel>
          {user?.name && (
            <div className="font-semibold truncate">{user.name}</div>
          )}
          <div className="text-xs text-muted-foreground truncate">
            {user?.email}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {USER_MENU_ITEMS.filter((item) => !item.adminOnly || isAdmin).map(
          ({ href, icon: Icon, labelKey, fallback }) => (
            <DropdownMenuItem key={href} asChild>
              <Link href={href} className="cursor-pointer">
                <Icon className="mr-2 h-4 w-4" />
                {label(labelKey, fallback)}
              </Link>
            </DropdownMenuItem>
          )
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onSignOut}
          className="cursor-pointer text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {label("nav.signOut", "Sign Out")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
