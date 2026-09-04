import React from 'react';
import DtpArtifactsBaseView from '../shared/DtpArtifactsBaseView';

export default function FaultyDtpArtifactsPrevYearDashboard({ token, bffHost, onBack }) {
  return (
    <DtpArtifactsBaseView
      token={token}
      bffHost={bffHost}
      onBack={onBack}
      endpoint="/dtp/faulty-artifacts-prev-year"
      title="Alertas DTP (Ano Anterior)"
      subtitle="Ano Letivo 2024/25"
      accentColor="#6a1b9a"
    />
  );
}
