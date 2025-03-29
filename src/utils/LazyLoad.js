// // utils/lazyLoad.js
// import React, { lazy, Suspense } from 'react';

// // Default loading component
// const DefaultFallback = () => (
//   <div className="flex justify-center items-center py-8">
//     <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
//   </div>
// );

// /**
//  * Creates a lazy loaded component with a custom fallback
//  * @param {Function} importFunction - The dynamic import function
//  * @param {JSX.Element} [Fallback=DefaultFallback] - Custom fallback component
//  * @returns {JSX.Element} Lazy loaded component with suspense
//  */
// export const lazyLoad = (importFunction, Fallback = DefaultFallback) => {
//   const LazyComponent = lazy(importFunction);
  
//   return (props) => (
//     <Suspense fallback={<Fallback />}>
//       <LazyComponent {...props} />
//     </Suspense>
//   );
// };

// // Example usage: 
// // const LazyFooter = lazyLoad(() => import('../components/Footer'));
// // Then use <LazyFooter /> in your components