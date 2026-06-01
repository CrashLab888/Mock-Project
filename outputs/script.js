const transactions = [
  { id: 1, date: "2026-05-29", title: "ซื้อสีทำป้าย", category: "กิจกรรม", amount: 850, status: "approved" },
  { id: 2, date: "2026-05-28", title: "เช่าเครื่องเสียง", category: "อุปกรณ์", amount: 2500, status: "approved" },
  { id: 3, date: "2026-05-23", title: "ค่าอาหารทีมอาสา", category: "สวัสดิการ", amount: 1320, status: "approved" },
  { id: 4, date: "2026-05-18", title: "อุปกรณ์วันวิทยาศาสตร์", category: "กิจกรรม", amount: 4200, status: "approved" },
  { id: 5, date: "2026-04-30", title: "ค่าพิมพ์เอกสารประชาสัมพันธ์", category: "ประชาสัมพันธ์", amount: 680, status: "approved" },
  { id: 6, date: "2026-04-22", title: "ของรางวัลกิจกรรมกีฬา", category: "กิจกรรม", amount: 3200, status: "approved" },
  { id: 7, date: "2026-04-12", title: "ค่าซ่อมบอร์ดประกาศ", category: "อุปกรณ์", amount: 1450, status: "pending" },
  { id: 8, date: "2026-03-27", title: "ค่าเดินทางประชุมเครือข่าย", category: "บริหาร", amount: 1800, status: "approved" },
  { id: 9, date: "2026-03-14", title: "ชุดปฐมพยาบาลงานกีฬา", category: "สวัสดิการ", amount: 960, status: "approved" },
  { id: 10, date: "2026-02-26", title: "ตกแต่งเวทีเลือกตั้งสภา", category: "ประชาสัมพันธ์", amount: 2800, status: "approved" },
  { id: 11, date: "2026-02-08", title: "สมุดบันทึกประชุม", category: "บริหาร", amount: 540, status: "approved" },
  { id: 12, date: "2026-01-19", title: "ค่าป้ายรณรงค์รักษาความสะอาด", category: "ประชาสัมพันธ์", amount: 1750, status: "approved" }
];

const projects = [
  { id: 1, name: "วันวิทยาศาสตร์", budget: 12000, spent: 10400, status: "completed" },
  { id: 2, name: "กีฬาสีสัมพันธ์", budget: 18000, spent: 14250, status: "in-progress" },
  { id: 3, name: "เลือกตั้งสภานักเรียน", budget: 9000, spent: 7350, status: "completed" },
  { id: 4, name: "โรงเรียนสะอาด", budget: 6500, spent: 4100, status: "in-progress" },
  { id: 5, name: "เสียงนักเรียน", budget: 5000, spent: 2200, status: "in-progress" },
  { id: 6, name: "ค่ายผู้นำเยาวชน", budget: 15000, spent: 0, status: "pending" }
];

const totalBudget = 65500;
const spent = transactions
  .filter((item) => item.status === "approved")
  .reduce((sum, item) => sum + item.amount, 0);
const formatter = new Intl.NumberFormat("th-TH");
const currency = (value) => `${formatter.format(value)} บาท`;

const statusText = {
  approved: "อนุมัติแล้ว",
  pending: "รอตรวจสอบ",
  completed: "เสร็จสิ้น",
  "in-progress": "กำลังดำเนินการ"
};

function thaiDate(value, options = { day: "numeric", month: "short" }) {
  return new Intl.DateTimeFormat("th-TH", options).format(new Date(value));
}

function renderKpis() {
  const items = [
    { label: "งบประมาณทั้งหมด", value: currency(totalBudget), note: "งบปีการศึกษา 2026" },
    { label: "ใช้ไปแล้ว", value: currency(spent), note: `${Math.round((spent / totalBudget) * 100)}% ของงบทั้งหมด` },
    { label: "คงเหลือ", value: currency(totalBudget - spent), note: "พร้อมใช้สำหรับโครงการถัดไป" },
    { label: "จำนวนรายการ", value: `${transactions.length} รายการ`, note: "รวมรายการรอตรวจสอบ" }
  ];

  document.querySelector("#kpiGrid").innerHTML = items
    .map((item) => `
      <article class="kpi-card">
        <span>${item.label}</span>
        <strong>${item.value}</strong>
        <small>${item.note}</small>
      </article>
    `)
    .join("");
}

function renderTimeline() {
  document.querySelector("#recentTimeline").innerHTML = transactions
    .slice(0, 5)
    .map((item) => `
      <article class="timeline-item">
        <div class="timeline-date">${thaiDate(item.date)}</div>
        <div>
          <div class="timeline-title">${item.title}</div>
          <div class="timeline-category">${item.category} · ${statusText[item.status]}</div>
        </div>
        <div class="timeline-amount">${currency(item.amount)}</div>
      </article>
    `)
    .join("");
}

