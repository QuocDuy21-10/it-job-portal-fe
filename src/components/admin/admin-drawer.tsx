"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type KeyboardEventHandler,
  type ReactNode,
} from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Loader2, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Sheet, SheetOverlay, SheetPortal } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useI18n } from "@/hooks/use-i18n";

const SIZE = { md: "md:max-w-[480px]", lg: "md:max-w-[720px]" };

const FIRST_FIELD =
  'input:not([disabled]):not([type="hidden"]):not([type="file"]), textarea:not([disabled]), button[role="combobox"]:not([disabled])';

const DrawerContext = createContext({
  requestClose: () => {},
  isBusy: false,
});

type AdminDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  size?: keyof typeof SIZE;
  title: string;
  description?: ReactNode;
  meta?: ReactNode;
  headerActions?: ReactNode;
  footer?: ReactNode;
  isDirty?: boolean;
  isBusy?: boolean;
  // Changing it scrolls back to the top and moves focus to the title.
  contentKey?: string;
  onKeyDown?: KeyboardEventHandler;
  children: ReactNode;
};

export function AdminDrawer({
  open,
  onOpenChange,
  size = "md",
  title,
  description,
  meta,
  headerActions,
  footer,
  isDirty = false,
  isBusy = false,
  contentKey,
  onKeyDown,
  children,
}: AdminDrawerProps) {
  const { t } = useI18n();
  const [isConfirming, setIsConfirming] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const shownKey = useRef(contentKey);
  const opener = useRef<HTMLElement | null>(null);

  const requestClose = () => {
    if (isBusy) return;
    if (isDirty) setIsConfirming(true);
    else onOpenChange(false);
  };

  const discard = () => {
    setIsConfirming(false);
    onOpenChange(false);
  };

  useEffect(() => {
    if (!open || !isDirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [open, isDirty]);

  useEffect(() => {
    if (shownKey.current === contentKey) return;
    shownKey.current = contentKey;
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
    titleRef.current?.focus();
  }, [contentKey]);

  return (
    <Sheet open={open} onOpenChange={(next) => !next && requestClose()}>
      <SheetPortal>
        <SheetOverlay className="duration-slow" />
        <DialogPrimitive.Content
          className={`fixed inset-y-0 right-0 z-modal flex h-[100dvh] w-full flex-col overflow-hidden bg-card shadow-elevation-3 outline-none duration-slow ease-standard data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right md:w-[90vw] md:rounded-l-xl ${SIZE[size]}`}
          onKeyDown={onKeyDown}
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            opener.current = document.activeElement as HTMLElement | null;
            // A focused field would open the on-screen keyboard on touch devices.
            const isTouch = window.matchMedia("(pointer: coarse)").matches;
            const field = isTouch
              ? null
              : bodyRef.current?.querySelector<HTMLElement>(FIRST_FIELD);
            (field ?? titleRef.current)?.focus();
          }}
          // The drawer is opened from outside, so Radix has no trigger to refocus.
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            opener.current?.focus();
          }}
          onEscapeKeyDown={(event) => {
            if (document.activeElement?.closest("[data-escape-scope]")) {
              event.preventDefault();
            }
          }}
          onInteractOutside={(event) => {
            if ((event.target as Element).closest("[data-sonner-toaster]")) {
              event.preventDefault();
            }
          }}
          {...(description ? {} : { "aria-describedby": undefined })}
        >
          <DrawerContext.Provider value={{ requestClose, isBusy }}>
            <header className="flex shrink-0 items-start justify-between gap-4 border-b border-border p-4 md:px-6">
              <div className="min-w-0 space-y-1">
                {meta}
                <DialogPrimitive.Title
                  ref={titleRef}
                  tabIndex={-1}
                  className="break-words font-heading text-h3 text-foreground outline-none"
                >
                  {title}
                </DialogPrimitive.Title>
                {description && (
                  <DialogPrimitive.Description className="break-words text-body-sm text-muted-foreground">
                    {description}
                  </DialogPrimitive.Description>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-1">
                {headerActions}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-11 w-11 md:h-10 md:w-10"
                        aria-label={t("common.close")}
                        disabled={isBusy}
                        onClick={requestClose}
                      >
                        <X className="h-5 w-5" aria-hidden="true" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{t("common.close")}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </header>
            <div
              ref={bodyRef}
              className="flex-1 overflow-y-auto overscroll-contain p-4 text-body-sm md:p-6"
            >
              {children}
            </div>
            {footer && (
              <footer className="flex shrink-0 flex-col gap-2 border-t border-border p-4 sm:flex-row sm:justify-end md:px-6">
                {footer}
              </footer>
            )}
          </DrawerContext.Provider>
        </DialogPrimitive.Content>
      </SheetPortal>

      <AlertDialog open={isConfirming} onOpenChange={setIsConfirming}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("adminPages.shared.unsavedTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("adminPages.shared.unsavedDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={discard}
            >
              {t("adminPages.shared.discard")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sheet>
  );
}

type AdminDrawerFormFooterProps = { formId: string; submitLabel: string };

export function AdminDrawerFormFooter({
  formId,
  submitLabel,
}: AdminDrawerFormFooterProps) {
  const { t } = useI18n();
  const { requestClose, isBusy } = useContext(DrawerContext);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="h-11 md:h-10"
        disabled={isBusy}
        onClick={requestClose}
      >
        {t("common.cancel")}
      </Button>
      <Button
        type="submit"
        form={formId}
        className="relative h-11 md:h-10"
        disabled={isBusy}
        aria-busy={isBusy}
      >
        <span className={isBusy ? "opacity-0" : undefined}>{submitLabel}</span>
        {isBusy && (
          <Loader2
            className="absolute h-4 w-4 animate-spin"
            aria-hidden="true"
          />
        )}
      </Button>
    </>
  );
}
