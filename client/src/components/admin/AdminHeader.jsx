export default function AdminHeader({ title, action }) {
  return (
    <div className="h-[52px] bg-white border-b border-[#E2DFD8] flex items-center px-6 gap-3 sticky top-0 z-10">
      <h1 className="text-[15px] font-semibold flex-1">{title}</h1>
      {action}
    </div>
  );
}