function renderProjects() {
  document.querySelector("#projectGrid").innerHTML = projects
    .map((project) => {
      const percent = project.budget ? Math.min(Math.round((project.spent / project.budget) * 100), 100) : 0;
      const statusClass = project.status === "pending" ? "pending" : "";
      return `
        <article class="project-card">
          <h3>${project.name}</h3>
          <div class="project-stats">
            <div>
              <span>งบอนุมัติ</span>
              <strong>${currency(project.budget)}</strong>
            </div>
            <div>
              <span>ใช้จริง</span>
              <strong>${currency(project.spent)}</strong>
            </div>
          </div>
          <div class="progress" aria-label="ใช้งบไปแล้ว ${percent}%">
            <span style="width: ${percent}%"></span>
          </div>
          <span class="status ${statusClass}">${statusText[project.status]}</span>
        </article>
      `;
    })
    .join("");
}

function populateFilters() {
  const categories = [...new Set(transactions.map((item) => item.category))];
  const select = document.querySelector("#categoryFilter");
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    select.appendChild(option);
  });
}

function renderTable() {
  const search = document.querySelector("#searchInput").value.trim().toLowerCase();
  const category = document.querySelector("#categoryFilter").value;
  const rows = transactions.filter((item) => {
    const matchesSearch = [item.title, item.category, statusText[item.status]]
      .join(" ")
      .toLowerCase()
      .includes(search);
    const matchesCategory = category === "all" || item.category === category;
    return matchesSearch && matchesCategory;
  });

  document.querySelector("#transactionTable").innerHTML = rows
    .map((item) => `
      <tr>
        <td>${thaiDate(item.date, { day: "numeric", month: "short", year: "numeric" })}</td>
        <td>${item.title}</td>
        <td>${item.category}</td>
        <td class="amount">${currency(item.amount)}</td>
        <td><span class="status ${item.status === "pending" ? "pending" : ""}">${statusText[item.status]}</span></td>
      </tr>
    `)
    .join("");

  document.querySelector("#emptyState").hidden = rows.length > 0;
}

function groupSum(items, keyFn, valueFn) {
  return items.reduce((acc, item) => {
    const key = keyFn(item);
    acc[key] = (acc[key] || 0) + valueFn(item);
    return acc;
  }, {});
}

function renderCharts() {
  if (!window.Chart) {
    document.querySelectorAll(".chart-card").forEach((card) => {
      card.insertAdjacentHTML("beforeend", "<p>ไม่สามารถโหลด Chart.js ได้ในขณะนี้</p>");
    });
    return;
  }

  const approved = transactions.filter((item) => item.status === "approved");
  const categoryTotals = groupSum(approved, (item) => item.category, (item) => item.amount);
  const projectTotals = [...projects].sort((a, b) => b.spent - a.spent).slice(0, 5);
  const compactLineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      line: { borderWidth: 2, tension: 0.38 },
      point: { radius: 2.5, hoverRadius: 4, borderWidth: 2 }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 5 }
      },
      y: {
        beginAtZero: true,
        border: { display: false },
        grid: { color: "rgba(204, 214, 227, 0.35)", drawTicks: false },
        ticks: { maxTicksLimit: 4 }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        displayColors: false,
        callbacks: { label: (context) => currency(context.parsed.y) }
      }
    }
  };

  Chart.defaults.font.family = 'Arial, "Tahoma", sans-serif';
  Chart.defaults.color = "#5d6b82";

  new Chart(document.querySelector("#categoryChart"), {
    type: "line",
    data: {
      labels: Object.keys(categoryTotals),
      datasets: [{
        data: Object.values(categoryTotals),
        borderColor: "#ff6b1a",
        backgroundColor: "rgba(255, 107, 26, 0.12)",
        pointBackgroundColor: "#ffffff",
        pointBorderColor: "#ff6b1a",
        fill: false
      }]
    },
    options: compactLineOptions
  });

  new Chart(document.querySelector("#projectChart"), {
    type: "line",
    data: {
      labels: projectTotals.map((project) => project.name),
      datasets: [{
        data: projectTotals.map((project) => project.spent),
        borderColor: "#09162f",
        backgroundColor: "rgba(9, 22, 47, 0.08)",
        pointBackgroundColor: "#ffffff",
        pointBorderColor: "#09162f",
        fill: false
      }]
    },
    options: compactLineOptions
  });
}

renderKpis();
renderTimeline();
renderProjects();
populateFilters();
renderTable();
renderCharts();

document.querySelector("#searchInput").addEventListener("input", renderTable);
document.querySelector("#categoryFilter").addEventListener("change", renderTable);
document.querySelectorAll("[data-export]").forEach((button) => {
  button.addEventListener("click", () => {
    const type = button.dataset.export.toUpperCase();
    window.alert(`Download ${type} จะเปิดใช้งานในเวอร์ชันถัดไป`);
  });
});
