interface ActionButtonProps {
  icon: 'review' | 'dashboard';
  label: string;
  onClick: () => void;
}

const ActionButton = ({ icon, label, onClick }: ActionButtonProps) => {
  const icons = {
    review: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    dashboard: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
        <path d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  };

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center p-6 bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-amber-50 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all group"
    >
      <div className="mb-3 p-3 bg-teal-400 border-2 border-black group-hover:bg-teal-300">
        {icons[icon]}
      </div>
      <span className="font-black uppercase italic text-sm tracking-tight">{label}</span>
    </button>
  );
};

export default ActionButton;