import Leftmenu from "@/sharedComponent/Leftmenu";

export default function ClientLayout({ children }) {
  return (
    <div className="flex h-dvh max-h-dvh flex-col overflow-hidden bg-[#f4f6f8] lg:flex-row">
      <Leftmenu />
      <div className="min-h-0 min-w-0 flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
