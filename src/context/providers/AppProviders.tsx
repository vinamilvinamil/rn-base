import type { PropsWithChildren } from "react";
import { AppBootstrap } from "../bootstrap/AppBootstrap";
import { ThemeProvider } from "./ThemeProvider";
export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ThemeProvider>
      <AppBootstrap>{children}</AppBootstrap>
    </ThemeProvider>
  );
}
