import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type RenderOptions, render } from "@testing-library/react";
import { createTRPCClient, httpBatchStreamLink } from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import { ThemeProvider } from "next-themes";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import type React from "react";
import type { ReactElement } from "react";
import superjson from "superjson";
import { Toaster } from "@/components/ui/sonner";
import type { AppRouter } from "@/server/api/trpc/routers/_app";
import { TRPCProvider, TRPCReactProvider } from "@/shared/helpers/trpc/client";
import { I18nProviderClient } from "@/shared/locales/client";

// const { TRPCProvider } = createTRPCContext<AppRouter>();

// const trpcClientMocked = createTRPCClient<AppRouter>({
//   links: [
//     httpBatchStreamLink({
//       transformer: superjson,
//       url: `http://localhost:3000/api/trpc`,
//       headers: () => {
//         const headers = new Headers();
//         headers.set("x-trpc-source", "nextjs-react");
//         return headers;
//       },
//     }),
//   ],
// });

// const mockedTRPCClient = mockedTRPC. .createClient({
//   transformer: superjson,
//   links: [httpLink({ url: "http://localhost:3000/api/trpc", fetch })],
// });

// const queryClientMocked = new QueryClient();

// export const MockedTRPCProvider = (props: { children: React.ReactNode }) => {
//   return (
//     <QueryClientProvider client={queryClientMocked}>
//       <TRPCProvider
//         trpcClient={trpcClientMocked}
//         queryClient={queryClientMocked}
//       >
//         {props.children}
//       </TRPCProvider>
//     </QueryClientProvider>
//   );
// };

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <TRPCReactProvider>
      <I18nProviderClient locale="it">
        <NuqsTestingAdapter>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </NuqsTestingAdapter>
      </I18nProviderClient>
    </TRPCReactProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
