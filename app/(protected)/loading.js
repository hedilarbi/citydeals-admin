const LoadingSkeleton = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="space-y-6 text-center">
        <div className="flex items-center justify-center gap-2 text-pr">
          <div className="w-3 h-3 bg-pr rounded-full animate-bounce" />
          <div className="w-3 h-3 bg-pr-light rounded-full animate-bounce [animation-delay:0.1s]" />
          <div className="w-3 h-3 bg-pr-dark rounded-full animate-bounce [animation-delay:0.2s]" />
        </div>
        <div className="bg-white border border-light-gray rounded-3xl shadow-sm px-10 py-8">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
            CityDeals admin
          </p>
          <h2 className="text-2xl font-semibold text-gray-900 mt-3">
            Chargement
          </h2>
          <p className="text-sm text-gray-500 mt-2 max-w-md">
            Nous préparons vos données et l’environnement sécurisé. Merci de
            patienter quelques instants.
          </p>
          <div className="mt-6">
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-pr via-pr-light to-pr-dark animate-pulse rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
