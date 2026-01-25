import { SocketProvider } from "@/lib/socket";

export default function DiaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SocketProvider>{children}</SocketProvider>;
}
