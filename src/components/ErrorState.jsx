const ErrorState = ({ title = "Something went wrong", description }) => {
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
      <h3 className="text-base font-semibold">{title}</h3>
      {description && <p className="mt-1 text-sm text-rose-600">{description}</p>}
    </div>
  );
};

export default ErrorState;
