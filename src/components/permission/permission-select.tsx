import { useState, useEffect, useMemo } from "react";
import { ChevronRight } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useGetPermissionsQuery } from "@/features/permission/redux/permission.api";
import { Permission } from "@/features/permission/schemas/permission.schema";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";

interface PermissionSelectProps {
  selectedPermissions: string[];
  onChange: (permissions: string[]) => void;
  disabled?: boolean;
}

interface GroupedPermissions {
  [key: string]: Permission[];
}

export function PermissionSelect({
  selectedPermissions,
  onChange,
  disabled,
}: PermissionSelectProps) {
  const { data: permissionsData } = useGetPermissionsQuery({
    page: 1,
    limit: 1000,
  });

  // Memoize grouped permissions to prevent unnecessary recalculations
  const groupedPermissions: GroupedPermissions = useMemo(() => {
    const grouped: GroupedPermissions = {};
    permissionsData?.data?.result?.forEach((permission: Permission) => {
      if (!grouped[permission.module]) {
        grouped[permission.module] = [];
      }
      grouped[permission.module].push(permission);
    });
    return grouped;
  }, [permissionsData?.data?.result]);

  // Track open/closed state of modules
  const [openModules, setOpenModules] = useState<string[]>([]);

  // Calculate module selection states
  const moduleSelectionState = useMemo(() => {
    const state: { [key: string]: boolean } = {};

    Object.entries(groupedPermissions).forEach(([module, permissions]) => {
      const modulePermissionIds = permissions.map((p) => p._id);
      const selectedCount = modulePermissionIds.filter((id) =>
        selectedPermissions.includes(id)
      ).length;

      state[module] = selectedCount === permissions.length;
    });

    return state;
  }, [groupedPermissions, selectedPermissions]);

  // Toggle all permissions in a module
  const handleModuleToggle = (module: string) => {
    if (disabled) return;

    const modulePermissions = groupedPermissions[module];
    const modulePermissionIds = modulePermissions.map((p) => p._id);

    if (moduleSelectionState[module]) {
      // Deselect all permissions in this module
      onChange(
        selectedPermissions.filter((id) => !modulePermissionIds.includes(id))
      );
    } else {
      // Select all permissions in this module
      const newSelected = new Set([
        ...selectedPermissions,
        ...modulePermissionIds,
      ]);
      onChange(Array.from(newSelected));
    }
  };

  // Toggle individual permission
  const handlePermissionToggle = (permissionId: string, module: string) => {
    if (disabled) return;

    let newSelected: string[];
    if (selectedPermissions.includes(permissionId)) {
      newSelected = selectedPermissions.filter((id) => id !== permissionId);
    } else {
      newSelected = [...selectedPermissions, permissionId];
    }

    onChange(newSelected);
  };

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-4">
        {Object.entries(groupedPermissions).map(([module, permissions]) => {
          const selectedInModule = permissions.filter((p) =>
            selectedPermissions.includes(p._id)
          ).length;

          return (
            <Collapsible
              key={module}
              open={openModules.includes(module)}
              onOpenChange={(isOpen) => {
                setOpenModules(
                  isOpen
                    ? [...openModules, module]
                    : openModules.filter((m) => m !== module)
                );
              }}
            >
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <CollapsibleTrigger className="flex items-center gap-2 flex-1">
                  <ChevronRight
                    className="h-4 w-4 transition-transform duration-200"
                    style={{
                      transform: openModules.includes(module)
                        ? "rotate(90deg)"
                        : "rotate(0deg)",
                    }}
                  />
                  <h3 className="text-sm font-semibold">{module}</h3>
                  <Badge variant="secondary">
                    {selectedInModule}/{permissions.length}
                  </Badge>
                </CollapsibleTrigger>
                <Switch
                  checked={moduleSelectionState[module]}
                  onCheckedChange={() => handleModuleToggle(module)}
                  disabled={disabled}
                />
              </div>

              <CollapsibleContent className="mt-2">
                <div className="ml-8 space-y-2">
                  {permissions.map((permission) => (
                    <div
                      key={permission._id}
                      className="flex items-center justify-between py-1"
                    >
                      <div className="flex items-center gap-2">
                        <div className="text-sm">{permission.name}</div>
                        <Badge variant="outline" className="text-xs">
                          {permission.method}
                        </Badge>
                      </div>
                      <Switch
                        checked={selectedPermissions.includes(permission._id)}
                        onCheckedChange={() =>
                          handlePermissionToggle(permission._id, module)
                        }
                        disabled={disabled}
                      />
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </div>
    </ScrollArea>
  );
}
