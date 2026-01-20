export function Button({ children, onClick, type = "button", className = "", disabled = false, variant = "default" }) {
  const baseStyles = "px-4 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg";
  const variants = {
    default: "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500",
    outline: "border-2 border-gray-300 bg-white text-gray-900 hover:border-blue-500 hover:bg-blue-50 disabled:border-gray-200 disabled:bg-gray-50",
    destructive: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500",
  };

  const styles = `${baseStyles} ${variants[variant]} ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`;

  return (
    <button type={type} onClick={onClick} className={`${styles} ${className}`} disabled={disabled}>
      {children}
    </button>
  );
}
