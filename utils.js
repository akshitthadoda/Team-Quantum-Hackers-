/* ==========================================
   VENDORBRIDGE - UTILITY LIBRARY (CHARTS & EXPORTS)
   ========================================== */

const utils = {
  
  // --- CUSTOM SVG LINE/BAR CHART GENERATOR (Zero Dependency) ---
  renderLineChart: function(svgId, data, labels) {
    const svg = document.getElementById(svgId);
    if (!svg) return;
    svg.innerHTML = ''; // Clear existing
    
    const width = 500;
    const height = 240;
    const padding = 40;
    
    const maxVal = Math.max(...data) * 1.15 || 100;
    const minVal = 0;
    
    // Draw grid lines & Y-axis labels
    const gridCount = 4;
    for (let i = 0; i <= gridCount; i++) {
      const yVal = minVal + ((maxVal - minVal) / gridCount) * i;
      const yPos = height - padding - ((yVal - minVal) / (maxVal - minVal)) * (height - 2 * padding);
      
      // Horizontal grid line
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", padding);
      line.setAttribute("y1", yPos);
      line.setAttribute("x2", width - padding);
      line.setAttribute("y2", yPos);
      line.setAttribute("stroke", "var(--border-color)");
      line.setAttribute("stroke-width", "1");
      if (i > 0) line.setAttribute("stroke-dasharray", "4,4");
      svg.appendChild(line);
      
      // Y-axis label
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", padding - 8);
      text.setAttribute("y", yPos + 4);
      text.setAttribute("text-anchor", "end");
      text.setAttribute("fill", "var(--text-muted)");
      text.setAttribute("font-size", "10px");
      text.textContent = this.formatCurrencyShort(yVal);
      svg.appendChild(text);
    }
    
    // Calculate points coordinates
    const points = [];
    const stepX = (width - 2 * padding) / (data.length - 1 || 1);
    for (let i = 0; i < data.length; i++) {
      const x = padding + i * stepX;
      const y = height - padding - ((data[i] - minVal) / (maxVal - minVal)) * (height - 2 * padding);
      points.push({ x, y, val: data[i], label: labels[i] });
    }
    
    // Draw area path (gradient fill under line)
    if (points.length > 1) {
      let areaD = `M ${points[0].x} ${height - padding} `;
      points.forEach(p => { areaD += `L ${p.x} ${p.y} `; });
      areaD += `L ${points[points.length - 1].x} ${height - padding} Z`;
      
      // Create Gradient definition if not exists
      let defs = svg.querySelector("defs");
      if (!defs) {
        defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        svg.appendChild(defs);
      }
      defs.innerHTML = `
        <linearGradient id="chart-area-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--primary)" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="var(--primary)" stop-opacity="0.0"/>
        </linearGradient>
      `;
      
      const areaPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
      areaPath.setAttribute("d", areaD);
      areaPath.setAttribute("fill", "url(#chart-area-grad)");
      svg.appendChild(areaPath);
    }
    
    // Draw line path
    if (points.length > 1) {
      let lineD = `M ${points[0].x} ${points[0].y} `;
      for (let i = 1; i < points.length; i++) {
        lineD += `L ${points[i].x} ${points[i].y} `;
      }
      
      const linePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
      linePath.setAttribute("d", lineD);
      linePath.setAttribute("fill", "none");
      linePath.setAttribute("stroke", "var(--primary)");
      linePath.setAttribute("stroke-width", "2.5");
      linePath.setAttribute("filter", "drop-shadow(0px 4px 6px rgba(0, 240, 255, 0.4))");
      svg.appendChild(linePath);
    }
    
    // Draw data points nodes and labels
    points.forEach(p => {
      // Circle node
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", p.x);
      circle.setAttribute("cy", p.y);
      circle.setAttribute("r", "4");
      circle.setAttribute("fill", "var(--bg-app)");
      circle.setAttribute("stroke", "var(--primary)");
      circle.setAttribute("stroke-width", "2");
      svg.appendChild(circle);
      
      // X-axis label
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", p.x);
      text.setAttribute("y", height - padding + 16);
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("fill", "var(--text-muted)");
      text.setAttribute("font-size", "10px");
      text.textContent = p.label;
      svg.appendChild(text);
      
      // Value tooltip label (shows on point)
      const valText = document.createElementNS("http://www.w3.org/2000/svg", "text");
      valText.setAttribute("x", p.x);
      valText.setAttribute("y", p.y - 8);
      valText.setAttribute("text-anchor", "middle");
      valText.setAttribute("fill", "var(--text-primary)");
      valText.setAttribute("font-size", "9px");
      valText.setAttribute("font-weight", "bold");
      valText.textContent = this.formatCurrencyShort(p.val);
      svg.appendChild(valText);
    });
  },

  renderBarChart: function(svgId, data, labels) {
    const svg = document.getElementById(svgId);
    if (!svg) return;
    svg.innerHTML = '';
    
    const width = 500;
    const height = 240;
    const padding = 45;
    
    const maxVal = Math.max(...data) * 1.1 || 100;
    const minVal = 0;
    
    // Grid lines
    const gridCount = 4;
    for (let i = 0; i <= gridCount; i++) {
      const yVal = minVal + ((maxVal - minVal) / gridCount) * i;
      const yPos = height - padding - ((yVal - minVal) / (maxVal - minVal)) * (height - 2 * padding);
      
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", padding);
      line.setAttribute("y1", yPos);
      line.setAttribute("x2", width - padding);
      line.setAttribute("y2", yPos);
      line.setAttribute("stroke", "var(--border-color)");
      line.setAttribute("stroke-width", "1");
      if (i > 0) line.setAttribute("stroke-dasharray", "4,4");
      svg.appendChild(line);
      
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", padding - 8);
      text.setAttribute("y", yPos + 4);
      text.setAttribute("text-anchor", "end");
      text.setAttribute("fill", "var(--text-muted)");
      text.setAttribute("font-size", "10px");
      text.textContent = this.formatCurrencyShort(yVal);
      svg.appendChild(text);
    }
    
    // Draw bars
    const barCount = data.length;
    const chartWidth = width - 2 * padding;
    const barSpacing = chartWidth / barCount;
    const barWidth = barSpacing * 0.45;
    
    for (let i = 0; i < barCount; i++) {
      const x = padding + i * barSpacing + (barSpacing - barWidth) / 2;
      const barHeight = ((data[i] - minVal) / (maxVal - minVal)) * (height - 2 * padding);
      const y = height - padding - barHeight;
      
      // Bar Rect
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("x", x);
      rect.setAttribute("y", y);
      rect.setAttribute("width", barWidth);
      rect.setAttribute("height", Math.max(2, barHeight));
      rect.setAttribute("fill", "var(--primary)");
      rect.setAttribute("rx", "4"); // rounded top corners
      rect.setAttribute("filter", "drop-shadow(0px 2px 4px rgba(0, 240, 255, 0.2))");
      svg.appendChild(rect);
      
      // X label
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", x + barWidth / 2);
      text.setAttribute("y", height - padding + 16);
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("fill", "var(--text-muted)");
      text.setAttribute("font-size", "10px");
      text.textContent = labels[i];
      svg.appendChild(text);
      
      // Value label on top
      const valText = document.createElementNS("http://www.w3.org/2000/svg", "text");
      valText.setAttribute("x", x + barWidth / 2);
      valText.setAttribute("y", y - 6);
      valText.setAttribute("text-anchor", "middle");
      valText.setAttribute("fill", "var(--text-primary)");
      valText.setAttribute("font-size", "9px");
      valText.setAttribute("font-weight", "bold");
      valText.textContent = this.formatCurrencyShort(data[i]);
      svg.appendChild(valText);
    }
  },

  renderDonutChart: function(svgId, segments, legendId) {
    const svg = document.getElementById(svgId);
    const legend = document.getElementById(legendId);
    if (!svg) return;
    svg.innerHTML = '';
    
    let total = segments.reduce((sum, s) => sum + s.value, 0);
    if (total === 0) total = 1;
    
    const cx = 100;
    const cy = 100;
    const r = 70;
    const strokeWidth = 18;
    const circumference = 2 * Math.PI * r;
    
    let accumulatedAngle = 0;
    
    // Set colors
    const colors = ["var(--primary)", "var(--purple)", "var(--success)", "var(--warning)", "var(--info)"];
    
    if (legend) legend.innerHTML = '';
    
    segments.forEach((seg, index) => {
      const percentage = seg.value / total;
      const angleSize = percentage * 360;
      const strokeDash = percentage * circumference;
      const strokeOffset = circumference - accumulatedAngle + (circumference / 4); // Start at top
      
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", cx);
      circle.setAttribute("cy", cy);
      circle.setAttribute("r", r);
      circle.setAttribute("fill", "none");
      circle.setAttribute("stroke", colors[index % colors.length]);
      circle.setAttribute("stroke-width", strokeWidth);
      circle.setAttribute("stroke-dasharray", `${strokeDash} ${circumference}`);
      circle.setAttribute("stroke-dashoffset", strokeOffset);
      svg.appendChild(circle);
      
      accumulatedAngle += strokeDash;
      
      // Add to legend
      if (legend) {
        const item = document.createElement("div");
        item.className = "legend-item";
        item.innerHTML = `
          <span class="legend-color" style="background-color: ${colors[index % colors.length]};"></span>
          <span>${seg.label}: <strong>${(percentage * 100).toFixed(0)}%</strong></span>
        `;
        legend.appendChild(item);
      }
    });
    
    // Add center cut-out text (Total spend display)
    const textVal = document.createElementNS("http://www.w3.org/2000/svg", "text");
    textVal.setAttribute("x", cx);
    textVal.setAttribute("y", cy - 2);
    textVal.setAttribute("text-anchor", "middle");
    textVal.setAttribute("fill", "var(--text-primary)");
    textVal.setAttribute("font-size", "14px");
    textVal.setAttribute("font-weight", "bold");
    textVal.textContent = "Distribution";
    svg.appendChild(textVal);
    
    const textLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
    textLabel.setAttribute("x", cx);
    textLabel.setAttribute("y", cy + 14);
    textLabel.setAttribute("text-anchor", "middle");
    textLabel.setAttribute("fill", "var(--text-muted)");
    textLabel.setAttribute("font-size", "10px");
    textLabel.textContent = "by category";
    svg.appendChild(textLabel);
  },

  // --- LOCAL HIGH-RESOLUTION IMAGE GENERATION VIA CANVAS DRAW ---
  exportInvoiceAsImage: function(invoiceData) {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 1050;
    const ctx = canvas.getContext('2d');
    
    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Top border accent
    ctx.fillStyle = '#0ea5e9';
    ctx.fillRect(0, 0, canvas.width, 10);
    
    // Logo Icon Drawing (Bridge representation)
    ctx.fillStyle = '#0ea5e9';
    ctx.beginPath();
    ctx.arc(60, 65, 20, 0, Math.PI, true);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(60, 65, 14, 0, Math.PI, true);
    ctx.fill();
    
    // Logo text
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 24px Arial';
    ctx.fillText('VendorBridge', 95, 60);
    ctx.fillStyle = '#64748b';
    ctx.font = '12px Arial';
    ctx.fillText('PROCUREMENT SYSTEM', 95, 75);
    
    // Document metadata
    ctx.textAlign = 'right';
    ctx.fillStyle = '#0f172a';
    ctx.font = '28px Arial';
    ctx.fillText('PURCHASE ORDER', canvas.width - 50, 60);
    
    ctx.fillStyle = '#475569';
    ctx.font = '14px Arial';
    ctx.fillText(`PO Number: ${invoiceData.poId}`, canvas.width - 50, 85);
    ctx.fillText(`Date: ${invoiceData.date}`, canvas.width - 50, 105);
    ctx.fillText(`RFQ Ref: ${invoiceData.rfqId}`, canvas.width - 50, 125);
    
    // Horizontal line
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(50, 150);
    ctx.lineTo(canvas.width - 50, 150);
    ctx.stroke();
    
    // Addresses
    ctx.textAlign = 'left';
    // Supplier Left Column
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 11px Arial';
    ctx.fillText('ISSUED TO (SUPPLIER):', 50, 180);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 14px Arial';
    ctx.fillText(invoiceData.vendorName, 50, 202);
    ctx.fillStyle = '#475569';
    ctx.font = '12px Arial';
    ctx.fillText(invoiceData.vendorEmail, 50, 222);
    ctx.fillText(invoiceData.vendorAddress, 50, 240);
    ctx.fillText(invoiceData.vendorCountry, 50, 258);
    
    // Buyer Right Column
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 11px Arial';
    ctx.fillText('DELIVER TO (BUYER):', 420, 180);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('VendorBridge Operations', 420, 202);
    ctx.fillStyle = '#475569';
    ctx.font = '12px Arial';
    ctx.fillText('finance@vendorbridge.com', 420, 222);
    ctx.fillText('123 Tech Avenue, Suite 100', 420, 240);
    ctx.fillText('United States', 420, 258);
    
    // Table Header
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(50, 300, canvas.width - 100, 35);
    ctx.strokeStyle = '#cbd5e1';
    ctx.strokeRect(50, 300, canvas.width - 100, 35);
    
    ctx.fillStyle = '#475569';
    ctx.font = 'bold 11px Arial';
    ctx.fillText('ITEM DESCRIPTION', 65, 322);
    ctx.textAlign = 'center';
    ctx.fillText('QTY', 430, 322);
    ctx.textAlign = 'right';
    ctx.fillText('UNIT PRICE', 560, 322);
    ctx.fillText('TOTAL PRICE', 735, 322);
    
    // Draw items rows
    let currentY = 335;
    ctx.textAlign = 'left';
    ctx.font = '12px Arial';
    ctx.fillStyle = '#334155';
    
    invoiceData.items.forEach(item => {
      currentY += 30;
      
      // Draw background stripe on alternate rows
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(50, currentY - 20, canvas.width - 100, 30);
      
      // Draw border bottom
      ctx.strokeStyle = '#f1f5f9';
      ctx.beginPath();
      ctx.moveTo(50, currentY + 10);
      ctx.lineTo(canvas.width - 50, currentY + 10);
      ctx.stroke();
      
      ctx.fillStyle = '#0f172a';
      ctx.fillText(item.name, 65, currentY);
      
      ctx.textAlign = 'center';
      ctx.fillStyle = '#334155';
      ctx.fillText(`${item.qty} ${item.unit || 'Pcs'}`, 430, currentY);
      
      ctx.textAlign = 'right';
      ctx.fillText(`$${parseFloat(item.price).toFixed(2)}`, 560, currentY);
      ctx.fillText(`$${(item.qty * item.price).toFixed(2)}`, 735, currentY);
      
      ctx.textAlign = 'left'; // Reset
    });
    
    // Summary financials box
    currentY += 60;
    
    // Signatures / notes on the left
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 11px Arial';
    ctx.fillText('NOTES & SPECIAL INSTRUCTIONS:', 50, currentY);
    ctx.fillStyle = '#64748b';
    ctx.font = '11px Arial';
    ctx.fillText('Net 30 payment terms apply. Refer to PO ID in all shipments.', 50, currentY + 20);
    
    // System Authorized signature
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold italic 13px Courier New';
    ctx.fillText('System Approved Workflow', 50, currentY + 65);
    ctx.strokeStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.moveTo(50, currentY + 75);
    ctx.lineTo(230, currentY + 75);
    ctx.stroke();
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px Arial';
    ctx.fillText('AUTHORIZED SIGNATURE', 50, currentY + 92);
    
    // Financial numbers on the right
    const rightX = canvas.width - 50;
    ctx.textAlign = 'right';
    ctx.font = '12px Arial';
    ctx.fillStyle = '#475569';
    
    ctx.fillText('Subtotal:', 540, currentY);
    ctx.fillStyle = '#0f172a';
    ctx.fillText(`$${parseFloat(invoiceData.subtotal).toFixed(2)}`, rightX, currentY);
    
    currentY += 22;
    ctx.fillStyle = '#475569';
    ctx.fillText(`Tax (${invoiceData.taxRate}%):`, 540, currentY);
    ctx.fillStyle = '#0f172a';
    ctx.fillText(`$${parseFloat(invoiceData.taxAmount).toFixed(2)}`, rightX, currentY);
    
    currentY += 22;
    ctx.fillStyle = '#475569';
    ctx.fillText('Shipping & Handling:', 540, currentY);
    ctx.fillStyle = '#0f172a';
    ctx.fillText(`$${parseFloat(invoiceData.shipping).toFixed(2)}`, rightX, currentY);
    
    currentY += 30;
    // Grand total box
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('Grand Total:', 540, currentY);
    ctx.font = 'bold 18px Arial';
    ctx.fillText(`$${parseFloat(invoiceData.grandTotal).toFixed(2)}`, rightX, currentY);
    
    // Footer message
    ctx.textAlign = 'center';
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px Arial';
    ctx.fillText('Thank you for your business. For invoice inquiries, contact support@vendorbridge.com', canvas.width / 2, canvas.height - 40);
    
    // Trigger download
    const link = document.createElement('a');
    link.download = `Invoice_${invoiceData.poId}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  },
  
  // --- NATIVE PRINT TRIGGER FOR PDF ---
  exportInvoiceAsPDF: function() {
    window.print();
  },

  // --- Helper: Format numbers to compact currency ---
  formatCurrencyShort: function(value) {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`;
    return `$${parseFloat(value).toFixed(2)}`;
  },
  
  formatCurrency: function(value) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  }
};
