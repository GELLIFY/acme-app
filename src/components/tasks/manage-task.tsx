import {
  Circle,
  CircleCheck,
  CircleHelpIcon,
  CircleOffIcon,
  Ellipsis,
  MoveDown,
  MoveRight,
  MoveUp,
  Pen,
  Timer,
  Trash2,
  UserPlus,
} from "lucide-react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { TaskPriority } from "@/lib/tasks/task-utils";
import { capitalizeWords } from "@/lib/utils";
import { useScopedI18n } from "@/shared/locales/client";
import type { TasksSchema } from "@/shared/validators/tasks.schema";
import { AssignUserToTask } from "./assign-user-to-task";
import { DeleteConfirmDialog } from "./delete-task";

type ManageTasksTableProps = {
  task: TasksSchema;
  onEdit: (task: TasksSchema) => void;
  onDelete: (task: TasksSchema) => void;
};

const TaskPlanningStatusIcons = {
  DEFAULT: <CircleHelpIcon className="h-4 w-4 text-gray-500" />,
  TODO: <Circle className="h-4 w-4 text-gray-500" />,
  IN_PROGRESS: <Timer className="h-4 w-4 text-gray-500" />,
  DONE: <CircleCheck className="h-4 w-4 text-gray-500" />,
  CANCELED: <CircleOffIcon className="h-4 w-4 text-gray-500" />,
};

export default function ManageTasksTable({
  task,
  onEdit,
  onDelete,
}: ManageTasksTableProps) {
  const t = useScopedI18n("tasks");

  const handleDeleteTask = () => {
    onDelete(task);
  };

  const handleAssignUserToTask = (userId: string) => {
    // Update the task with the new user assignment
    const updatedTask = {
      ...task,
      userId: userId === "no-user" ? undefined : userId,
      updatedAt: new Date(),
    };

    onEdit(updatedTask);
  };

  return (
    <TableRow key={task.id}>
      <TableCell>
        <Checkbox />
      </TableCell>
      <TableCell className="overflow-hidden">
        {`TASK-${task.id?.slice(0, 8)}`}
      </TableCell>
      <TableCell className="overflow-hidden">{task.title}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          {Object.keys(TaskPlanningStatusIcons).includes(task.planning_status)
            ? TaskPlanningStatusIcons[
                task.planning_status as keyof typeof TaskPlanningStatusIcons
              ]
            : TaskPlanningStatusIcons.DEFAULT}{" "}
          {capitalizeWords(
            task.planning_status.toString().replaceAll("_", " "),
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          {(() => {
            const priorityIndex = Object.keys(TaskPriority).indexOf(
              task.priority,
            );
            const nElements = Object.keys(TaskPriority).length - 1;
            return priorityIndex > nElements / 2 ? (
              <MoveUp className="h-4 w-4 text-gray-500" />
            ) : priorityIndex < nElements / 2 ? (
              <MoveDown className="h-4 w-4 text-gray-500" />
            ) : (
              <MoveRight className="h-4 w-4 text-gray-500" />
            );
          })()} {capitalizeWords(task.priority.toString().replaceAll("_", " "))}
        </div>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <Ellipsis />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={"bottom"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={() => redirect(`/tasks/${task.id}`)}>
                <Pen />
                {t("edit")}
              </DropdownMenuItem>
              <AssignUserToTask
                trigger={
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <UserPlus />
                    {t("form.placeholder_user")}
                  </DropdownMenuItem>
                }
                title={t("form.placeholder_user")}
                description={t("form.assign_user_description")}
                onConfirmAction={handleAssignUserToTask}
                currentUserId={task.userId}
              />
              <DeleteConfirmDialog
                trigger={
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Trash2 />
                    {t("delete")}
                  </DropdownMenuItem>
                }
                title={t("delete")}
                description={t("confirm_delete")}
                onConfirmAction={() => handleDeleteTask()}
              />
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
