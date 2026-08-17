import Leftmenu from "@/sharedComponent/Leftmenu";

export default function ClientLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f4f6f8] lg:flex-row">
      <Leftmenu />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
