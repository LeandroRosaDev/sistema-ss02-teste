export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      <span className="ml-3 text-gray-700 text-lg font-medium">
        Carregando...
      </span>
    </div>
  );
}
