import React from 'react';
import { View, Image, Text } from 'react-native';
import { Icon } from 'react-native-paper';
import { Button, Badge } from '../../ui';

// Ecrã de login institucional do Politécnico de Portalegre
export default function Login({ onLogin: handleInitiateLogin, onDemoLogin }) {
  return (
    <View className="gap-4 w-full max-w-[460px] self-center py-2.5">
      <View className="items-center pt-1.5 pb-1">
        <View className="w-full items-center justify-center py-3 px-4 mb-2.5">
          <Image
            source={require('../../../assets/upp_logo_clean.png')}
            className="w-[290px] h-[62px]"
            resizeMode="contain"
          />
        </View>

        <Text className="font-bold text-center mb-1 text-lg tracking-wide text-slate-900">
          Portal Académico & Serviços
        </Text>
        <Text className="text-center text-xs text-slate-500 leading-relaxed">
          Plataforma Integrada de Gestão e Informação
        </Text>
      </View>

      <View className="rounded-3xl border border-slate-200/80 bg-white shadow-md p-6 gap-4">
        <View className="flex-row items-center">
          <Badge variant="default" icon="shield-lock-outline" size="sm">
            Autenticação Centralizada
          </Badge>
        </View>

        <Text className="font-bold text-2xl text-slate-900">
          Iniciar Sessão
        </Text>
        <Text className="text-sm leading-5 text-slate-600">
          Aceda à sua área pessoal, horários, salas, avaliações e dashboards institucionais.
        </Text>

        <Button
          variant="default"
          size="lg"
          icon="login"
          onPress={handleInitiateLogin}
          className="mt-1"
        >
          Entrar com Conta UPP / IPP
        </Button>

        {/* DEMO_TOKEN só esta aqui para apresentação da universidade */}
        {onDemoLogin && (
          <Button
            variant="secondary"
            size="lg"
            icon="presentation"
            onPress={onDemoLogin}
            className="border border-primary/30"
          >
            Entrar em Modo Demonstração (Júri)
          </Button>
        )}

        <View className="mt-1 p-3.5 rounded-xl bg-slate-50 border border-slate-100 border-l-4 border-l-primary gap-1.5">
          <View className="flex-row items-center gap-1.5">
            <Icon source="information-outline" size={18} color="#f57c00" />
            <Text className="font-semibold text-xs text-slate-900">
              Acesso Institucional & Demonstração
            </Text>
          </View>
          <Text className="text-xs leading-5 text-slate-600">
            Utilize a conta institucional para dados reais do PAE ou o Modo Demonstração para avaliação com as 4 UCs simuladas de Engenharia Informática.
          </Text>
        </View>

        <View className="h-[1px] bg-slate-200/70 my-1" />

        <View className="items-center gap-2.5">
          <Text className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            Universidade Politécnica
          </Text>
          <View className="flex-row flex-wrap justify-center gap-2">
            {['ESTGD', 'ESECS', 'ESS', 'ESAE'].map((schoolAcronym) => (
              <View key={schoolAcronym} className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-100">
                <Text className="text-[11px] font-semibold text-slate-700">{schoolAcronym}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className="items-center pt-1 pb-3">
        <Text className="text-[11px] text-slate-400 opacity-80">
          © Universidade Politécnica de Portalegre
        </Text>
      </View>
    </View>
  );
}

