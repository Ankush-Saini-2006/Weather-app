/**
 * ErrorMessage
 * Displays a dismissible, accessible error banner. Used for invalid city
 * searches, network failures, or geolocation denials.
 */
const ErrorMessage = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="w-full max-w-2xl mx-auto mt-4 flex items-center justify-between gap-3 rounded-2xl bg-red-500/90 dark:bg-red-600/90 backdrop-blur-md px-5 py-4 text-white shadow-lg animate-slide-up border border-red-300/30"
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">⚠️</span>
        <p className="text-sm sm:text-base font-medium">{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          aria-label="Dismiss error"
          className="flex-shrink-0 rounded-full p-1.5 hover:bg-white/20 transition-colors duration-200"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
