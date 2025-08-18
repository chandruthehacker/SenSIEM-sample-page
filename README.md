<div align="center">
  <img src="src/assets/SenSIEM.png" alt="SenSIEM Logo" width="90%" />

  # ⚡ SenSIEM – Sample Log Viewer Page  

  🚀 A modern, interactive **SIEM (Security Information and Event Management)** inspired dashboard built with **React + Tailwind + shadcn/ui**.  
  Browse, search, and analyze logs in real-time with mock data support and a clean UI.  
</div>

---

## 🌐 Live Demo
👉 [Click here to view the page](https://chandruthehacker.github.io/SenSIEM-sample-page)  

---

## 📸 Preview
Here’s how it looks in action:

![SenSIEM Preview](src/assets/Search.png)

---

## 🚀 Features

### 🔍 Log Search (Splunk-like)
- Filter logs by log level, IP address, username, source, and time range
- Supports smart query syntax and alias matching
- View full log details in an interactive expandable dialog

### 📊 Dashboards
- Visual charts for log levels, alerts, suspicious IPs, and sources
- Auto-refreshing dashboards with drill-down capabilities

### 📁 Logs Viewer
- Complete view of ingested logs with quick filter chips
- Supports custom ingestion with dynamic log type detection

### 🚨 Alerts
- Real-time alerts triggered by detection rules (e.g., brute force, failed logins)
- Color-coded severity levels with timestamp and log source linkage
- Alert details dialog with scrollable context

### ⚙️ Settings
- Configure monitored paths or ingest files manually
- Manage detection rules, thresholds, and alert frequency
- Set up notification preferences (Email, Slack, Telegram)

---

## 🧠 Built-in Detection Rules

- 🔐 Brute-force login detection
- 🧑‍💻 Failed login spike alerts
- 📊 Anomaly detection based on log frequency
- 📈 Suspicious IP or geo-location monitoring

Rules run continuously and can be fine-tuned per log type, time window, and threshold.

---