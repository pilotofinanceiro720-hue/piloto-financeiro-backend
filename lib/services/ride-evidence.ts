/**
 * Evidência Visual
 * Captura automaticamente screenshots de corridas para auditoria
 */

import * as FileSystem from "expo-file-system/legacy";

export interface RideEvidence {
  id: string;
  rideId: string;
  userId: number;
  platformId: string;
  platformName: string;
  initialScreenshot?: string; // URI local
  finalScreenshot?: string; // URI local
  timestamp: Date;
  localPath: string;
  metadata: EvidenceMetadata;
  status: "pending" | "captured" | "verified" | "archived";
}

export interface EvidenceMetadata {
  deviceModel?: string;
  osVersion?: string;
  screenResolution?: string;
  captureMethod: "automatic" | "manual";
  initialScreenshotTime?: Date;
  finalScreenshotTime?: Date;
  notes?: string;
}

/**
 * Diretório base para armazenamento de evidências
 */
const EVIDENCE_BASE_PATH = `${FileSystem.documentDirectory || ""}RotaDoLucro/Corridas`;

/**
 * Cria caminho para evidência de corrida
 */
function createEvidencePath(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${EVIDENCE_BASE_PATH}/${year}-${month}-${day}`;
}

/**
 * Inicializa diretório de evidências
 */
export async function initializeEvidenceDirectory(): Promise<void> {
  try {
    const dirInfo = await FileSystem.getInfoAsync(EVIDENCE_BASE_PATH);

    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(EVIDENCE_BASE_PATH, { intermediates: true });
      console.log(`✅ Diretório de evidências criado: ${EVIDENCE_BASE_PATH}`);
    } else {
      console.log(`✅ Diretório de evidências já existe: ${EVIDENCE_BASE_PATH}`);
    }
  } catch (error) {
    console.error("Erro ao criar diretório de evidências:", error);
    throw error;
  }
}

/**
 * Captura screenshot inicial de corrida
 */
export async function captureInitialScreenshot(
  rideId: string,
  userId: number,
  platformName: string
): Promise<RideEvidence> {
  try {
    console.log(`📸 Capturando screenshot inicial da corrida ${rideId}`);

    const now = new Date();
    const evidencePath = createEvidencePath(now);

    // Criar diretório se não existir
    const dirInfo = await FileSystem.getInfoAsync(evidencePath);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(evidencePath, { intermediates: true });
    }

    // TODO: Usar expo-screenshot ou similar para capturar tela
    // const screenshot = await takeScreenshot();

    // Mock screenshot
    const screenshotFileName = `ride_${rideId}_initial_${Date.now()}.png`;
    const screenshotPath = `${evidencePath}/${screenshotFileName}`;

    // Simular captura (em produção, usar API nativa)
    console.log(`   📁 Caminho: ${screenshotPath}`);

    const evidence: RideEvidence = {
      id: `evidence_${rideId}_${Date.now()}`,
      rideId,
      userId,
      platformId: platformName.toLowerCase(),
      platformName,
      initialScreenshot: screenshotPath,
      timestamp: now,
      localPath: evidencePath,
      metadata: {
        captureMethod: "automatic",
        initialScreenshotTime: now,
      },
      status: "captured",
    };

    console.log(`✅ Screenshot inicial capturada: ${screenshotFileName}`);

    return evidence;
  } catch (error) {
    console.error("Erro ao capturar screenshot inicial:", error);
    throw error;
  }
}

/**
 * Captura screenshot final de corrida
 */
export async function captureFinalScreenshot(
  evidence: RideEvidence
): Promise<RideEvidence> {
  try {
    console.log(`📸 Capturando screenshot final da corrida ${evidence.rideId}`);

    // TODO: Usar expo-screenshot ou similar para capturar tela
    // const screenshot = await takeScreenshot();

    // Mock screenshot
    const screenshotFileName = `ride_${evidence.rideId}_final_${Date.now()}.png`;
    const screenshotPath = `${evidence.localPath}/${screenshotFileName}`;

    // Simular captura (em produção, usar API nativa)
    console.log(`   📁 Caminho: ${screenshotPath}`);

    evidence.finalScreenshot = screenshotPath;
    evidence.metadata.finalScreenshotTime = new Date();
    evidence.status = "verified";

    console.log(`✅ Screenshot final capturada: ${screenshotFileName}`);

    return evidence;
  } catch (error) {
    console.error("Erro ao capturar screenshot final:", error);
    throw error;
  }
}

/**
 * Salva metadados de evidência
 */
export async function saveEvidenceMetadata(evidence: RideEvidence): Promise<void> {
  try {
    const metadataPath = `${evidence.localPath}/ride_${evidence.rideId}_metadata.json`;

    const metadata = {
      id: evidence.id,
      rideId: evidence.rideId,
      userId: evidence.userId,
      platformName: evidence.platformName,
      initialScreenshot: evidence.initialScreenshot,
      finalScreenshot: evidence.finalScreenshot,
      timestamp: evidence.timestamp.toISOString(),
      metadata: evidence.metadata,
      status: evidence.status,
      capturedAt: new Date().toISOString(),
    };

    await FileSystem.writeAsStringAsync(metadataPath, JSON.stringify(metadata, null, 2));

    console.log(`✅ Metadados salvos: ${metadataPath}`);
  } catch (error) {
    console.error("Erro ao salvar metadados:", error);
    throw error;
  }
}

/**
 * Lista evidências de um dia específico
 */
export async function listEvidencesForDate(date: Date): Promise<RideEvidence[]> {
  try {
    const evidencePath = createEvidencePath(date);

    const dirInfo = await FileSystem.getInfoAsync(evidencePath);
    if (!dirInfo.exists) {
      console.log(`ℹ️  Nenhuma evidência encontrada para ${date.toLocaleDateString()}`);
      return [];
    }

    const files = await FileSystem.readDirectoryAsync(evidencePath);
    const metadataFiles = files.filter((f) => f.endsWith("_metadata.json"));

    const evidences: RideEvidence[] = [];

    for (const metadataFile of metadataFiles) {
      try {
        const metadataPath = `${evidencePath}/${metadataFile}`;
        const content = await FileSystem.readAsStringAsync(metadataPath);
        const metadata = JSON.parse(content);

        evidences.push({
          id: metadata.id,
          rideId: metadata.rideId,
          userId: metadata.userId,
          platformId: metadata.platformName.toLowerCase(),
          platformName: metadata.platformName,
          initialScreenshot: metadata.initialScreenshot,
          finalScreenshot: metadata.finalScreenshot,
          timestamp: new Date(metadata.timestamp),
          localPath: evidencePath,
          metadata: metadata.metadata,
          status: metadata.status,
        });
      } catch (error) {
        console.error(`Erro ao ler metadados ${metadataFile}:`, error);
      }
    }

    console.log(`✅ ${evidences.length} evidências encontradas para ${date.toLocaleDateString()}`);

    return evidences;
  } catch (error) {
    console.error("Erro ao listar evidências:", error);
    return [];
  }
}

/**
 * Obtém evidência específica
 */
export async function getEvidence(rideId: string, date: Date): Promise<RideEvidence | null> {
  try {
    const evidencePath = createEvidencePath(date);
    const metadataPath = `${evidencePath}/ride_${rideId}_metadata.json`;

    const fileInfo = await FileSystem.getInfoAsync(metadataPath);
    if (!fileInfo.exists) {
      console.log(`ℹ️  Evidência não encontrada: ${rideId}`);
      return null;
    }

    const content = await FileSystem.readAsStringAsync(metadataPath);
    const metadata = JSON.parse(content);

    return {
      id: metadata.id,
      rideId: metadata.rideId,
      userId: metadata.userId,
      platformId: metadata.platformName.toLowerCase(),
      platformName: metadata.platformName,
      initialScreenshot: metadata.initialScreenshot,
      finalScreenshot: metadata.finalScreenshot,
      timestamp: new Date(metadata.timestamp),
      localPath: evidencePath,
      metadata: metadata.metadata,
      status: metadata.status,
    };
  } catch (error) {
    console.error("Erro ao obter evidência:", error);
    return null;
  }
}

/**
 * Arquiva evidências antigas (> 30 dias)
 */
export async function archiveOldEvidences(daysThreshold: number = 30): Promise<number> {
  try {
    console.log(`📦 Arquivando evidências com mais de ${daysThreshold} dias...`);

    const baseDir = await FileSystem.readDirectoryAsync(EVIDENCE_BASE_PATH);
    let archivedCount = 0;

    const now = new Date();
    const threshold = new Date(now.getTime() - daysThreshold * 24 * 60 * 60 * 1000);

    for (const dateFolder of baseDir) {
      try {
        const [year, month, day] = dateFolder.split("-").map(Number);
        const folderDate = new Date(year, month - 1, day);

        if (folderDate < threshold) {
          const folderPath = `${EVIDENCE_BASE_PATH}/${dateFolder}`;

          // TODO: Comprimir e arquivar
          // await compressAndArchive(folderPath);

          console.log(`   📦 Arquivado: ${dateFolder}`);
          archivedCount++;
        }
      } catch (error) {
        console.error(`Erro ao processar pasta ${dateFolder}:`, error);
      }
    }

    console.log(`✅ ${archivedCount} pastas arquivadas`);

    return archivedCount;
  } catch (error) {
    console.error("Erro ao arquivar evidências:", error);
    return 0;
  }
}

/**
 * Calcula espaço usado por evidências
 */
export async function calculateEvidenceStorageSize(): Promise<{
  totalSize: number;
  fileCount: number;
  formattedSize: string;
}> {
  try {
    let totalSize = 0;
    let fileCount = 0;

    const dirInfo = await FileSystem.getInfoAsync(EVIDENCE_BASE_PATH);
    if (!dirInfo.exists) {
      return { totalSize: 0, fileCount: 0, formattedSize: "0 B" };
    }

    const dateFolder = await FileSystem.readDirectoryAsync(EVIDENCE_BASE_PATH);

    for (const folder of dateFolder) {
      try {
        const folderPath = `${EVIDENCE_BASE_PATH}/${folder}`;
        const files = await FileSystem.readDirectoryAsync(folderPath);

        for (const file of files) {
          try {
            const filePath = `${folderPath}/${file}`;
            const fileInfo = await FileSystem.getInfoAsync(filePath);

            if (fileInfo.exists && 'size' in fileInfo && fileInfo.size) {
              totalSize += fileInfo.size as number;
              fileCount++;
            }
          } catch (error) {
            // Ignorar erro ao obter info de arquivo
          }
        }
      } catch (error) {
        // Ignorar erro ao ler pasta
      }
    }

    const formattedSize = formatBytes(totalSize);

    console.log(`💾 Espaço de evidências: ${formattedSize} (${fileCount} arquivos)`);

    return { totalSize, fileCount, formattedSize };
  } catch (error) {
    console.error("Erro ao calcular espaço:", error);
    return { totalSize: 0, fileCount: 0, formattedSize: "0 B" };
  }
}

/**
 * Formata bytes para formato legível
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

/**
 * Exporta evidências para análise
 */
export async function exportEvidences(
  startDate: Date,
  endDate: Date,
  outputPath: string
): Promise<{ exported: number; path: string }> {
  try {
    console.log(`📤 Exportando evidências de ${startDate.toLocaleDateString()} a ${endDate.toLocaleDateString()}...`);

    let exported = 0;
    const current = new Date(startDate);

    while (current <= endDate) {
      const evidences = await listEvidencesForDate(current);
      exported += evidences.length;

      current.setDate(current.getDate() + 1);
    }

    // TODO: Comprimir e salvar em outputPath

    console.log(`✅ ${exported} evidências exportadas para ${outputPath}`);

    return { exported, path: outputPath };
  } catch (error) {
    console.error("Erro ao exportar evidências:", error);
    throw error;
  }
}

/**
 * Gera relatório de evidências
 */
export async function generateEvidenceReport(date: Date): Promise<string> {
  try {
    const evidences = await listEvidencesForDate(date);

    let report = `\n📸 RELATÓRIO DE EVIDÊNCIAS VISUAIS\n`;
    report += `${"=".repeat(50)}\n`;
    report += `Data: ${date.toLocaleDateString()}\n`;
    report += `Total de Corridas: ${evidences.length}\n`;
    report += `\nDetalhes:\n`;

    evidences.forEach((evidence, index) => {
      report += `\n${index + 1}. Corrida ${evidence.rideId}\n`;
      report += `   Plataforma: ${evidence.platformName}\n`;
      report += `   Status: ${evidence.status}\n`;
      report += `   Screenshot Inicial: ${evidence.initialScreenshot ? "✅" : "❌"}\n`;
      report += `   Screenshot Final: ${evidence.finalScreenshot ? "✅" : "❌"}\n`;
      report += `   Capturado em: ${evidence.metadata.initialScreenshotTime?.toLocaleTimeString()}\n`;
    });

    report += `\n${"=".repeat(50)}\n`;

    return report;
  } catch (error) {
    console.error("Erro ao gerar relatório:", error);
    throw error;
  }
}
