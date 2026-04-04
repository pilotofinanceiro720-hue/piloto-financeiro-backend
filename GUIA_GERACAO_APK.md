# 📱 Guia de Geração de APK - Rota do Lucro

**Versão:** 1.0.0-rc.1  
**Data:** 19 de Fevereiro de 2026  
**Status:** Pronto para Build

---

## 🎯 Objetivo

Gerar arquivo APK instalável para testes em Samsung Tab S9 FE e smartphone Android.

---

## 📋 Pré-requisitos

### 1. **Conta Expo**

```bash
# Login na conta Expo
eas login

# Verificar login
eas whoami
```

### 2. **Projeto Configurado**

- ✅ `app.config.ts` atualizado
- ✅ `package.json` com versão correta
- ✅ Dependências instaladas (`npm install`)
- ✅ Sem erros TypeScript

### 3. **Android Keystore (Opcional)**

Para builds assinadas em produção:

```bash
# Gerar keystore
keytool -genkey -v -keystore release.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias upload
```

---

## 🚀 Opção 1: EAS Build (Recomendado)

### Passo 1: Configurar EAS

```bash
cd /home/ubuntu/driver-finance-app

# Inicializar EAS
eas build:configure

# Selecionar plataforma: Android
# Selecionar tipo: APK (não AAB)
```

### Passo 2: Gerar APK

```bash
# Build de desenvolvimento (mais rápido)
eas build --platform android --build-type apk

# Ou: Build de produção (mais otimizado)
eas build --platform android --build-type apk --profile production
```

### Passo 3: Monitorar Build

```bash
# Verificar status
eas build:list

# Acompanhar em tempo real
eas build --platform android --build-type apk --wait
```

### Passo 4: Baixar APK

```bash
# Link será fornecido ao final do build
# Ou acesse: https://expo.dev/builds

# Salvar localmente
wget <URL_DO_APK> -O rota-do-lucro-v1.0.0-rc.1.apk
```

---

## 🏗️ Opção 2: Build Local (Avançado)

### Passo 1: Instalar Android SDK

```bash
# Ubuntu/Debian
sudo apt-get install android-sdk

# Ou: Usar Android Studio
# https://developer.android.com/studio
```

### Passo 2: Configurar Variáveis

```bash
export ANDROID_SDK_ROOT=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_SDK_ROOT/cmdline-tools/latest/bin
export PATH=$PATH:$ANDROID_SDK_ROOT/platform-tools
```

### Passo 3: Gerar APK

```bash
cd /home/ubuntu/driver-finance-app

# Build de desenvolvimento
npm run build

# Ou: Usar Expo CLI
npx expo prebuild --clean --platform android

# Compilar com Gradle
cd android
./gradlew assembleDebug
cd ..

# APK estará em: android/app/build/outputs/apk/debug/
```

---

## 📦 Estrutura do APK Gerado

```
rota-do-lucro-v1.0.0-rc.1.apk
├── AndroidManifest.xml
├── classes.dex
├── resources.arsc
├── assets/
│   ├── app.json
│   ├── metadata.json
│   └── bundles/
└── lib/
    ├── armeabi-v7a/
    └── arm64-v8a/
```

---

## 📊 Tamanho Esperado

| Componente | Tamanho |
|-----------|---------|
| Código React Native | ~15 MB |
| Dependências | ~25 MB |
| Assets | ~5 MB |
| **Total APK** | **~45 MB** |

---

## ✅ Validação Pré-Build

```bash
cd /home/ubuntu/driver-finance-app

# 1. Verificar TypeScript
npm run check

# 2. Executar linter
npm run lint

# 3. Rodar testes
npm run test

# 4. Verificar dependências
npm audit

# 5. Limpar cache
npm cache clean --force
rm -rf node_modules/.cache
```

---

## 🔧 Troubleshooting

### Erro: "Cannot find module 'expo-location'"

```bash
# Reinstalar dependências
npm install expo-location expo-task-manager expo-notifications

# Limpar cache
npm cache clean --force
rm -rf node_modules
npm install
```

### Erro: "Build failed"

