import { type RenderOptions, render } from "@testing-library/react";
import { ThemeProvider } from "next-themes";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import type React from "react";
import type { ReactElement } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TRPCReactProvider } from "@/infrastructure/trpc/client";
import { I18nProviderClient } from "@/shared/locales/client";

// const url = `http://localhost:3000/api/trpc`;

// const queryClientMocked = new QueryClient({
//   defaultOptions: {
//     queries: { staleTime: Infinity },
//   },
// });

// const trpcClientMocked = createTRPCClient<AppRouter>({
//   links: [httpLink({ transformer: superjson, url })],
// });

// const MockedTRPCProvider = (props: { children: React.ReactNode }) => {
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
