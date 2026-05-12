function NoteCardSkeleton() {
  return (
    <div className="flex flex-col p-4 rounded-2xl shadow-md bg-gray-100 animate-pulse">
      <div className="h-5 bg-gray-300 rounded w-3/4 mb-2" />
      <div className="h-5 bg-gray-300 rounded w-1/2 mb-4" />

      <div className="space-y-2 mb-4">
        <div className="h-3.5 bg-gray-200 rounded w-full" />
        <div className="h-3.5 bg-gray-200 rounded w-5/6" />
        <div className="h-3.5 bg-gray-200 rounded w-4/6" />
      </div>

      <div className="flex justify-between items-center mt-auto">
        <div className="h-3 bg-gray-200 rounded w-24" />
        <div className="h-6 w-6 bg-gray-200 rounded-full" />
      </div>
    </div>
  );
}

export default NoteCardSkeleton;
