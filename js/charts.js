/**
 * EduPulse SIMS - High-Performance Canvas Charts
 * Lightweight, zero-dependency, Retina-crisp visual analytics
 */

const ChartEngine = {
  // Support high-DPI retina rendering
  setupCanvas(canvas) {
    if (!canvas) return null;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    // Set actual canvas pixels
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    return { ctx, width: rect.width, height: rect.height };
  },

  // 1. Department Enrollment Donut Chart
  renderDeptDonut(canvasId, data, legendId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const setup = this.setupCanvas(canvas);
    if (!setup) return;
    const { ctx, width, height } = setup;

    const colors = {
      'CSE': '#3b82f6',
      'AIDS': '#8b5cf6',
      'ECE': '#10b981',
      'MECH': '#f59e0b',
      'OTHER': '#64748b'
    };

    const total = Object.values(data).reduce((a, b) => a + b, 0);
    if (total === 0) {
      ctx.fillStyle = '#94a3b8';
      ctx.textAlign = 'center';
      ctx.font = '14px Inter, sans-serif';
      ctx.fillText('No data available', width / 2, height / 2);
      return;
    }

    const centerX = width / 2;
    const centerY = height / 2;
    const outerRadius = Math.min(centerX, centerY) - 15;
    const innerRadius = outerRadius * 0.62;

    let startAngle = -Math.PI / 2;

    Object.entries(data).forEach(([dept, count]) => {
      const sliceAngle = (count / total) * 2 * Math.PI;
      const endAngle = startAngle + sliceAngle;
      const color = colors[dept] || '#64748b';

      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle);
      ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
      ctx.closePath();

      ctx.fillStyle = color;
      ctx.shadowColor = color + '40';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;

      startAngle = endAngle;
    });

    // Center cutout content
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius - 2, 0, 2 * Math.PI);
    ctx.fillStyle = document.body.classList.contains('light-theme') ? '#ffffff' : '#111827';
    ctx.fill();

    // Center text
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = document.body.classList.contains('light-theme') ? '#1e293b' : '#f8fafc';
    ctx.font = 'bold 22px Outfit, sans-serif';
    ctx.fillText(`${total}`, centerX, centerY - 6);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px Inter, sans-serif';
    ctx.fillText('STUDENTS', centerX, centerY + 14);

    // Populate legend if container provided
    if (legendId) {
      const legendEl = document.getElementById(legendId);
      if (legendEl) {
        legendEl.innerHTML = Object.entries(data).map(([dept, count]) => {
          const pct = Math.round((count / total) * 100);
          const color = colors[dept] || '#64748b';
          return `
            <div class="donut-legend-item">
              <span class="legend-dot" style="background:${color}"></span>
              <span class="legend-label">${dept}</span>
              <span class="legend-val">${count} <small>(${pct}%)</small></span>
            </div>
          `;
        }).join('');
      }
    }
  },

  // 2. Grade Distribution Bar Chart
  renderGradeBar(canvasId, gradeDist) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const setup = this.setupCanvas(canvas);
    if (!setup) return;
    const { ctx, width, height } = setup;

    const entries = Object.entries(gradeDist);
    const maxVal = Math.max(...entries.map(([, v]) => v), 5);

    const paddingBottom = 28;
    const paddingTop = 20;
    const paddingLeft = 32;
    const paddingRight = 16;
    const chartHeight = height - paddingBottom - paddingTop;
    const chartWidth = width - paddingLeft - paddingRight;

    // Grid lines
    ctx.strokeStyle = document.body.classList.contains('light-theme') ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.07)';
    ctx.lineWidth = 1;
    const steps = 4;
    for (let i = 0; i <= steps; i++) {
      const y = paddingTop + (chartHeight / steps) * i;
      ctx.beginPath();
      ctx.moveTo(paddingLeft, y);
      ctx.lineTo(width - paddingRight, y);
      ctx.stroke();

      // Y-axis label
      const val = Math.round(maxVal - (maxVal / steps) * i);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`${val}`, paddingLeft - 6, y + 3);
    }

    const barWidth = Math.min(36, chartWidth / entries.length - 14);
    const stepX = chartWidth / entries.length;

    const palette = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

    entries.forEach(([label, val], idx) => {
      const x = paddingLeft + idx * stepX + (stepX - barWidth) / 2;
      const barH = (val / maxVal) * chartHeight;
      const y = paddingTop + chartHeight - barH;
      const color = palette[idx % palette.length];

      // Bar gradient
      const grad = ctx.createLinearGradient(0, y, 0, y + barH);
      grad.addColorStop(0, color);
      grad.addColorStop(1, color + '55');

      // Rounded rect
      ctx.fillStyle = grad;
      ctx.beginPath();
      const r = 4;
      if (barH > 5) {
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + barWidth - r, y);
        ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + r);
        ctx.lineTo(x + barWidth, y + barH);
        ctx.lineTo(x, y + barH);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
      } else {
        ctx.rect(x, y, barWidth, Math.max(2, barH));
      }
      ctx.closePath();
      ctx.fill();

      // Value label on top
      ctx.fillStyle = document.body.classList.contains('light-theme') ? '#1e293b' : '#f1f5f9';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${val}`, x + barWidth / 2, y - 6);

      // X-axis label
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px Inter, sans-serif';
      const shortLabel = label.split(' ')[0];
      ctx.fillText(shortLabel, x + barWidth / 2, height - 8);
    });
  },

  // 3. Student Profile SGPA Progression Trendline Chart
  renderSgpaLine(canvasId, history) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const setup = this.setupCanvas(canvas);
    if (!setup) return;
    const { ctx, width, height } = setup;

    if (!history || history.length === 0) return;

    const padLeft = 36;
    const padRight = 24;
    const padTop = 20;
    const padBottom = 26;
    const plotW = width - padLeft - padRight;
    const plotH = height - padTop - padBottom;

    // Fixed SGPA scale from 4.0 to 10.0
    const minY = 4.0;
    const maxY = 10.0;

    // Y Gridlines
    ctx.strokeStyle = document.body.classList.contains('light-theme') ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)';
    for (let g = 4; g <= 10; g += 2) {
      const y = padTop + plotH - ((g - minY) / (maxY - minY)) * plotH;
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(width - padRight, y);
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`${g}.0`, padLeft - 6, y + 3);
    }

    const points = history.map((item, i) => {
      const x = history.length === 1 
        ? padLeft + plotW / 2 
        : padLeft + (i / (history.length - 1)) * plotW;
      const y = padTop + plotH - ((item.sgpa - minY) / (maxY - minY)) * plotH;
      return { x, y, sgpa: item.sgpa, label: item.semester };
    });

    // Area fill gradient under curve
    if (points.length > 1) {
      const areaGrad = ctx.createLinearGradient(0, padTop, 0, padTop + plotH);
      areaGrad.addColorStop(0, 'rgba(59, 130, 246, 0.35)');
      areaGrad.addColorStop(1, 'rgba(59, 130, 246, 0.00)');

      ctx.beginPath();
      ctx.moveTo(points[0].x, padTop + plotH);
      points.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.lineTo(points[points.length - 1].x, padTop + plotH);
      ctx.closePath();
      ctx.fillStyle = areaGrad;
      ctx.fill();
    }

    // Line stroke
    ctx.beginPath();
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    points.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();

    // Data dots & labels
    points.forEach(p => {
      // Glow dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#60a5fa';
      ctx.shadowColor = '#3b82f6';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      // SGPA value text
      ctx.fillStyle = document.body.classList.contains('light-theme') ? '#1e293b' : '#ffffff';
      ctx.font = 'bold 10px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(p.sgpa.toFixed(2), p.x, p.y - 9);

      // X Label
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px Inter, sans-serif';
      ctx.fillText(p.label, p.x, height - 6);
    });
  }
};

window.ChartEngine = ChartEngine;
