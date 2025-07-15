'use client';

export function ResetPage({ reset, error }: { reset: () => void; error?: Error }) {
  return (
    <div>
      <h1>Something went wrong!</h1>
      <h2> {error?.message || 'Unknown error'} </h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}