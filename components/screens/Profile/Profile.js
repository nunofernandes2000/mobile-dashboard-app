import { useState, useMemo, useRef, useCallback } from 'react';
import { View, ScrollView, TouchableOpacity, Text, Switch } from 'react-native';
import { Icon } from 'react-native-paper';
import {
  Card,
  CardContent,
  Badge,
  Button,
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
  Header,
} from '../../ui';

export default function Profile({
  profile: userProfile,
  isDarkMode,
  onToggleTheme,
  onLogout,
  onBack,
}) {
  const [isRolesModalVisible, setIsRolesModalVisible] = useState(false);
  const [selectedCourseForModal, setSelectedCourseForModal] = useState(null);

  // Normaliza lista de roles do utilizador de forma declarativa
  const normalizedRolesList = useMemo(() => {
    const roles = userProfile?.roles;
    if (!roles) return [];
    if (Array.isArray(roles)) {
      return roles.map((r) => (typeof r === 'object' && r ? r.name || r.id || String(r) : String(r)));
    }
    return [String(roles)];
  }, [userProfile?.roles]);

  const formatCourseAcademicYears = (course) => {
    const start = course.startYear || course.anoInicio || course.yearStart || course.ano_inicio;
    const end = course.endYear || course.anoFim || course.yearEnd || course.ano_fim;
    if (start && end) return `${start} — ${end}`;
    if (start) return `Desde ${start}`;
    if (end) return `Até ${end}`;
    return null;
  };

  const extractCourseCurricularUnits = (course) => {
    return course.ucs || course.unidadesCurriculares || course.unidades || [];
  };

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <Header
        title="O Meu Perfil"
        onBack={onBack}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center pt-6 pb-7 px-5 rounded-b-3xl bg-primary">
          <View className="w-20 h-20 rounded-full bg-white items-center justify-center mb-3.5 shadow-md">
            <Text className="text-primary font-bold text-3xl">
              {(userProfile?.name || 'U').charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text className="font-bold text-xl text-center text-white mb-0.5">
            {userProfile?.name || 'Utilizador'}
          </Text>
          <Text className="text-sm text-white/80 mb-3.5">
            {userProfile?.email || 'Sem email'}
          </Text>

          <TouchableOpacity
            onPress={() => setIsRolesModalVisible(true)}
            activeOpacity={0.8}
            className="flex-row items-center bg-white/20 px-3.5 py-1.5 rounded-full gap-1.5"
          >
            <Icon source="shield-account" color="#fff" size={16} />
            <Text className="text-white font-bold text-xs">
              {normalizedRolesList.length} {normalizedRolesList.length === 1 ? 'role' : 'roles'}
            </Text>
            <Icon source="chevron-right" color="rgba(255,255,255,0.7)" size={16} />
          </TouchableOpacity>
        </View>

        <Card className="mx-4 mt-4">
          <CardContent className="p-4">
            <View className="flex-row items-center gap-2 mb-2">
              <View className="w-8 h-8 rounded-lg bg-primary/15 items-center justify-center">
                <Icon source="card-account-details-outline" size={18} color="#f57c00" />
              </View>
              <Text className="text-base font-bold text-slate-900 dark:text-white">
                Dados Pessoais
              </Text>
            </View>

            <View className="h-[1px] bg-border dark:bg-border-dark mb-3" />

            <View className="gap-3">
              {userProfile?.email && (
                <View className="gap-0.5">
                  <Text className="uppercase font-bold tracking-wider text-[10px] text-muted dark:text-muted-dark">
                    Email
                  </Text>
                  <Text className="font-medium text-sm text-slate-900 dark:text-white">
                    {userProfile.email}
                  </Text>
                </View>
              )}
              {userProfile?.nif && (
                <View className="gap-0.5">
                  <Text className="uppercase font-bold tracking-wider text-[10px] text-muted dark:text-muted-dark">
                    NIF
                  </Text>
                  <Text className="font-medium text-sm text-slate-900 dark:text-white">
                    {userProfile.nif}
                  </Text>
                </View>
              )}
              {userProfile?.cc && (
                <View className="gap-0.5">
                  <Text className="uppercase font-bold tracking-wider text-[10px] text-muted dark:text-muted-dark">
                    Cartão de Cidadão
                  </Text>
                  <Text className="font-medium text-sm text-slate-900 dark:text-white">
                    {userProfile.cc}
                  </Text>
                </View>
              )}
            </View>
          </CardContent>
        </Card>

        {Array.isArray(userProfile?.courses) && userProfile.courses.length > 0 && (
          <Card className="mx-4 mt-4">
            <CardContent className="p-4">
              <View className="flex-row items-center gap-2 mb-2">
                <View className="w-8 h-8 rounded-lg bg-primary/15 items-center justify-center">
                  <Icon source="school-outline" size={18} color="#f57c00" />
                </View>
                <Text className="text-base font-bold text-slate-900 dark:text-white">
                  Cursos ({userProfile.courses.length})
                </Text>
              </View>

              <View className="h-[1px] bg-border dark:bg-border-dark mb-3" />

              {userProfile.courses.map((courseItem, courseIndex) => {
                const courseName = courseItem.name || courseItem.courseName || courseItem.descricao || JSON.stringify(courseItem);
                const curricularUnits = extractCourseCurricularUnits(courseItem);
                const curricularUnitCount = Array.isArray(curricularUnits) ? curricularUnits.length : 0;
                const academicYearsFormatted = formatCourseAcademicYears(courseItem);

                return (
                  <View key={`course-${courseItem.courseCode || courseItem.code || courseIndex}`}>
                    {courseIndex > 0 && <View className="h-[1px] bg-border dark:bg-border-dark my-3" />}
                    <View className="flex-row items-start py-1 gap-3">
                      <View className="w-10 h-10 rounded-xl items-center justify-center bg-primary/15 mt-0.5">
                        <Icon source="book-education-outline" color="#f57c00" size={20} />
                      </View>
                      <View className="flex-1 gap-1.5">
                        <Text className="font-bold text-sm leading-5 text-slate-900 dark:text-white">
                          {courseName}
                        </Text>

                        <View className="flex-row flex-wrap gap-1.5">
                          {academicYearsFormatted && (
                            <Badge variant="secondary" icon="calendar-range" size="sm">
                              {academicYearsFormatted}
                            </Badge>
                          )}
                          {curricularUnitCount > 0 && (
                            <Badge variant="default" icon="book-open-variant" size="sm">
                              {curricularUnitCount} UCs
                            </Badge>
                          )}
                        </View>

                        {curricularUnitCount > 0 && (
                          <TouchableOpacity
                            onPress={() => setSelectedCourseForModal(courseItem)}
                            activeOpacity={0.7}
                            className="flex-row items-center self-start py-1 px-2.5 rounded-lg border border-primary/40 gap-0.5 mt-0.5"
                          >
                            <Text className="font-bold text-xs text-primary-dark dark:text-primary-light">
                              Ver Cadeiras
                            </Text>
                            <Icon source="chevron-right" color="#f57c00" size={16} />
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  </View>
                );
              })}
            </CardContent>
          </Card>
        )}

        <Card className="mx-4 mt-4">
          <CardContent className="p-4">
            <View className="flex-row items-center gap-2 mb-2">
              <View className="w-8 h-8 rounded-lg bg-primary/15 items-center justify-center">
                <Icon source="tune" size={18} color="#f57c00" />
              </View>
              <Text className="text-base font-bold text-slate-900 dark:text-white">
                Preferências
              </Text>
            </View>

            <View className="h-[1px] bg-border dark:bg-border-dark mb-3" />

            <View className="flex-row items-center justify-between py-1">
              <View className="flex-row items-center gap-3">
                <Icon
                  source={isDarkMode ? 'weather-night' : 'weather-sunny'}
                  size={22}
                  color={isDarkMode ? '#ffb74d' : '#f57c00'}
                />
                <Text className="font-semibold text-sm text-slate-900 dark:text-white">
                  Modo Escuro
                </Text>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={onToggleTheme}
                trackColor={{ false: '#cbd5e1', true: '#ffb74d' }}
                thumbColor={isDarkMode ? '#ff9800' : '#f8fafc'}
              />
            </View>
          </CardContent>
        </Card>

        <View className="mx-4 mt-6 mb-4">
          <Button
            variant="destructive"
            icon="logout"
            onPress={onLogout}
          >
            Terminar Sessão
          </Button>
        </View>
      </ScrollView>

      <Dialog visible={isRolesModalVisible} onDismiss={() => setIsRolesModalVisible(false)}>
        <DialogHeader onClose={() => setIsRolesModalVisible(false)}>
          <DialogTitle>Funções / Roles</DialogTitle>
        </DialogHeader>
        <DialogContent scrollable>
          <View className="flex-row flex-wrap gap-2 py-2">
            {normalizedRolesList.length === 0 ? (
              <Text className="text-muted dark:text-muted-dark text-xs">
                Nenhuma função atribuída.
              </Text>
            ) : (
              normalizedRolesList.map((roleName, roleIndex) => (
                <Badge key={`role-${roleName || roleIndex}`} variant="default" icon="shield-check" size="md">
                  {String(roleName).toUpperCase()}
                </Badge>
              ))
            )}
          </View>
        </DialogContent>
        <DialogFooter>
          <Button variant="secondary" size="sm" onPress={() => setIsRolesModalVisible(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog visible={!!selectedCourseForModal} onDismiss={() => setSelectedCourseForModal(null)}>
        <DialogHeader onClose={() => setSelectedCourseForModal(null)}>
          <DialogTitle numberOfLines={1}>
            {selectedCourseForModal?.name || selectedCourseForModal?.courseName || 'Curso'}
          </DialogTitle>
        </DialogHeader>
        <DialogContent scrollable>
          {(() => {
            const academicYears = selectedCourseForModal ? formatCourseAcademicYears(selectedCourseForModal) : null;
            return academicYears ? (
              <Badge variant="secondary" icon="calendar-range" size="sm" className="mb-3">
                {academicYears}
              </Badge>
            ) : null;
          })()}
          <Text className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Unidades Curriculares inscritas:
          </Text>
          <View className="flex-row flex-wrap gap-2 py-1">
            {(() => {
              const curricularUnits = selectedCourseForModal ? extractCourseCurricularUnits(selectedCourseForModal) : [];
              if (!Array.isArray(curricularUnits) || curricularUnits.length === 0) {
                return (
                  <Text className="text-muted dark:text-muted-dark text-xs">
                    Nenhuma UC encontrada.
                  </Text>
                );
              }
              return curricularUnits.map((unitItem, unitIndex) => {
                const curricularUnitName =
                  typeof unitItem === 'string'
                    ? unitItem
                    : unitItem.name || unitItem.ucName || unitItem.descricao || unitItem.title || JSON.stringify(unitItem);
                const unitKey = typeof unitItem === 'object' ? (unitItem.code || unitItem.ucCode || unitIndex) : unitIndex;
                return (
                  <Badge key={`modal-uc-${unitKey}-${unitIndex}`} variant="default" icon="school" size="md">
                    {curricularUnitName}
                  </Badge>
                );
              });
            })()}
          </View>
        </DialogContent>
        <DialogFooter>
          <Button variant="secondary" size="sm" onPress={() => setSelectedCourseForModal(null)}>
            Fechar
          </Button>
        </DialogFooter>
      </Dialog>
    </View>
  );
}

