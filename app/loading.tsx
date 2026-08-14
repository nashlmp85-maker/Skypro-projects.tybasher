export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-center">
        <div className="h-6 w-48 bg-slate-200 rounded mb-3" />
        <div className="h-6 w-32 bg-slate-200 rounded" />
      </div>
    </div>
  )
}
