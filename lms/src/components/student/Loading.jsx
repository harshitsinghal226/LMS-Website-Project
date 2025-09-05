import React, { memo } from "react";

const Loading = memo(() => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
        <p className="text-emerald-600 font-medium">Loading...</p>
      </div>
    </div>
  );
});

Loading.displayName = 'Loading';

export default Loading;
