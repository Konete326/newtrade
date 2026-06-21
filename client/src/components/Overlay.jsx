import { useApp } from '../context/AppContext';

export default function Overlay() {
  const { sidebarToggle, setSidebarToggle } = useApp();

  if (!sidebarToggle) return null;

  return (
    <div
      className="fixed z-9 h-screen w-full bg-gray-900/50 lg:hidden"
      onClick={() => setSidebarToggle(false)}
    />
  );
}
