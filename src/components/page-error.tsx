import React from 'react'
import { CenteredGradientCard } from './centered-gradient-card';
import { AlertTriangle } from 'lucide-react';

export default function PageError() {
  return (
       <CenteredGradientCard error>
         <AlertTriangle className="h-12 w-12 text-red-500 dark:text-red-400" />
         <p className="font-medium text-red-700 dark:text-red-300">
           Failed to load products
         </p>
       </CenteredGradientCard>
     );
}
