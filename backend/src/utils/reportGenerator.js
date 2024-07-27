import Report from '../models/report.model.js';

export async function generateReport(data) {
    try {
      // Almacenar el reporte en la base de datos
      const newReport = new Report({ data });
      await newReport.save();
  
      console.log('Reporte almacenado en la base de datos con éxito.');
  
      // Opción para enviar el reporte por correo (comentar si no se utiliza)
      // const filePath = await generateExcelFile(data);
      // await sendEmailWithAttachment(filePath);
  
    } catch (error) {
      console.error('Error al generar el reporte:', error);
      throw error;
    }
  }

// export async function generateReport(data) {
//   try {
//     const wb = xlsx.utils.book_new();
//     const ws = xlsx.utils.json_to_sheet(data);
//     xlsx.utils.book_append_sheet(wb, ws, 'Binnacle Report');

//     const filePath = path.resolve('Binnacle_Report.xlsx');
//     xlsx.writeFile(wb, filePath);

//     await sendEmailWithAttachment(filePath);
//   } catch (error) {
//     console.error('Error al generar el reporte:', error);
//     throw error;
//   }
// }

// async function sendEmailWithAttachment(filePath) {
//   const transporter = nodemailer.createTransport({
//     service: 'gmail', // Utiliza el servicio de correo que prefieras
//     auth: {
//       user: 'tu_correo@gmail.com',
//       pass: 'tu_contraseña'
//     }
//   });

//   const mailOptions = {
//     from: 'tu_correo@gmail.com',
//     to: 'destinatario@correo.com',
//     subject: 'Reporte Diario de Bitácoras',
//     text: 'Adjunto encontrarás el reporte diario de bitácoras.',
//     attachments: [
//       {
//         path: filePath
//       }
//     ]
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log('Correo enviado con éxito.');
//   } catch (error) {
//     console.error('Error al enviar el correo:', error);
//     throw error;
//   }
// }
