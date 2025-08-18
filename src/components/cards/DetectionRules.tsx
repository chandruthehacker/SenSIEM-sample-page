"use client"

import { useEffect, useState } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, PencilIcon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import clsx from "clsx"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DetectionRule {
  id: number
  name: string
  description: string
  rule_type: string
  log_type: string
  condition: string
  threshold: number
  time_window: number
  interval_minutes: number
  active: number // ✅ since your mockdata uses 0/1 instead of boolean
  last_run_id: number | null
}

export const mockRules: DetectionRule[] = [
  {
    id: 1,
    name: "Brute Force Login (Same IP)",
    description: "Detects 5 or more failed login attempts from a single IP within 2 minutes.",
    rule_type: "Brute-force",
    log_type: "auth.log",
    condition: "failed_login",
    threshold: 5,
    time_window: 1,
    interval_minutes: 1,
    active: 0,
    last_run_id: null
  },
  {
    id: 2,
    name: "Success After Failed Logins",
    description: "Detects successful login immediately after multiple failed attempts, indicating a potential brute force attempt.",
    rule_type: "Success-after-fail",
    log_type: "auth.log",
    condition: "mixed_login",
    threshold: 3,
    time_window: 300,
    interval_minutes: 2,
    active: 0,
    last_run_id: null
  },
  {
    id: 3,
    name: "Account Brute Force (Same User)",
    description: "Detects repeated failed logins for the same user account, indicating password guessing.",
    rule_type: "Account Brute-force",
    log_type: "auth.log",
    condition: "failed_login",
    threshold: 5,
    time_window: 1,
    interval_minutes: 2,
    active: 0,
    last_run_id: null
  },
  {
    id: 4,
    name: "Suspicious Process Execution",
    description: "Detects execution of suspicious processes such as netcat or nmap.",
    rule_type: "Suspicious Process",
    log_type: "process",
    condition: "nc,ncat,nmap,hydra",
    threshold: 1,
    time_window: 1,
    interval_minutes: 2,
    active: 0,
    last_run_id: null
  },
  {
    id: 5,
    name: "Odd Hour Login Detected",
    description: "Detects successful logins outside of business hours (e.g., between 12 AM and 5 AM).",
    rule_type: "Odd Hour Login",
    log_type: "auth.log",
    condition: "successful_login",
    threshold: 1,
    time_window: 1,
    interval_minutes: 5,
    active: 0,
    last_run_id: null
  },
  {
    id: 6,
    name: "Account Spray Attack",
    description: "Detects multiple failed logins using many usernames from a single IP (spray attack).",
    rule_type: "Account Spray",
    log_type: "auth.log",
    condition: "failed_login",
    threshold: 10,
    time_window: 1,
    interval_minutes: 2,
    active: 0,
    last_run_id: null
  },
  {
    id: 7,
    name: "Access Denied Flood",
    description: "Detects a flood of access denied logs from a user or IP in a short time.",
    rule_type: "Access Denied Flood",
    log_type: "auth.log",
    condition: "access_denied",
    threshold: 10,
    time_window: 1,
    interval_minutes: 1,
    active: 0,
    last_run_id: null
  },
  {
    id: 8,
    name: "Syslog Unauthorized Access",
    description: "Detects a high number of 'authentication failure' logs from a single source.",
    rule_type: "Syslog Unauthorized Access",
    log_type: "syslog",
    condition: "authentication failure",
    threshold: 5,
    time_window: 1,
    interval_minutes: 2,
    active: 0,
    last_run_id: null
  },
  {
    id: 9,
    name: "Syslog Privilege Escalation",
    description: "Detects logs indicating failed sudo or su attempts.",
    rule_type: "Syslog Privilege Escalation",
    log_type: "syslog",
    condition: "sudo,su",
    threshold: 1,
    time_window: 1,
    interval_minutes: 2,
    active: 0,
    last_run_id: null
  },
  {
    id: 10,
    name: "Syslog Service Restart Flood",
    description: "Detects frequent restarts of a single service in a short time window, indicating instability or attack.",
    rule_type: "Syslog Service Restart Flood",
    log_type: "syslog",
    condition: "restarting,stopping",
    threshold: 3,
    time_window: 1,
    interval_minutes: 5,
    active: 0,
    last_run_id: null
  },
  {
    id: 11,
    name: "Web Application Attack",
    description: "Detects SQL injection, local file inclusion, or directory traversal patterns in web requests.",
    rule_type: "Web Application Attack",
    log_type: "apache",
    condition: "' OR 1=1,../../,proc/self/environ",
    threshold: 1,
    time_window: 1,
    interval_minutes: 1,
    active: 0,
    last_run_id: null
  },
  {
    id: 12,
    name: "High 404 Detection",
    description: "Detects a high number of 404 (Not Found) errors from a single IP, a sign of content or vulnerability scanning.",
    rule_type: "High 404 Detection",
    log_type: "apache",
    condition: "404",
    threshold: 20,
    time_window: 1,
    interval_minutes: 5,
    active: 0,
    last_run_id: null
  },
  {
    id: 13,
    name: "Windows Failed Login Brute Force",
    description: "Detects a high number of failed logins (Event ID 4625) from a single IP on a Windows machine.",
    rule_type: "Windows Failed Login Brute Force",
    log_type: "windows_event",
    condition: "4625",
    threshold: 10,
    time_window: 1,
    interval_minutes: 2,
    active: 0,
    last_run_id: null
  },
  {
    id: 14,
    name: "Windows Audit Log Cleared",
    description: "Detects when the Windows Security Event Log has been cleared (Event ID 1102), a critical security event.",
    rule_type: "Windows Audit Log Cleared",
    log_type: "windows_event",
    condition: "1102",
    threshold: 1,
    time_window: 1,
    interval_minutes: 5,
    active: 0,
    last_run_id: null
  },
  {
    id: 15,
    name: "Firewall Port Scan Detection",
    description: "Detects an IP attempting to connect to 10 or more different ports in a short time, indicating a port scan.",
    rule_type: "Firewall Port Scan Detection",
    log_type: "firewall",
    condition: "port scan",
    threshold: 10,
    time_window: 1,
    interval_minutes: 2,
    active: 0,
    last_run_id: null
  },
  {
    id: 16,
    name: "IDS/IPS Exploit Detection",
    description: "Alerts when the IDS/IPS detects traffic matching a known exploit or malware signature.",
    rule_type: "IDS/IPS Exploit Detection",
    log_type: "ids_ips",
    condition: "CVE,Exploit,Malware",
    threshold: 1,
    time_window: 1,
    interval_minutes: 1,
    active: 0,
    last_run_id: null
  },
  {
    id: 17,
    name: "VPN Unusual Login Hours",
    description: "Detects successful VPN logins outside of normal working hours (10 PM - 6 AM).",
    rule_type: "VPN Unusual Login Hours",
    log_type: "vpn",
    condition: "connected",
    threshold: 1,
    time_window: 1,
    interval_minutes: 10,
    active: 0,
    last_run_id: null
  },
  {
    id: 18,
    name: "Cloud IAM Changes",
    description: "Detects changes to cloud IAM policies or creation of new credentials, a sign of account compromise.",
    rule_type: "Cloud IAM Changes",
    log_type: "cloud",
    condition: "create-policy,update-policy,delete-policy",
    threshold: 1,
    time_window: 1,
    interval_minutes: 5,
    active: 0,
    last_run_id: null
  },
  {
    id: 19,
    name: "DNS Tunneling Detection",
    description: "Detects unusually long DNS queries, which can be a sign of data exfiltration or command and control traffic.",
    rule_type: "DNS Tunneling Detection",
    log_type: "dns",
    condition: "100",
    threshold: 1,
    time_window: 1,
    interval_minutes: 1,
    active: 0,
    last_run_id: null
  },
  {
    id: 20,
    name: "Antivirus Threat Detection",
    description: "Alerts on any antivirus logs indicating malware detection or a quarantine failure.",
    rule_type: "Antivirus Threat Detection",
    log_type: "antivirus",
    condition: "malware detected,quarantine failed",
    threshold: 1,
    time_window: 1,
    interval_minutes: 1,
    active: 0,
    last_run_id: null
  },
  {
    id: 21,
    name: "Zeek Suspicious User Agent",
    description: "Detects web traffic with user agents known to be associated with scanners or bots.",
    rule_type: "Zeek Suspicious User Agent",
    log_type: "zeek",
    condition: "nmap,nikto,sqlmap",
    threshold: 1,
    time_window: 1,
    interval_minutes: 5,
    active: 0,
    last_run_id: null
  },
  {
    id: 22,
    name: "Email Phishing Detection",
    description: "Identifies emails with suspicious subjects, which may be part of a phishing campaign.",
    rule_type: "Email Phishing Detection",
    log_type: "email",
    condition: "invoice,urgent,password change",
    threshold: 1,
    time_window: 1,
    interval_minutes: 5,
    active: 0,
    last_run_id: null
  },
  {
    id: 23,
    name: "WAF Blocked SQLi/XSS",
    description: "Alerts when the Web Application Firewall blocks a request containing SQLi or XSS patterns.",
    rule_type: "WAF Blocked SQLi/XSS",
    log_type: "waf",
    condition: "blocked",
    threshold: 1,
    time_window: 1,
    interval_minutes: 1,
    active: 0,
    last_run_id: null
  },
  {
    id: 24,
    name: "Database Unauthorized Access",
    description: "Detects failed login attempts or access denied errors in database logs.",
    rule_type: "Database Unauthorized Access",
    log_type: "database",
    condition: "authentication failure,access denied",
    threshold: 3,
    time_window: 1,
    interval_minutes: 2,
    active: 0,
    last_run_id: null
  },
  {
    id: 25,
    name: "Proxy Malware URL Access",
    description: "Detects attempts to access URLs known to host malware or command and control servers.",
    rule_type: "Proxy Malware URL Access",
    log_type: "proxy",
    condition: "bad.com,malware.net",
    threshold: 1,
    time_window: 1,
    interval_minutes: 1,
    active: 0,
    last_run_id: null
  }
]


