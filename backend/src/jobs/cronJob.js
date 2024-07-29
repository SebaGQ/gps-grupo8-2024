import cron from 'node-cron';
import BinnacleService from '../services/binnacle.service.js';
import { generateReport } from '../utils/reportGenerator.js';

// Programa la tarea para que se ejecute todos los días a las 20:00
//  * *  *   *         *               *
// MM HH DD MM DIA DE LA SEMANA (0-7) AÑO
cron.schedule('59 23 * * *', async () => {
  try {
    const report = await BinnacleService.generateDailyReport();
    await generateReport(report);
    console.log('Reporte diario generado y enviado con éxito.');
  } catch (error) {
    console.error('Error al generar el reporte diario:', error);
  }
});
