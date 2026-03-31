interface SyncingLoaderProps {
  title?: string;
  message?: string;
}

export default function SyncingLoader({
  title = "Loading quiz",
  message = "Please wait a moment.",
}: SyncingLoaderProps) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 font-mono text-teal-400">
      <div className="text-center">
        <div className="inline-block border-4 border-teal-400 p-4 mb-6 animate-pulse">
          <h2 className="text-5xl font-black uppercase italic tracking-tighter">
            {title}
          </h2>
        </div>
        <div className="flex justify-center gap-2">
          <div className="w-4 h-4 bg-teal-400 animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-4 h-4 bg-teal-400 animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-4 h-4 bg-teal-400 animate-bounce"></div>
        </div>
        <p className="mt-8 text-xs font-black uppercase tracking-widest opacity-50">
          {message}
        </p>
      </div>
    </div>
  );
}
