import {
  ClerkProvider,
} from "@clerk/nextjs";
import "./globals.css";
import Header from "./components/header";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
        <Header />
          {children}
          </ClerkProvider>
      </body>
    </html>
  );
}
