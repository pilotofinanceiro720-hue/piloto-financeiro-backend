# 📦 Guia de Build APK - Rota do Lucro v1.0.0

## 🚀 Gerar Build APK

### Pré-requisitos

- ✅ EAS CLI instalado: `npm install -g eas-cli`
- ✅ Conta Expo criada
- ✅ Projeto configurado: `eas init`

### Comando de Build

```bash
cd /home/ubuntu/driver-finance-app
eas build --platform android --build-type apk
```

### Processo de Build

1. **Validação** (1-2 min)
   - Verifica app.config.ts
   - Valida dependências
   - Compila TypeScript

2. **Build** (5-10 min)
   - Compila código React Native
   - Gera APK assinado
   - Otimiza assets

3. **Upload** (1-2 min)
   - Envia para servidor EAS
   - Gera link de download

### Resultado Esperado

```
✅ Build completed successfully!
📱 APK: https://eas-builds.s3.us-west-2.amazonaws.com/...apk
📊 Build ID: 12345678-abcd-1234-efgh-567890abcdef
⏱️  Tempo total: 8-15 minutos
```

### Instalação em Dispositivo

```bash
# Via ADB
adb install -r rota-do-lucro-v1.0.0.apk

# Via Firebase App Distribution
firebase appdistribution:distribute rota-do-lucro-v1.0.0.apk \
  --release-notes "v1.0.0 - Build de teste" \
  --testers "email@example.com"
```

### Troubleshooting

| Erro | Solução |
|------|---------|
| `Build failed: Gradle error` | Limpar cache: `rm -rf node_modules && npm install` |
| `Signing failed` | Verificar certificado em `eas.json` |
| `Out of memory` | Aumentar heap: `export NODE_OPTIONS="--max-old-space-size=4096"` |
| `Module not found` | Executar `npm install` novamente |

---

## 📋 Checklist Pré-Build

- [ ] Todas as permissões declaradas em `app.config.ts`
- [ ] Versão atualizada em `app.config.ts` (version: "1.0.0")
- [ ] Sem erros TypeScript: `npm run check`
- [ ] Testes passando: `npm test`
- [ ] Backend publicado e respondendo
- [ ] Variáveis de ambiente configuradas

---

## 🔗 Links Úteis

- [EAS Build Docs](https://docs.expo.dev/build/setup/)
- [Android Build Guide](https://docs.expo.dev/build-reference/android-builds/)
- [Troubleshooting](https://docs.expo.dev/build/troubleshooting/)

---

**Status:** Pronto para build
**Versão:** 1.0.0-rc.1
**Plataforma:** Android (APK)
**Compatibilidade:** Android 8.0+ (API 26+)
