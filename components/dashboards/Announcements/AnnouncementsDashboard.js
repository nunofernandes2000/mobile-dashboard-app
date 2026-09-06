import React, { useState, useEffect, useMemo } from 'react';
import { View, Linking, Text, ScrollView } from 'react-native';
import { Icon } from 'react-native-paper';
import { normalizeStr, cleanFormattedText } from '../../../utils/text';
import {
  Card,
  CardContent,
  StatCard,
  Badge,
  SearchInput,
  Button,
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
  SkeletonList,
  EmptyState,
  ErrorCard,
  ScreenContainer,
} from '../../ui';

export default function AnnouncementsDashboard({ token, bffHost, onBack }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [isMock, setIsMock] = useState(false);

  const [searchText, setSearchText] = useState('');
  const [selectedUc, setSelectedUc] = useState('ALL');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [selectedYear, setSelectedYear] = useState('CURRENT');

  useEffect(() => {
    fetchAnnouncements();
  }, [selectedYear]);

  const fetchAnnouncements = async () => {
    setLoading(true);
    setError(null);
    try {
      const url =
        selectedYear === 'CURRENT'
          ? `${bffHost}/announcements`
          : `${bffHost}/announcements?year=${selectedYear}`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error(`Erro na API (${response.status})`);
      }
      const data = await response.json();
      setAnnouncements(data.announcements || []);
      setIsMock(!!data.isMock);
    } catch (err) {
      console.error('Erro ao carregar anúncios de UCs:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const uniqueUcs = useMemo(() => {
    const ucSet = new Map();
    announcements.forEach((item) => {
      const meta = item.metadata || {};
      const code = meta.ucCode || item.code;
      const name = meta.ucName || item.name;
      if (code && !ucSet.has(code)) {
        ucSet.set(code, name);
      }
    });
    return Array.from(ucSet.entries()).map(([code, name]) => ({ code, name }));
  }, [announcements]);

  const filteredAnnouncements = useMemo(() => {
    return announcements
      .filter((item) => {
        const meta = item.metadata || {};
        const name = item.name || '';
        const title = meta.announcementTitle || '';
        const text = meta.announcementText || '';
        const teacher = meta.personName || '';
        const ucName = meta.ucName || '';
        const ucCode = meta.ucCode || '';

        if (searchText) {
          const query = normalizeStr(searchText);
          const matchName = normalizeStr(name).includes(query);
          const matchTitle = normalizeStr(title).includes(query);
          const matchText = normalizeStr(cleanFormattedText(text)).includes(query);
          const matchTeacher = normalizeStr(teacher).includes(query);
          const matchUc = normalizeStr(ucName).includes(query) || normalizeStr(ucCode).includes(query);
          if (!matchName && !matchTitle && !matchText && !matchTeacher && !matchUc) {
            return false;
          }
        }

        if (selectedUc !== 'ALL' && ucCode !== selectedUc) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const dateA = new Date(a.metadata?.announcementDate || a.timestamp || 0).getTime();
        const dateB = new Date(b.metadata?.announcementDate || b.timestamp || 0).getTime();
        return dateB - dateA;
      });
  }, [announcements, searchText, selectedUc]);

  const metrics = useMemo(() => {
    return {
      total: announcements.length,
      ucsCount: uniqueUcs.length,
    };
  }, [announcements, uniqueUcs]);

  return (
    <ScreenContainer
      title="Anúncios de UCs"
      subtitle="Notificações e Avisos"
      onBack={onBack}
      rightIcon="refresh"
      onRightAction={fetchAnnouncements}
      onRefresh={fetchAnnouncements}
      refreshing={loading}
      extra={
        <Dialog visible={!!selectedAnnouncement} onDismiss={() => setSelectedAnnouncement(null)}>
          {selectedAnnouncement && (() => {
            const meta = selectedAnnouncement.metadata || {};
            const plainText = cleanFormattedText(meta.announcementText || selectedAnnouncement.obs || '');

            return (
              <>
                <DialogHeader onClose={() => setSelectedAnnouncement(null)}>
                  <Badge variant="default" size="sm" className="mb-1">
                    Anúncio de UC
                  </Badge>
                  <DialogTitle numberOfLines={2}>
                    {meta.announcementTitle || selectedAnnouncement.name}
                  </DialogTitle>
                </DialogHeader>

                <DialogContent scrollable>
                  <Text className="text-xs font-bold text-muted dark:text-muted-dark uppercase tracking-wider">
                    Unidade Curricular
                  </Text>
                  <Text className="font-bold text-sm text-primary mb-3">
                    {meta.ucName} ({meta.ucCode}) — {meta.courseName}
                  </Text>

                  <Text className="text-xs font-bold text-muted dark:text-muted-dark uppercase tracking-wider">
                    Publicado por
                  </Text>
                  <Text className="text-xs text-slate-800 dark:text-slate-200 mb-3">
                    {meta.personName || 'Docente'} ({meta.personEmail || selectedAnnouncement.email || 'Sem email'}) — {meta.announcementDate || 'N/D'}
                  </Text>

                  <Text className="text-xs font-bold text-muted dark:text-muted-dark uppercase tracking-wider mb-1">
                    Conteúdo do Anúncio
                  </Text>
                  <View className="bg-slate-50 dark:bg-slate-900 rounded-xl p-3.5 border border-border dark:border-border-dark my-1">
                    <Text className="text-sm text-slate-900 dark:text-white leading-relaxed">
                      {plainText}
                    </Text>
                  </View>
                </DialogContent>

                <DialogFooter>
                  {selectedAnnouncement.url && (
                    <Button
                      variant="default"
                      size="sm"
                      icon="open-in-new"
                      onPress={() => Linking.openURL(selectedAnnouncement.url)}
                    >
                      Abrir no Moodle / PAE
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onPress={() => setSelectedAnnouncement(null)}>
                    Fechar
                  </Button>
                </DialogFooter>
              </>
            );
          })()}
        </Dialog>
      }
    >
        {isMock && (
          <Badge variant="warning" icon="information-outline" size="sm" className="mb-3 self-start">
            Modo de demonstração ativado (Anúncios simulados de UCs)
          </Badge>
        )}

        <View className="flex-row justify-between gap-2.5 mb-4">
          <View className="flex-1">
            <StatCard
              icon="bullhorn-variant-outline"
              title="Total de Anúncios"
              value={metrics.total}
              color="primary"
            />
          </View>
          <View className="flex-1">
            <StatCard
              icon="book-open-page-variant"
              title="UCs com Avisos"
              value={metrics.ucsCount}
              color="info"
            />
          </View>
        </View>

        <SearchInput
          placeholder="Pesquisar anúncio, UC, docente..."
          value={searchText}
          onChangeText={setSearchText}
          className="mb-3"
        />

        <View className="mb-3">
          <Text className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
            Ano Letivo
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            {[
              { label: 'Atual (2025/26)', value: 'CURRENT' },
              { label: '2024/25', value: '202425' },
              { label: '2023/24', value: '202324' },
            ].map((year) => (
              <Badge
                key={year.value}
                variant={selectedYear === year.value ? 'default' : 'secondary'}
                size="md"
                onPress={() => setSelectedYear(year.value)}
                className="mr-2"
              >
                {year.label}
              </Badge>
            ))}
          </ScrollView>
        </View>

        {uniqueUcs.length > 0 && (
          <View className="mb-3">
            <Text className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
              Filtrar por UC
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
              <Badge
                variant={selectedUc === 'ALL' ? 'default' : 'secondary'}
                size="md"
                onPress={() => setSelectedUc('ALL')}
                className="mr-2"
              >
                Todas ({announcements.length})
              </Badge>
              {uniqueUcs.map((uc) => {
                const count = announcements.filter(
                  (a) => (a.metadata?.ucCode || a.code) === uc.code
                ).length;
                return (
                  <Badge
                    key={uc.code}
                    variant={selectedUc === uc.code ? 'default' : 'secondary'}
                    size="md"
                    onPress={() => setSelectedUc(uc.code)}
                    className="mr-2"
                  >
                    {uc.name} ({count})
                  </Badge>
                );
              })}
            </ScrollView>
          </View>
        )}

        {loading ? (
          <SkeletonList count={3} />
        ) : error ? (
          <ErrorCard message={error} onRetry={fetchAnnouncements} />
        ) : filteredAnnouncements.length === 0 ? (
          <EmptyState
            icon="bullhorn-outline"
            title="Nenhum anúncio encontrado"
            description="Não existem anúncios disponíveis para os filtros selecionados."
            actionLabel={searchText || selectedUc !== 'ALL' ? 'Limpar Filtros' : undefined}
            onAction={() => {
              setSearchText('');
              setSelectedUc('ALL');
            }}
          />
        ) : (
          <View className="gap-3">
            {filteredAnnouncements.map((item, itemIndex) => {
              const meta = item.metadata || {};
              const plainText = cleanFormattedText(meta.announcementText || item.obs || '');

              return (
                <Card
                  key={meta.announcementId ? `ann-${meta.announcementId}` : (item.code ? `ann-code-${item.code}-${itemIndex}` : `ann-idx-${itemIndex}`)}
                  onPress={() => setSelectedAnnouncement(item)}
                >
                  <CardContent className="p-4">
                    <View className="flex-row items-center mb-2">
                      <View className="w-10 h-10 rounded-xl bg-primary/15 items-center justify-center mr-3">
                        <Icon source="bullhorn-variant-outline" size={20} color="#f57c00" />
                      </View>
                      <View className="flex-1 mr-2">
                        <Text className="font-bold text-sm text-slate-900 dark:text-white">
                          {meta.announcementTitle || item.name}
                        </Text>
                        <Text className="text-xs font-bold text-primary-dark dark:text-primary-light">
                          {meta.ucName || 'UC'} ({meta.ucCode || ''})
                        </Text>
                      </View>
                    </View>

                    <Text
                      numberOfLines={3}
                      className="text-xs text-slate-600 dark:text-slate-300 leading-5 mt-1"
                    >
                      {plainText}
                    </Text>

                    <View className="h-[1px] bg-border dark:bg-border-dark my-3" />

                    <View className="flex-row justify-between items-center">
                      <View className="flex-row items-center">
                        <Icon source="calendar-clock" size={15} color="#94a3b8" />
                        <Text className="text-[11px] text-muted dark:text-muted-dark ml-1">
                          {meta.announcementDate ||
                            (item.timestamp
                              ? new Date(item.timestamp).toLocaleDateString('pt-PT')
                              : 'N/D')}
                        </Text>
                      </View>

                      {meta.personName && (
                        <View className="flex-row items-center">
                          <Icon source="account-tie" size={15} color="#94a3b8" />
                          <Text className="text-[11px] text-muted dark:text-muted-dark ml-1 font-medium">
                            {meta.personName}
                          </Text>
                        </View>
                      )}
                    </View>
                  </CardContent>
                </Card>
              );
            })}
          </View>
        )}
    </ScreenContainer>
  );
}
