import React from 'react';
import DtpArtifactsBaseView from '../shared/DtpArtifactsBaseView';

export default function FaultyDtpArtifactsDashboard({ token, bffHost, onBack }) {
  return (
    <DtpArtifactsBaseView
      token={token}
      bffHost={bffHost}
      onBack={onBack}
      endpoint="/dtp/faulty-artifacts"
      title="Alertas DTP / Falhas em UCs"
      subtitle="Ano Corrente 2025/26"
      accentColor="#c2185b"
    />
  );
}
