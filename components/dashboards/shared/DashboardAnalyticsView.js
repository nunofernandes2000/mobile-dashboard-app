import React from 'react';
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { ProgressBar, Icon } from 'react-native-paper';
import { Card, CardContent, StatCard, Badge, EmptyState } from '../../ui';

// Visualização de estatísticas e gráficos para os dashboards
export default function DashboardAnalyticsView({
  type = 'dtp', // 'dtp' | 'birthdays' | 'teachers' | 'courses'
  data: analyticsDataList = [],
  title = 'Analytics & Estatísticas',
  subtitle = 'Resumo em tempo real dos dados filtrados',
  onSelectCategoryFilter,
}) {
  if (!analyticsDataList || analyticsDataList.length === 0) {
    return (
      <EmptyState
        icon="chart-bar"
        title="Sem dados para os gráficos"
        description="Ajuste os filtros de pesquisa para visualizar as estatísticas calculadas."
      />
    );
  }

  // Estatísticas de alertas DTP
  if (type === 'dtp') {
    let totalAlertsCount = 0;
    const categoryAlertCountsMap = {};
    const courseAlertStatsList = [];

    analyticsDataList.forEach((courseEntry) => {
      const courseCode = courseEntry.entity?.code || 'Outro';
      const courseName = courseEntry.entity?.name || courseCode;
      let courseAlertSum = 0;

      (courseEntry.alerts || []).forEach((alertItem) => {
        const categoryKey = alertItem.category || 'Geral';
        const entitiesCount = (alertItem.entities || []).length;
        courseAlertSum += entitiesCount;
        totalAlertsCount += entitiesCount;
        categoryAlertCountsMap[categoryKey] = (categoryAlertCountsMap[categoryKey] || 0) + entitiesCount;
      });

      if (courseAlertSum > 0) {
        courseAlertStatsList.push({
          code: courseCode,
          name: courseName,
          count: courseAlertSum,
        });
      }
    });

    const totalAffectedCoursesCount = courseAlertStatsList.length;

    courseAlertStatsList.sort((statA, statB) => statB.count - statA.count);
    const topIrregularCourses = courseAlertStatsList.slice(0, 7);
    const maxCourseAlertCount = topIrregularCourses.length > 0 ? topIrregularCourses[0].count : 1;

    const categorizedAlertDistribution = Object.keys(categoryAlertCountsMap)
      .map((categoryName) => ({
        name: categoryName,
        count: categoryAlertCountsMap[categoryName],
        percentage: totalAlertsCount > 0 ? Math.round((categoryAlertCountsMap[categoryName] / totalAlertsCount) * 100) : 0,
      }))
      .sort((catA, catB) => catB.count - catA.count);

    const getCategoryIndicatorColor = (categoryName) => {
      if (categoryName.includes('Planeamento')) return '#d32f2f';
      if (categoryName.includes('Sumários')) return '#ed6c02';
      if (categoryName.includes('Notas')) return '#7b1fa2';
      if (categoryName.includes('Enunciados')) return '#0288d1';
      if (categoryName.includes('Ficha UC em Falta')) return '#c2185b';
      if (categoryName.includes('Ficha UC por Validar')) return '#00796b';
      return '#616161';
    };

    return (
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View className="mb-3.5">
          <Text className="text-base font-bold text-slate-900 dark:text-white">
            {title}
          </Text>
          <Text className="text-xs text-muted dark:text-muted-dark mt-0.5">
            {subtitle}
          </Text>
        </View>

        <View className="flex-row gap-2.5 mb-3.5">
          <View className="flex-1">
            <StatCard
              icon="alert-circle-outline"
              title="Total de Alertas"
              value={totalAlertsCount}
              color="destructive"
            />
          </View>
          <View className="flex-1">
            <StatCard
              icon="book-education-outline"
              title="Cursos Afetados"
              value={totalAffectedCoursesCount}
              color="primary"
            />
          </View>
        </View>

        <Card className="mb-4">
          <CardContent className="p-4">
            <View className="flex-row items-center mb-1">
              <Icon source="chart-pie" size={20} color="#ff9800" />
              <Text className="font-bold text-sm text-slate-900 dark:text-white ml-2">
                Distribuição por Categoria de Falha
              </Text>
            </View>
            <Text className="text-xs text-muted dark:text-muted-dark mb-4">
              Toque numa categoria para aplicar o filtro rápido na lista.
            </Text>

            <View className="flex-row w-full h-3.5 rounded-full overflow-hidden mb-4 bg-slate-200 dark:bg-slate-700">
              {categorizedAlertDistribution.map((categoryItem, categoryIndex) => (
                <View
                  key={`cat-bar-${categoryItem.name || categoryIndex}`}
                  style={{
                    flex: Math.max(categoryItem.count, 1),
                    height: 14,
                    backgroundColor: getCategoryIndicatorColor(categoryItem.name),
                    marginRight: categoryIndex === categorizedAlertDistribution.length - 1 ? 0 : 2,
                  }}
                />
              ))}
            </View>

            <View className="gap-3">
              {categorizedAlertDistribution.map((categoryItem, categoryIndex) => {
                const categoryColor = getCategoryIndicatorColor(categoryItem.name);
                return (
                  <TouchableOpacity
                    key={`cat-item-${categoryItem.name || categoryIndex}`}
                    className="flex-row items-start"
                    activeOpacity={0.7}
                    onPress={() => onSelectCategoryFilter && onSelectCategoryFilter(categoryItem.name)}
                  >
                    <View className="w-2.5 h-2.5 rounded-full mt-1 mr-2.5" style={{ backgroundColor: categoryColor }} />
                    <View className="flex-1">
                      <View className="flex-row justify-between mb-1">
                        <Text className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {categoryItem.name}
                        </Text>
                        <Text className="text-xs font-bold" style={{ color: categoryColor }}>
                          {categoryItem.count} ({categoryItem.percentage}%)
                        </Text>
                      </View>
                      <ProgressBar progress={categoryItem.percentage / 100} color={categoryColor} className="h-1.5 rounded-full" />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <View className="flex-row items-center mb-1">
              <Icon source="chart-bar" size={20} color="#ff9800" />
              <Text className="font-bold text-sm text-slate-900 dark:text-white ml-2">
                Top Cursos com Mais Irregularidades
              </Text>
            </View>
            <Text className="text-xs text-muted dark:text-muted-dark mb-4">
              Volume de inconsistências detetadas por curso
            </Text>

            <View className="gap-3.5">
              {topIrregularCourses.map((courseStat, rankIndex) => {
                const barRatio = courseStat.count / maxCourseAlertCount;
                const barColor = rankIndex === 0 ? '#d32f2f' : rankIndex === 1 ? '#ed6c02' : rankIndex === 2 ? '#f57c00' : '#ff9800';
                return (
                  <View key={`top-course-${courseStat.code || courseStat.name || rankIndex}`}>
                    <View className="flex-row justify-between items-center mb-1.5">
                      <Text className="text-xs font-semibold flex-1 mr-2 text-slate-800 dark:text-slate-200" numberOfLines={1}>
                        {rankIndex + 1}. {courseStat.name} ({courseStat.code})
                      </Text>
                      <Badge variant="destructive" size="sm">
                        {courseStat.count} alertas
                      </Badge>
                    </View>
                    <View className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <View
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.max(barRatio * 100, 4)}%`,
                          backgroundColor: barColor,
                        }}
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          </CardContent>
        </Card>
      </ScrollView>
    );
  }

  // Estatísticas para Aniversários
  if (type === 'birthdays') {
    const totalStaffCount = analyticsDataList.length;
    const monthlyBirthdayCounts = Array(12).fill(0);
    const monthLabelsList = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const ageGroupCountsMap = { 'Sub-30': 0, '30-40': 0, '41-50': 0, '51-60': 0, '60+': 0 };

    let birthdaysTodayCount = 0;
    let roundAgesCount = 0;
    let cumulativeAgeSum = 0;
    let validAgesTotal = 0;

    const currentCalendarDate = new Date();
    const currentMonthIndex = currentCalendarDate.getMonth();
    const currentDayOfMonth = currentCalendarDate.getDate();

    analyticsDataList.forEach((personEntry) => {
      const personMetadata = personEntry.metadata || {};
      const birthDateRaw = personMetadata.birthDate || personEntry.birthDate || '';
      const bdayCurrentYear = personMetadata.birthdayDateCurrentYear || personEntry.birthdayDateCurrentYear || '';

      let calculatedMonthIndex = -1;
      let calculatedDayOfMonth = -1;

      if (bdayCurrentYear) {
        const dateParts = bdayCurrentYear.split('-');
        if (dateParts.length >= 2) {
          calculatedMonthIndex = parseInt(dateParts[1], 10) - 1;
          if (dateParts[2]) calculatedDayOfMonth = parseInt(dateParts[2], 10);
        }
      }

      if (calculatedMonthIndex < 0 && birthDateRaw) {
        if (birthDateRaw.includes('-')) {
          const dateParts = birthDateRaw.split('-');
          if (dateParts[0].length === 4) {
            calculatedMonthIndex = parseInt(dateParts[1], 10) - 1;
            calculatedDayOfMonth = parseInt(dateParts[2], 10);
          } else if (dateParts[2].length === 4) {
            calculatedMonthIndex = parseInt(dateParts[1], 10) - 1;
            calculatedDayOfMonth = parseInt(dateParts[0], 10);
          }
        } else if (birthDateRaw.includes('/')) {
          const dateParts = birthDateRaw.split('/');
          if (dateParts[2] && dateParts[2].length === 4) {
            calculatedMonthIndex = parseInt(dateParts[1], 10) - 1;
            calculatedDayOfMonth = parseInt(dateParts[0], 10);
          } else if (dateParts[0] && dateParts[0].length === 4) {
            calculatedMonthIndex = parseInt(dateParts[1], 10) - 1;
            calculatedDayOfMonth = parseInt(dateParts[2], 10);
          }
        }
      }

      if (calculatedMonthIndex >= 0 && calculatedMonthIndex < 12) {
        monthlyBirthdayCounts[calculatedMonthIndex] += 1;
        if (calculatedMonthIndex === currentMonthIndex && calculatedDayOfMonth === currentDayOfMonth) {
          birthdaysTodayCount++;
        }
      }

      const rawAgeValue = personMetadata.age !== undefined ? personMetadata.age : personEntry.age;
      const parsedAge = typeof rawAgeValue === 'number' ? rawAgeValue : parseInt(rawAgeValue, 10);
      if (!isNaN(parsedAge) && parsedAge > 0) {
        cumulativeAgeSum += parsedAge;
        validAgesTotal++;
        if (parsedAge % 10 === 0) roundAgesCount++;

        if (parsedAge < 30) ageGroupCountsMap['Sub-30']++;
        else if (parsedAge <= 40) ageGroupCountsMap['30-40']++;
        else if (parsedAge <= 50) ageGroupCountsMap['41-50']++;
        else if (parsedAge <= 60) ageGroupCountsMap['51-60']++;
        else ageGroupCountsMap['60+']++;
      }
    });

    const averageStaffAge = validAgesTotal > 0 ? Math.round(cumulativeAgeSum / validAgesTotal) : 0;
    const maxMonthlyCount = Math.max(...monthlyBirthdayCounts, 1);

    return (
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View className="mb-3.5">
          <Text className="text-base font-bold text-slate-900 dark:text-white">
            {title}
          </Text>
          <Text className="text-xs text-muted dark:text-muted-dark mt-0.5">
            {subtitle}
          </Text>
        </View>

        <View className="flex-row gap-2.5 mb-2.5">
          <View className="flex-1">
            <StatCard icon="cake-variant" title="Colaboradores" value={totalStaffCount} color="warning" />
          </View>
          <View className="flex-1">
            <StatCard icon="account-clock" title="Idade Média" value={averageStaffAge ? `${averageStaffAge}a` : '-'} color="purple" />
          </View>
        </View>

        <View className="flex-row gap-2.5 mb-3.5">
          <View className="flex-1">
            <StatCard icon="calendar-star" title="Hoje" value={birthdaysTodayCount} color="success" />
          </View>
          <View className="flex-1">
            <StatCard icon="party-popper" title="Anos Redondos" value={roundAgesCount} color="destructive" />
          </View>
        </View>

        <Card className="mb-4">
          <CardContent className="p-4">
            <View className="flex-row items-center mb-1">
              <Icon source="calendar-month" size={20} color="#ff9800" />
              <Text className="font-bold text-sm text-slate-900 dark:text-white ml-2">
                Distribuição por Mês do Ano
              </Text>
            </View>
            <Text className="text-xs text-muted dark:text-muted-dark mb-4">
              Contagem total de aniversários em cada mês
            </Text>

            <View className="flex-row justify-between items-end h-[140px] pt-2">
              {monthlyBirthdayCounts.map((countInMonth, monthIndex) => {
                const heightPercentage = Math.max((countInMonth / maxMonthlyCount) * 100, 6);
                const isCurrentActiveMonth = monthIndex === currentMonthIndex;
                const barBackgroundColor = isCurrentActiveMonth ? '#ff9800' : countInMonth > 0 ? '#f57c00' : '#cbd5e1';
                return (
                  <View key={monthIndex} className="flex-1 items-center h-full justify-end">
                    <Text className={`text-[10px] font-bold ${isCurrentActiveMonth ? 'text-primary' : 'text-muted dark:text-muted-dark'}`}>
                      {countInMonth}
                    </Text>
                    <View className="w-2.5 h-[90px] bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden justify-end mt-1">
                      <View className="w-full rounded-full" style={{ height: `${heightPercentage}%`, backgroundColor: barBackgroundColor }} />
                    </View>
                    <Text className={`text-[10px] mt-1 ${isCurrentActiveMonth ? 'font-bold text-primary' : 'text-muted dark:text-muted-dark'}`}>
                      {monthLabelsList[monthIndex]}
                    </Text>
                  </View>
                );
              })}
            </View>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <View className="flex-row items-center mb-1">
              <Icon source="account-group" size={20} color="#ff9800" />
              <Text className="font-bold text-sm text-slate-900 dark:text-white ml-2">
                Distribuição por Faixa Etária
              </Text>
            </View>
            <Text className="text-xs text-muted dark:text-muted-dark mb-4">
              Proporção dos colaboradores por intervalos de idade
            </Text>

            <View className="gap-3">
              {Object.keys(ageGroupCountsMap).map((ageGroupKey, groupIndex) => {
                const groupCount = ageGroupCountsMap[ageGroupKey];
                const groupPercentage = totalStaffCount > 0 ? Math.round((groupCount / totalStaffCount) * 100) : 0;
                return (
                  <View key={`bday-age-${ageGroupKey || groupIndex}`}>
                    <View className="flex-row justify-between mb-1">
                      <Text className="text-xs font-semibold text-slate-800 dark:text-slate-200">{ageGroupKey} anos</Text>
                      <Text className="text-xs font-bold text-primary">
                        {groupCount} ({groupPercentage}%)
                      </Text>
                    </View>
                    <ProgressBar progress={groupPercentage / 100} color="#ff9800" className="h-2 rounded-full" />
                  </View>
                );
              })}
            </View>
          </CardContent>
        </Card>
      </ScrollView>
    );
  }

  // Estatísticas para Docentes e Cursos
  const totalItemsCount = analyticsDataList.length;
  const isTeacherMode = type === 'teachers';

  let validTeacherProfileCount = 0;
  let code5DigitCount = 0;
  let code7DigitCount = 0;
  const degreeTypeCountsMap = {};

  analyticsDataList.forEach((itemEntry) => {
    if (isTeacherMode) {
      const profileUrl = itemEntry.url || '';
      if (profileUrl.includes('userView.id=')) validTeacherProfileCount++;
      const codeString = (itemEntry.code || '').toString().trim();
      if (codeString.length === 5) code5DigitCount++;
      else if (codeString.length === 7) code7DigitCount++;
    } else {
      const metadata = itemEntry.metadata || {};
      const degreeType = metadata.degreeType || 'Outro';
      degreeTypeCountsMap[degreeType] = (degreeTypeCountsMap[degreeType] || 0) + 1;
    }
  });

  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <View className="mb-3.5">
        <Text className="text-base font-bold text-slate-900 dark:text-white">
          {title}
        </Text>
        <Text className="text-xs text-muted dark:text-muted-dark mt-0.5">
          {subtitle}
        </Text>
      </View>

      <View className="flex-row gap-2.5 mb-3.5">
        <View className="flex-1">
          <StatCard
            icon={isTeacherMode ? 'account-alert' : 'book-sync-outline'}
            title={isTeacherMode ? 'Docentes Pendentes' : 'Cursos no SIGES'}
            value={totalItemsCount}
            color={isTeacherMode ? 'destructive' : 'primary'}
          />
        </View>

        <View className="flex-1">
          <StatCard
            icon={isTeacherMode ? 'account-check' : 'school'}
            title={isTeacherMode ? 'Com Perfil PAE' : 'Graus Académicos'}
            value={isTeacherMode ? validTeacherProfileCount : Object.keys(degreeTypeCountsMap).length}
            color="info"
          />
        </View>
      </View>

      {!isTeacherMode && Object.keys(degreeTypeCountsMap).length > 0 && (
        <Card>
          <CardContent className="p-4">
            <View className="flex-row items-center mb-1">
              <Icon source="chart-pie" size={20} color="#1976d2" />
              <Text className="font-bold text-sm text-slate-900 dark:text-white ml-2">
                Distribuição por Grau Académico
              </Text>
            </View>
            <View className="gap-3 mt-3">
              {Object.keys(degreeTypeCountsMap).map((degreeName, degreeIndex) => {
                const degreeCount = degreeTypeCountsMap[degreeName];
                const degreePercentage = totalItemsCount > 0 ? Math.round((degreeCount / totalItemsCount) * 100) : 0;
                return (
                  <View key={`deg-${degreeName || degreeIndex}`}>
                    <View className="flex-row justify-between mb-1">
                      <Text className="text-xs font-semibold text-slate-800 dark:text-slate-200">{degreeName}</Text>
                      <Text className="text-xs font-bold text-info">
                        {degreeCount} cursos ({degreePercentage}%)
                      </Text>
                    </View>
                    <ProgressBar progress={degreePercentage / 100} color="#0288d1" className="h-2 rounded-full" />
                  </View>
                );
              })}
            </View>
          </CardContent>
        </Card>
      )}

      {isTeacherMode && (
        <Card>
          <CardContent className="p-4">
            <View className="flex-row items-center mb-1">
              <Icon source="card-account-details-outline" size={20} color="#d32f2f" />
              <Text className="font-bold text-sm text-slate-900 dark:text-white ml-2">
                Distribuição por Formato de Código
              </Text>
            </View>
            <View className="gap-3.5 mt-3">
              <View>
                <View className="flex-row justify-between mb-1">
                  <Text className="text-xs font-semibold text-slate-800 dark:text-slate-200">Códigos de 5 Dígitos (Normal)</Text>
                  <Text className="text-xs font-bold text-destructive">{code5DigitCount}</Text>
                </View>
                <ProgressBar progress={totalItemsCount > 0 ? code5DigitCount / totalItemsCount : 0} color="#d32f2f" className="h-2 rounded-full" />
              </View>

              <View>
                <View className="flex-row justify-between mb-1">
                  <Text className="text-xs font-semibold text-slate-800 dark:text-slate-200">Códigos de 7 Dígitos (Especial)</Text>
                  <Text className="text-xs font-bold text-warning">{code7DigitCount}</Text>
                </View>
                <ProgressBar progress={totalItemsCount > 0 ? code7DigitCount / totalItemsCount : 0} color="#ed6c02" className="h-2 rounded-full" />
              </View>
            </View>
          </CardContent>
        </Card>
      )}
    </ScrollView>
  );
}

