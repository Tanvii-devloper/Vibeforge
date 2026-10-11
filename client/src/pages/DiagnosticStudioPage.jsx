import React from 'react';
import { useSearchParams } from 'react-router-dom';
import DiagnosticStudio from '../components/DiagnosticStudio';

export default function DiagnosticStudioPage() {
  const [searchParams] = useSearchParams();
  const fieldId = searchParams.get('fieldId') ? parseInt(searchParams.get('fieldId'), 10) : undefined;
  const cropType = searchParams.get('cropType') || undefined;

  return (
    <div className="py-2">
      <DiagnosticStudio initialFieldId={fieldId} initialCropType={cropType} />
    </div>
  );
}
