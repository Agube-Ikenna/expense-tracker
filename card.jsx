export function Card({ children, className = "" }) {
  return (
    <div className={`rounded-xl border border-gray-100 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = "" }) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}