```bash
# Verificar logs
eas build:list --limit 1

# Retentar com verbose
eas build --platform android --build-type apk --verbose
```

### Erro: "Keystore not found"

```bash
# Usar keystore padrão do Expo
eas build --platform android --build-type apk --clear-cache
```

---

## 📱 Instalação no Dispositivo

### Via ADB (Android Debug Bridge)

```bash
# 1. Conectar dispositivo via USB
adb devices

# 2. Instalar APK
adb install -r rota-do-lucro-v1.0.0-rc.1.apk

# 3. Iniciar app
adb shell am start -n com.manus.rotadolucro/.MainActivity

# 4. Ver logs
adb logcat | grep "RotaDoLucro"
```

### Via Transferência Manual

```bash
# 1. Conectar dispositivo via USB
# 2. Copiar APK para dispositivo
adb push rota-do-lucro-v1.0.0-rc.1.apk /sdcard/Download/

# 3. Abrir gerenciador de arquivos no dispositivo
# 4. Navegar para Download
# 5. Tocar no APK
# 6. Permitir instalação de "Fontes Desconhecidas"
# 7. Instalar
```

### Via Firebase App Distribution

```bash
# 1. Fazer upload para Firebase
firebase appdistribution:distribute rota-do-lucro-v1.0.0-rc.1.apk \
  --app=<APP_ID> \
  --testers=motorista@example.com

# 2. Testador recebe email com link
# 3. Clica no link
# 4. Baixa e instala no dispositivo
```

---

## 🧪 Testes Pós-Instalação

### Permissões

```bash
# Verificar permissões solicitadas
adb shell pm list permissions | grep -i location

# Conceder permissão
adb shell pm grant com.manus.rotadolucro android.permission.ACCESS_FINE_LOCATION

# Revogar permissão
adb shell pm revoke com.manus.rotadolucro android.permission.ACCESS_FINE_LOCATION
```

### Serviços

```bash
# Ver serviços em execução
adb shell dumpsys activity services | grep rotadolucro

# Ver notificações
adb shell dumpsys notification | grep rotadolucro

# Ver logs
adb logcat -s "RotaDoLucro"
```

### Performance

```bash
# Monitorar CPU
adb shell top -n 1 | grep rotadolucro

# Monitorar memória
adb shell dumpsys meminfo com.manus.rotadolucro

# Monitorar bateria
adb shell dumpsys batterystats | grep rotadolucro
```

---

## 📊 Checklist de Build

- [ ] Dependências instaladas (`npm install`)
- [ ] Sem erros TypeScript (`npm run check`)
- [ ] Testes passando (`npm run test`)
- [ ] Linter sem erros (`npm run lint`)
- [ ] `app.config.ts` atualizado
- [ ] `package.json` com versão correta
- [ ] Conta Expo configurada (`eas login`)
- [ ] EAS configurado (`eas build:configure`)
- [ ] Build iniciado (`eas build --platform android --build-type apk`)
- [ ] APK baixado
- [ ] APK instalado em dispositivo
- [ ] Permissões funcionando
- [ ] Serviços iniciando
- [ ] Sem crashes

---

## 🚀 Próximos Passos

1. **Executar testes em Samsung Tab S9 FE**
   - Instalar APK
   - Validar permissões
   - Testar serviços
   - Verificar layout

2. **Coletar feedback de testadores**
   - Usar formulário in-app
   - Analisar logs
   - Identificar bugs

3. **Iterar e melhorar**
   - Corrigir bugs
   - Otimizar performance
   - Gerar nova build

---

## 📞 Suporte

### Documentação Oficial

- [EAS Build Docs](https://docs.expo.dev/build/introduction/)
- [Expo CLI](https://docs.expo.dev/more/expo-cli/)
- [Android Build Guide](https://developer.android.com/build)

### Comunidade

- [Expo Discord](https://discord.gg/expo)
- [React Native Community](https://github.com/react-native-community)

---

**Versão:** 1.0.0-rc.1  
**Data:** 19 de Fevereiro de 2026  
**Status:** ✅ Pronto para Build
