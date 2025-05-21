const PDFDocument = require('pdfkit');
const moment = require('moment');
const fs = require('fs');

// Load the logo image
const logoBuffer = fs.readFileSync('images/logo.jpg');

async function generateInvoiceBuffer({ name, email, amount, status, tx_ref, date, appointmentDate, appointmentTime, services = [] }) {
  // Create document with bleed
  const doc = new PDFDocument({ 
    margin: 50, 
    size: 'A4',
    info: {
      Title: 'Payment Receipt',
      Author: 'Dr. Admikew Surgical & Medical Speciality Center',
      Subject: 'Invoice',
      Keywords: 'receipt, payment, medical services'
    }
  });
  
  const buffers = [];
  doc.on('data', buffers.push.bind(buffers));

  const endPromise = new Promise((resolve) => {
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(buffers);
      resolve(pdfBuffer);
    });
  });

  // Color scheme
  const colors = {
    primary: '#0284c7',    // Sky-blue - Brand color
    secondary: '#047857',  // Emerald - Secondary accent
    dark: '#1f2937',       // Dark gray for main text
    gray: '#6b7280',       // Medium gray for secondary text
    light: '#f3f4f6',      // Light background
    border: '#e5e7eb',     // Border color
    success: '#10b981',    // Success green
    pending: '#f59e0b'     // Pending/warning orange
  };

  // Define reusable functions
  const drawHorizontalLine = (y) => {
    doc.strokeColor(colors.border)
       .lineWidth(1)
       .moveTo(50, y)
       .lineTo(550, y)
       .stroke();
  };

  // Background design elements
  doc.rect(0, 0, doc.page.width, 130)
     .fill('#f0f9ff'); // Light blue background at top
  
  doc.rect(0, doc.page.height - 80, doc.page.width, 80)
     .fill('#f0f9ff'); // Light blue background at bottom

  // Header with Logo and Title
  doc.image(logoBuffer, 50, 45, { width: 120 });

  doc.font('Helvetica-Bold')
     .fillColor(colors.primary)
     .fontSize(24)
     .text('OFFICIAL RECEIPT', 220, 50, { align: 'right' });

  doc.font('Helvetica')
     .fillColor(colors.gray)
     .fontSize(10)
     .text('Dr. Admikew Surgical & Medical Speciality Center', 220, 80, { align: 'right' })
     .text('Jigjiga, Somalia ', 220, 95, { align: 'right' })
     .text('info@anbesg.com | +251-25-278-2051', 220, 110, { align: 'right' });
  
  // Receipt number and date section
  doc.roundedRect(50, 150, 500, 80, 5)
     .fillAndStroke(colors.light, colors.border);

  doc.font('Helvetica-Bold')
     .fillColor(colors.dark)
     .fontSize(12)
     .text('RECEIPT NO:', 70, 165)
     .text('ISSUE DATE:', 70, 185)
     .text('STATUS:', 70, 205);
  
  const statusColor = status.toLowerCase() === 'paid' ? colors.success : 
                     (status.toLowerCase() === 'pending' ? colors.pending : colors.gray);

  doc.font('Helvetica')
     .fillColor(colors.dark)
     .text(tx_ref, 170, 165)
     .text(moment(date).format('MMMM Do YYYY, h:mm:ss a'), 170, 185);
  
  doc.fillColor(statusColor)
     .font('Helvetica-Bold')
     .text(status.toUpperCase(), 170, 205);

  // Customer Information
  doc.font('Helvetica-Bold')
     .fillColor(colors.primary)
     .fontSize(14)
     .text('CLIENT INFORMATION', 50, 250);
  
  drawHorizontalLine(270);

  doc.font('Helvetica-Bold')
     .fillColor(colors.dark)
     .fontSize(11)
     .text('Client Name:', 50, 285)
     .text('Email Address:', 50, 305);

  if (appointmentDate && appointmentTime) {
    doc.text('Appointment:', 50, 325);
  }
  
  doc.font('Helvetica')
     .fillColor(colors.gray)
     .text(name, 150, 285)
     .text(email, 150, 305);

  if (appointmentDate && appointmentTime) {
    const formattedDate = moment(appointmentDate).format('MMMM Do YYYY');
    doc.text(`${formattedDate} at ${appointmentTime}`, 150, 325);
  }

  // Payment Details
  doc.font('Helvetica-Bold')
     .fillColor(colors.primary)
     .fontSize(14)
     .text('PAYMENT DETAILS', 50, 360);
  
  drawHorizontalLine(380);

  // Table Headers
  doc.fillColor(colors.dark)
     .fontSize(11)
     .text('DESCRIPTION', 50, 395)
     .text('AMOUNT (ETB)', 450, 395, { align: 'right' });
  
  drawHorizontalLine(410);
  
  // Line items
  let yPosition = 425;
  
  // If services are provided, list them
  if (services && services.length > 0) {
    // Registration fee (always present)
    doc.font('Helvetica')
       .fillColor(colors.gray)
       .fontSize(10)
       .text('Registration Fee', 50, yPosition)
       .text('300.00', 450, yPosition, { align: 'right' });
    
    yPosition += 20;
    
    // List all services
    services.forEach(service => {
      doc.text(service.name, 50, yPosition)
         .text(service.price.toFixed(2), 450, yPosition, { align: 'right' });
      yPosition += 20;
    });
  } else {
    // Generic service line if no detailed services
    doc.font('Helvetica')
       .fillColor(colors.gray)
       .fontSize(10)
       .text('Medical Services', 50, yPosition)
       .text(amount.toFixed(2), 450, yPosition, { align: 'right' });
    
    yPosition += 20;
  }
  
  // Draw separator before totals
  drawHorizontalLine(yPosition + 5);
  yPosition += 25;

  // Total section
  doc.font('Helvetica-Bold')
     .fontSize(12)
     .fillColor(colors.dark)
     .text('TOTAL AMOUNT:', 350, yPosition)
     .fillColor(colors.secondary)
     .text(`${amount.toFixed(2)} ETB`, 450, yPosition, { align: 'right' });

  yPosition += 20;
  
  doc.font('Helvetica-Bold')
     .fillColor(colors.dark)
     .text('PAYMENT STATUS:', 350, yPosition)
     .fillColor(statusColor)
     .text(status.toUpperCase(), 450, yPosition, { align: 'right' });

  // QR Code placeholder (if needed)
  // doc.rect(50, yPosition - 40, 100, 100).stroke();
  // In a real implementation, you would generate and place a QR code here

  // Thank You Note
  doc.font('Helvetica-Bold')
     .fillColor(colors.secondary)
     .fontSize(14)
     .text('Thank You for Choosing Dr. Admikew Surgical & Medical Speciality Center', 50, doc.page.height - 160, { align: 'center' });
  
  // Footer
  doc.font('Helvetica')
     .fillColor(colors.gray)
     .fontSize(9)
     .text('This is an electronically generated receipt and does not require signature.', 50, doc.page.height - 120, { align: 'center' })
     .text('For questions regarding this receipt, please contact info@anbesg.com', 50, doc.page.height - 100, { align: 'center' })
     .text(`© ${moment().format('YYYY')} Dr. Admikew Surgical & Medical Speciality Center. All rights reserved.`, 50, doc.page.height - 85, { align: 'center' });

  doc.end();
  return endPromise;
}

module.exports = { generateInvoiceBuffer };