export default function DetectionRules() {
  const [rules, setRules] = useState<DetectionRule[]>([])
  const [loading, setLoading] = useState(true)
  const [disableConfirm, setDisableConfirm] = useState(false)
  const [pendingToggle, setPendingToggle] = useState<DetectionRule | null>(null)
  const [selectedLogType, setSelectedLogType] = useState("all")

  // Edit dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingRule, setEditingRule] = useState<DetectionRule | null>(null)
  const [editedThreshold, setEditedThreshold] = useState<number>(0)
  const [editedIntervalMinutes, setEditedIntervalMinutes] = useState<number>(0)

  useEffect(() => {
    setTimeout(() => {
      setRules(mockRules)   // 👈 use static dataset
      setLoading(false)
    }, 500)
  }, [])

  const toggleRule = (id: number, active: boolean) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: active ? 1 : 0 } : r))
    )
  }

  const onSwitchChange = (rule: DetectionRule, checked: boolean) => {
    if (!checked) {
      setPendingToggle(rule)
      setDisableConfirm(true)
    } else {
      toggleRule(rule.id, checked)
    }
  }

  const confirmDisable = () => {
    if (pendingToggle) {
      toggleRule(pendingToggle.id, false)
      setDisableConfirm(false)
      setPendingToggle(null)
    }
  }

  const handleEditClick = (rule: DetectionRule) => {
    setEditingRule(rule)
    setEditedThreshold(rule.threshold)
    setEditedIntervalMinutes(rule.interval_minutes)
    setEditDialogOpen(true)
  }

  const handleSaveEdit = () => {
    if (!editingRule) return
    setRules((prev) =>
      prev.map((r) =>
        r.id === editingRule.id
          ? { ...r, threshold: editedThreshold, interval_minutes: editedIntervalMinutes }
          : r
      )
    )
    setEditDialogOpen(false)
    setEditingRule(null)
  }

  const filteredRules =
    selectedLogType === "all"
      ? rules
      : rules.filter((rule) => rule.log_type === selectedLogType)

  return (
    <>
      <Card className="shadow-md border border-border rounded-xl">
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertCircle className="w-5 h-5 text-primary" />
            Detection Rules
          </CardTitle>
          <CardDescription className="flex items-center gap-4">
            <span>Enable or disable detection rules for different log types.</span>
            <Select onValueChange={setSelectedLogType} defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by log type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Log Types</SelectItem>
                <SelectItem value="auth.log">Auth Log</SelectItem>
                <SelectItem value="syslog">Syslog</SelectItem>
                <SelectItem value="apache">Apache</SelectItem>
                <SelectItem value="firewall">Firewall</SelectItem>
                <SelectItem value="windows_event">Windows Event</SelectItem>
                <SelectItem value="cloud">Cloud</SelectItem>
                <SelectItem value="vpn">VPN</SelectItem>
                <SelectItem value="dns">DNS</SelectItem>
                <SelectItem value="antivirus">Antivirus</SelectItem>
              </SelectContent>
            </Select>
          </CardDescription>
          {!loading && (
            <div className="absolute top-6 right-6 text-lg text-primary px-4 font-semibold bg-muted px-2 py-1 rounded-md shadow">
              {filteredRules.length} rule{filteredRules.length !== 1 ? "s" : ""}
            </div>
          )}
        </CardHeader>

        <CardContent
          className={clsx(
            "relative space-y-4 max-h-[400px] overflow-y-auto px-6 pt-4",
            "scrollbar-thin scrollbar-thumb-primary scrollbar-track-transparent scroll-smooth",
            "border-t border-border"
          )}
        >
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : filteredRules.length === 0 ? (
            <p className="text-sm italic text-muted-foreground">
              No detection rules available for the selected log type.
            </p>
          ) : (
            filteredRules.map((rule) => (
              <div
                key={rule.id}
                className="border border-zinc-700 bg-gradient-to-l from-gray-900 to-zinc-950 rounded-xl p-4 space-y-2 shadow-md"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-md">{rule.name}</h4>
                    <p className="text-sm text-muted-foreground">{rule.description}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditClick(rule)}
                      className="inline-flex items-center px-3 py-1 space-x-1 bg-zinc-800 hover:bg-zinc-700 rounded-xl"
                    >
                      <span>Edit</span> <PencilIcon className="w-4 h-4" />
                    </Button>
                    <Switch
                      checked={!!rule.active}
                      onCheckedChange={(val) => onSwitchChange(rule, val)}
                    />
                  </div>
                </div>
                <div className="text-sm text-muted-foreground flex flex-wrap gap-2 mt-2">
                  <Badge variant="secondary">{rule.log_type}</Badge>
                  <Badge variant="outline">{rule.rule_type}</Badge>
                  <Badge variant="default">Every {rule.interval_minutes} min</Badge>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Confirm Disable */}
      <Dialog open={disableConfirm} onOpenChange={setDisableConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Disable Detection Rule?</DialogTitle>
            <DialogDescription>
              Are you sure you want to disable "{pendingToggle?.name}"?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDisableConfirm(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDisable}>
              Disable
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Rule */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Detection Rule</DialogTitle>
            <DialogDescription>Modify parameters and save.</DialogDescription>
          </DialogHeader>
          {editingRule && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label>Name</label>
                <Input value={editingRule.name} readOnly className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label>Threshold</label>
                <Input
                  type="number"
                  value={editedThreshold}
                  onChange={(e) => setEditedThreshold(parseInt(e.target.value))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label>Interval (min)</label>
                <Input
                  type="number"
                  value={editedIntervalMinutes}
                  onChange={(e) => setEditedIntervalMinutes(parseInt(e.target.value))}
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
