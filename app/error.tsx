'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import { ResetPage } from '../components/ResetPage';


export default function Error({ error, reset }: { error: Error; reset: () => void }) {


  return <ResetPage reset={reset} error={error}/>;
}