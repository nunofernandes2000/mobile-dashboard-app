import React, { useState, useEffect, useMemo } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { Checkbox } from 'react-native-paper';
import {
  Card,
  CardContent,
  StatCard,
  Badge,
  Button,
  LoadingState,
  SkeletonList,
  EmptyState,
  ErrorCard,
  Header,
} from '../../ui';

export default function PedagogicoDashboard({ token, bffHost, onBack }) {
  const [selectedSchool, setSelectedSchool] = useState('ALL');
  const [groupUc, setGroupUc] = useState(true);
  const [groupDocente, setGroupDocente] = useState(true);
  const [groupSala, setGroupSala] = useState(false);


  const [studentsData, setStudentsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSimulated, setIsSimulated] = useState(false);

  const SCHOOLS = [
    { code: 'IPP', name: 'Instituto Politécnico de Portalegre', param: null },
    { code: 'ESTGD', name: 'Escola Superior de Tecnologia, Gestão e Design', param: 'ESTGD' },
    { code: 'ESECS', name: 'Escola Superior de Educação e Ciências Sociais', param: 'ESECS' },
    { code: 'ESBE', name: 'Escola Superior de Biociências de Elvas', param: 'ESBE' },
    { code: 'ESSP', name: 'Escola Superior de Saúde de Portalegre', param: 'ESSP' },
  ];

  const fetchStudentValue = async (queryParams) => {
    try {
      const qs = new URLSearchParams(queryParams).toString();
      const url = `${bffHost}/kpis/pedagogico/students?${qs}`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) return { value: null, simulated: true };
      const data = await res.json();

      const val =
        data.result?.alertValueFloat ??
        (data.result?.alertValueStr ? parseFloat(data.result.alertValueStr) : null);

      return { value: val, simulated: data.simulated };
    } catch (e) {
      return { value: null, simulated: true };
    }
  };

  const fetchTimelineValues = async (queryParams) => {
    try {
      const qs = new URLSearchParams(queryParams).toString();
      const url = `${bffHost}/kpis/pedagogico/students/timeline?${qs}`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) return { values: [], simulated: true };
      const data = await res.json();

      const alerts = data.result?.alerts || data.result?.entities || [];
      if (!Array.isArray(alerts)) return { values: [], simulated: false };

      const values = alerts.map((item) => {
        let period = item.observationDate || item.showDate || 'Ano';

        if (item.description) {
          const match = item.description.match(/20\d{2}\/\d{2}/);
          if (match) period = match[0];
        }

        if (period.includes('-')) {
          const [year, month] = period.split('-');
          const y = parseInt(year);
          if (month === '12' || month === '01' || month === '02') {
            period = `${y}/${String(y + 1).slice(2)}`;
          } else {
            period = `${y - 1}/${String(y).slice(2)}`;
          }
        }

        return {
          period,
          value: item.alertValueFloat ?? (item.alertValueStr ? parseFloat(item.alertValueStr) : null),
        };
      });
      return { values, simulated: data.simulated };
    } catch (e) {
      return { values: [], simulated: true };
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const groups = [];
      if (groupUc) groups.push('Unidade');
      if (groupDocente) groups.push('Docente');
      if (groupSala) groups.push('Sala');
      const groupParam = groups.length > 0 ? groups.join(',') : undefined;

      const schoolPromises = SCHOOLS.map(async (school) => {
        const cardParams = { group: groupParam || 'Unidade,Docente' };
        if (school.param) cardParams.school = school.param;

        const timelineParams = { ...cardParams };
        if (groupParam) timelineParams.group = groupParam;

        const [anual, s1, s2, timeline] = await Promise.all([
          fetchStudentValue({ ...cardParams }),
          fetchStudentValue({ ...cardParams, semester: 'S1' }),
          fetchStudentValue({ ...cardParams, semester: 'S2A' }),
          fetchTimelineValues({ ...timelineParams }),
        ]);

        let mAnual = anual.value;
        let mS1 = s1.value;
        let mS2 = s2.value;

        if (mAnual == null && mS1 != null) mAnual = mS1;
        if (mS1 == null && mAnual != null) mS1 = mAnual;

        if (school.code === 'ESTGD' && mAnual == null) {
          const rawEstgd = await fetchStudentValue({ school: 'ESTGD', semester: 'S1', group: 'Unidade,Docente' });
          if (rawEstgd.value != null) {
            mAnual = rawEstgd.value;
            mS1 = rawEstgd.value;
          }
        }

        if (school.code === 'IPP' && mAnual == null) {
          const rawIpp = await fetchStudentValue({ group: 'Unidade,Docente' });
          if (rawIpp.value != null) {
            mAnual = rawIpp.value;
            if (mS1 == null) mS1 = rawIpp.value;
          }
        }

        return {
          code: school.code,
          name: school.name,
          mediaAnual: mAnual,
          mediaS1: mS1,
          mediaS2: mS2,
          timeline: timeline.values,
          simulated: anual.simulated && s1.simulated && s2.simulated && timeline.simulated,
        };
      });

      const results = await Promise.all(schoolPromises);
      setStudentsData(results);
      setIsSimulated(results.some((r) => r.simulated));
    } catch (err) {
      console.error('Erro ao carregar dados pedagógicos:', err);
      setError('Não foi possível carregar as métricas dos inquéritos pedagógicos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [groupUc, groupDocente, groupSala]);

  const ippOverall = useMemo(() => {
    if (!studentsData) return null;
    return studentsData.find((s) => s.code === 'IPP');
  }, [studentsData]);

  const filteredSchools = useMemo(() => {
    if (!studentsData) return [];
    if (selectedSchool === 'ALL') {
      return studentsData.filter((s) => s.code !== 'IPP');
    }
    return studentsData.filter((s) => s.code === selectedSchool);
  }, [studentsData, selectedSchool]);

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <Header
        title="Inquéritos Pedagógicos"
        subtitle="Satisfação dos Estudantes"
        onBack={onBack}
        rightIcon="refresh"
        onRightAction={fetchData}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
      >
        {isSimulated && (
          <Badge variant="warning" icon="information-outline" size="sm" className="mb-3 self-start">
            Modo de demonstração (Dados simulados de Inquéritos)
          </Badge>
        )}

        {ippOverall && (
          <Card className="mb-4 bg-primary/10 border border-primary/30">
            <CardContent className="p-4 items-center">
              <Text className="text-xs font-bold uppercase tracking-wider text-primary">
                Índice Global IPP (Escala 1 a 6)
              </Text>
              <Text className="text-4xl font-bold text-slate-900 dark:text-white my-1">
                {ippOverall.mediaAnual != null ? ippOverall.mediaAnual.toFixed(2) : '-'}
              </Text>
              <View className="flex-row gap-4 mt-2">
                <Text className="text-xs text-muted dark:text-muted-dark">
                  1º Semestre:{' '}
                  <Text className="font-bold text-slate-800 dark:text-slate-200">
                    {ippOverall.mediaS1 != null ? ippOverall.mediaS1.toFixed(2) : '-'}
                  </Text>
                </Text>
                <Text className="text-xs text-muted dark:text-muted-dark">
                  2º Semestre:{' '}
                  <Text className="font-bold text-slate-800 dark:text-slate-200">
                    {ippOverall.mediaS2 != null ? ippOverall.mediaS2.toFixed(2) : '-'}
                  </Text>
                </Text>
              </View>
            </CardContent>
          </Card>
        )}

        <Card className="mb-4">
          <CardContent className="p-3.5">
            <Text className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
              Dimensões Avaliadas
            </Text>
            <View className="flex-row flex-wrap gap-4">
              <TouchableOpacity
                onPress={() => setGroupUc(!groupUc)}
                className="flex-row items-center"
              >
                <Checkbox status={groupUc ? 'checked' : 'unchecked'} color="#ff9800" />
                <Text className="text-xs font-medium text-slate-800 dark:text-slate-200 ml-1">
                  Unidade Curricular
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setGroupDocente(!groupDocente)}
                className="flex-row items-center"
              >
                <Checkbox status={groupDocente ? 'checked' : 'unchecked'} color="#ff9800" />
                <Text className="text-xs font-medium text-slate-800 dark:text-slate-200 ml-1">
                  Docente
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setGroupSala(!groupSala)}
                className="flex-row items-center"
              >
                <Checkbox status={groupSala ? 'checked' : 'unchecked'} color="#ff9800" />
                <Text className="text-xs font-medium text-slate-800 dark:text-slate-200 ml-1">
                  Sala / Espaço
                </Text>
              </TouchableOpacity>
            </View>
          </CardContent>
        </Card>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-4"
          contentContainerStyle={{ flexDirection: 'row', gap: 6 }}
        >
          <Badge
            variant={selectedSchool === 'ALL' ? 'default' : 'secondary'}
            size="sm"
            onPress={() => setSelectedSchool('ALL')}
          >
            Todas as Escolas
          </Badge>
          {SCHOOLS.filter((s) => s.code !== 'IPP').map((s) => (
            <Badge
              key={s.code}
              variant={selectedSchool === s.code ? 'default' : 'secondary'}
              size="sm"
              onPress={() => setSelectedSchool(s.code)}
            >
              {s.code}
            </Badge>
          ))}
        </ScrollView>

        {loading ? (
          <SkeletonList count={3} />
        ) : error ? (
          <ErrorCard message={error} onRetry={fetchData} />
        ) : filteredSchools.length === 0 ? (
          <EmptyState
            icon="chart-bar"
            title="Nenhum dado pedagógico"
            description="Não existem registos de inquéritos disponíveis para a escola selecionada."
          />
        ) : (
          <View className="gap-3">
            {filteredSchools.map((s, sIndex) => (
              <Card key={s.code ? `pedagogico-${s.code}` : `pedagogico-idx-${sIndex}`}>
                <CardContent className="p-4">
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-1 mr-2">
                      <Badge variant="default" size="sm" className="self-start mb-1">
                        {s.code}
                      </Badge>
                      <Text className="font-bold text-sm text-slate-900 dark:text-white">
                        {s.name}
                      </Text>
                    </View>
                    <View className="items-end bg-primary/15 px-3 py-1.5 rounded-xl">
                      <Text className="text-xl font-bold text-primary">
                        {s.mediaAnual != null ? s.mediaAnual.toFixed(2) : '-'}
                      </Text>
                      <Text className="text-[9px] font-bold text-muted dark:text-muted-dark uppercase">
                        Média Global
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row justify-between pt-2 border-t border-border dark:border-border-dark">
                    <Text className="text-xs text-muted dark:text-muted-dark">
                      1º Semestre:{' '}
                      <Text className="font-bold text-slate-800 dark:text-slate-200">
                        {s.mediaS1 != null ? s.mediaS1.toFixed(2) : '-'}
                      </Text>
                    </Text>
                    <Text className="text-xs text-muted dark:text-muted-dark">
                      2º Semestre:{' '}
                      <Text className="font-bold text-slate-800 dark:text-slate-200">
                        {s.mediaS2 != null ? s.mediaS2.toFixed(2) : '-'}
                      </Text>
                    </Text>
                  </View>
                </CardContent>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
