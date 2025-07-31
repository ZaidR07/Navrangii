import React from 'react'
import { CenteredGradientCard } from './centered-gradient-card';
import { Loader2 } from 'lucide-react';

export default function PageLoading() {
  return (
      <CenteredGradientCard>
        <Loader2 className="h-12 w-12 animate-spin text-purple-600 dark:text-purple-400" />
        <p className="font-medium text-purple-700 dark:text-purple-300">
          Loading products…
        </p>
      </CenteredGradientCard>
    );
}
