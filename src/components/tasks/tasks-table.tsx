"use client";

import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { Plus, PlusCircle, Search } from "lucide-react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TaskPlanningStatus,
  TaskPriority,
  type TaskWorkflowStatus,
} from "@/lib/tasks/task-utils";
import { capitalizeWords } from "@/lib/utils";

import { useTRPC } from "@/shared/helpers/trpc/client";
import { useScopedI18n } from "@/shared/locales/client";
import type { TasksSchema } from "@/shared/validators/tasks.schema";
import ManageTasksTable from "./manage-task";

export default function TasksTable() {
  const t = useScopedI18n("tasks");
  const [searchTerm, setSearchTerm] = useState("");
  const [progressionFilter, setProgressionFilter] = useState<
    TaskPlanningStatus | "ALL"
  >("ALL");
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | "ALL">(
    "ALL",
  );
  const limiterOptions = [10, 25, 50];
  const [limiter, setLimiter] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const trpc = useTRPC();
  const { data, refetch } = useSuspenseQuery(
    trpc.tasks.getAll.queryOptions(),
  );
  const tasks: TasksSchema[] = data.map((task) => ({
    ...task,
    userId: task.userId ?? undefined,
    workflow_status: task.workflow_status as TaskWorkflowStatus,
    planning_status: task.planning_status as TaskPlanningStatus,
    priority: task.priority as TaskPriority,
  }));

  const deleteMutation = useMutation(
    trpc.tasks.delete.mutationOptions({
      onSuccess: () => {
        void refetch();
        toast.success(t("delete.success"));
      },
      onError: ({ message }) => {
        toast.error(message);
      },
    }),
  );

  const updateMutation = useMutation(
    trpc.tasks.upsert.mutationOptions({
      onSuccess: () => {
        void refetch();
      },
      onError: ({ message }) => {
        toast.error(message);
      },
    }),
  );

  const searchFilter = (tasks: TasksSchema[]) => {
    return tasks.filter((task) => {
      const title = task.title?.toLowerCase() ?? "";
      const planningStatus = task.planning_status?.toLowerCase() ?? "";
      const priority = task.priority?.toLowerCase() ?? "";

      return (
        title.includes(searchTerm.toLowerCase()) &&
        (progressionFilter === "ALL" ||
          planningStatus === progressionFilter.toLowerCase()) &&
        (priorityFilter === "ALL" || priority === priorityFilter.toLowerCase())
      );
    });
  };

  const filteredTasks: TasksSchema[] = searchFilter(tasks).slice(
    (currentPage - 1) * limiter,
    (currentPage - 1) * limiter + limiter,
  );
  const totalFilteredTasks = filteredTasks.length;

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(totalFilteredTasks / limiter);

    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleEditTask = (task: TasksSchema) => {
    updateMutation.mutate(task, {
      onSuccess: () => {
        toast.success(t("task_assigned_successfully"));
      },
      onError: (error) => {
        toast.error(t("task_assignment_failed"));
        console.error("Error assigning task:", error);
      },
    });
  };

  const handleDeleteTask = (task: TasksSchema) => {
    deleteMutation.mutate({ id: task.id! });
  };

  return (
    <div className="p-4">
      <div className="flex justify-end">
        <Button
          className="mb-4 flex items-center gap-2"
          onClick={() => {
            redirect(`/tasks/${crypto.randomUUID()}`);
          }}
        >
          <Plus className="h-4 w-4" />
          {t("new_task")}
        </Button>
      </div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Search size={20} className="text-muted-foreground absolute ml-2" />
          <Input
            type="text"
            placeholder={t("filter_by_name")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-1/3 pl-8 focus:ring-0"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <PlusCircle className="mr-1" />
                {t("filter_by_status")}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {Object.values(TaskPlanningStatus).map((status) => (
                <DropdownMenuItem
                  key={status}
                  onSelect={() => {
                    progressionFilter === status
                      ? setProgressionFilter("ALL")
                      : setProgressionFilter(status);
                  }}
                >
                  {capitalizeWords(status.toString().replaceAll("_", " "))}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <PlusCircle className="mr-1" />
                {t("filter_by_priority")}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {Object.values(TaskPriority).map((priority) => (
                <DropdownMenuItem
                  key={priority}
                  onSelect={() => {
                    priorityFilter === priority
                      ? setPriorityFilter("ALL")
                      : setPriorityFilter(priority);
                  }}
                >
                  {capitalizeWords(priority.toString().replaceAll("_", " "))}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center justify-end">
          <span className="pr-4 text-sm text-gray-500">
            {t("table.n_items")}
          </span>
          <div className="flex gap-2">
            <Select
              value={limiter.toString()}
              onValueChange={(value) => {
                setLimiter(parseInt(value, 10));
                setCurrentPage(1);
              }}
              defaultValue={limiter.toString()}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent side="bottom">
                {limiterOptions.map((option) => (
                  <SelectItem key={option} value={option.toString()}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="w-full overflow-hidden">
        <Table className="mb-4 table-fixed w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/30"></TableHead>
              <TableHead className="w-1/10">{t("table.task")}</TableHead>
              <TableHead className="w-4/10">{t("table.title")}</TableHead>
              <TableHead className="w-1/10">
                {t("table.planning_status")}
              </TableHead>
              <TableHead className="w-1/10">{t("table.priority")}</TableHead>
              <TableHead className="w-1/30"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.map((task) => (
              <ManageTasksTable
                key={task.id}
                task={task}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between pt-4 text-sm text-gray-500">
        <span>
          {t("table.showing_range", {
            start: Math.min(
              Math.max(currentPage - 1, 0) * limiter + 1,
              totalFilteredTasks,
            ),
            end: Math.min(currentPage * limiter, totalFilteredTasks),
            max: totalFilteredTasks,
          })}
        </span>
        <div className="flex gap-2">
          <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
            {t("table.previous")}
          </Button>
          <Button
            onClick={handleNextPage}
            disabled={currentPage === Math.ceil(totalFilteredTasks / limiter)}
          >
            {t("table.next")}
          </Button>
        </div>
      </div>
    </div>
  );
}
