export default function LoadingScreen({ label = "Carregando..." }) {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-colgate-red border-t-transparent" />
        <p className="text-sm font-medium text-gray-500">{label}</p>
      </div>
    </div>
  );
}
