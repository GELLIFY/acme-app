import TasksForm from "@/components/tasks/create-tasks-form";
import { getQueryClient, trpc } from "@/shared/helpers/trpc/server";

export default async function TaskPage() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(trpc.user.get.queryOptions());

  return (
    <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      <TasksForm />
    </div>
  );
}
