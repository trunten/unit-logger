import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "Unit Logger",
  description: "A private, simple daily drinks unit log.",
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#0d1714",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#b9f26b",
          colorBackground: "#13221d",
          colorInputBackground: "#0d1916",
          colorInputText: "#edf6f1",
          borderRadius: "13px",
          fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        },
        elements: {
          modalBackdrop: "unitClerkBackdrop",
          modalContent: "unitClerkModal",
          card: "unitClerkCard",
          headerTitle: "unitClerkHeaderTitle",
          headerSubtitle: "unitClerkHeaderSubtitle",
          socialButtonsBlockButton: "unitClerkSocialButton",
          socialButtonsBlockButtonText: "unitClerkSocialButtonText",
          dividerLine: "unitClerkDividerLine",
          dividerText: "unitClerkDividerText",
          formFieldLabel: "unitClerkLabel",
          formFieldInput: "unitClerkInput",
          formButtonPrimary: "unitClerkPrimary",
          footerActionLink: "unitClerkLink",
          identityPreviewEditButton: "unitClerkLink",
        },
      }}
    >
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
