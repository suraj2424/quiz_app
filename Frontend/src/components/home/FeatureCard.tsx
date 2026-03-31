export default function FeatureCard({ feature }: any) {
  return (
    <div className="group relative">
      {/* Background Shadow Layer - Teal glow in dark mode */}
      <div className="absolute inset-0 bg-black dark:bg-teal-500/50 translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-all" />
      
      {/* Content Layer */}
      <div className="relative bg-white dark:bg-[#1a1a2e] border-[4px] border-black p-8 h-full flex flex-col transition-all">
        {/* Icon Box - Keeps its unique color but gets a white shadow in dark mode */}
        <div className={`w-16 h-16 ${feature.color} border-[3px] border-black flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]`}>
          <div className="text-black">
            {feature.icon}
          </div>
        </div>

        <h3 className="text-2xl font-black uppercase mb-4 tracking-tighter text-black dark:text-white">
          {feature.title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 font-bold leading-tight mb-6 flex-1">
          {feature.description}
        </p>

        {/* Stats Badge */}
        <div className="mt-auto inline-flex items-center gap-2 bg-gray-100 dark:bg-black border-[2px] border-black px-3 py-1 self-start">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse border-[1px] border-black" />
          <span className="text-[10px] font-black uppercase tracking-widest text-black dark:text-teal-400">
            {feature.stats}
          </span>
        </div>
      </div>
    </div>
  );
}