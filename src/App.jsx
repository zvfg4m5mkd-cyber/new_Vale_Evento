import React, { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  BellRing,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Database,
  Factory,
  FileText,
  Gauge,
  GitBranch,
  HelpCircle,
  Layers3,
  Link2,
  MapPin,
  MonitorCog,
  RadioTower,
  Route,
  Search,
  Settings,
  ShieldAlert,
  Timer,
  Truck,
  Wrench,
} from "lucide-react";

const minecareModules = [
  {
    id: "home",
    code: "00",
    label: "MineCare式工作台",
    pt: "Página inicial",
    icon: HelpCircle,
    pages: ["功能入口", "闭环主线", "多源监测"],
  },
  {
    id: "event",
    code: "M1",
    label: "事件处理",
    pt: "Event Handling / Tratamento de Eventos",
    icon: BellRing,
    pages: ["事件主列表", "事件详情", "诊断与工单回填"],
  },
  {
    id: "realtime",
    code: "M2",
    label: "实时监控",
    pt: "Real-Time Monitoring",
    icon: RadioTower,
    pages: ["设备清单", "创建监控", "实时曲线"],
  },
  {
    id: "trend",
    code: "M3",
    label: "趋势分析 / 报表",
    pt: "Trending Client / Reports",
    icon: BarChart3,
    pages: ["趋势总览", "趋势明细", "报警报表", "CMA Web"],
  },
  {
    id: "time",
    code: "M4",
    label: "时间追踪",
    pt: "Time Tracking / Rastreamento de Tempo",
    icon: Timer,
    pages: ["活动列表", "活动详情", "设备释放"],
  },
  {
    id: "integration",
    code: "X1",
    label: "集成闭环",
    pt: "SAP / PCM / MCM / PowerBI",
    icon: Layers3,
    pages: ["系统边界", "接口对象", "规则库"],
  },
];

const events = [
  {
    unidade: "EX-9400E-032",
    evento: "Hydraulic Oil Temperature High",
    fonte: "OEM Interface",
    primeiro: "26/05 08:14",
    ultimo: "26/05 10:31",
    snapshot: "101.2 ℃",
    contagem: 12,
    valor: "101.2 ℃",
    status: "Não aceito",
    nivel: "Critical",
    oem: "EID 172 / FMI 15",
    causa: "Cooling efficiency low / Filter restriction",
    action: "Check radiator, fan speed, oil filter differential pressure and contamination level.",
  },
  {
    unidade: "TR-XDE260-041",
    evento: "Brake Pressure Low",
    fonte: "Telemetry Trend",
    primeiro: "26/05 07:48",
    ultimo: "26/05 09:16",
    snapshot: "72 bar",
    contagem: 5,
    valor: "72 bar",
    status: "Aceito",
    nivel: "High",
    oem: "SPN 1067 / FMI 01",
    causa: "Possible leakage or pressure sensor drift",
    action: "Verify pressure sensor, brake accumulator and leakage evidence.",
  },
  {
    unidade: "EX-9400E-018",
    evento: "Battery Voltage Fluctuation",
    fonte: "MineCare Trend",
    primeiro: "25/05 21:04",
    ultimo: "26/05 08:52",
    snapshot: "23.1 V",
    contagem: 3,
    valor: "23.1 V",
    status: "Observação",
    nivel: "Medium",
    oem: "CID 168 / FMI 02",
    causa: "Charging circuit instability",
    action: "Keep observation and check alternator output in next maintenance window.",
  },
  {
    unidade: "DR-620-011",
    evento: "Drill Hydraulic Pump Pressure Drop",
    fonte: "External Backend",
    primeiro: "26/05 06:32",
    ultimo: "26/05 06:58",
    snapshot: "178 bar",
    contagem: 4,
    valor: "178 bar",
    status: "Não aceito",
    nivel: "High",
    oem: "EID 441 / FMI 18",
    causa: "Pump efficiency degradation or oil viscosity abnormal",
    action: "Compare pressure and temperature; run targeted inspection if pressure continues down.",
  },
];

const equipmentRows = [
  { categoria: "Excavator", grupo: "Carajás Norte", modelo: "XE9400E", frota: "EX-9400E", interface: "OEM / J1939", despacho: "Apto", ping: "Online", hora: "10:32:18", unidade: "EX-9400E-032" },
  { categoria: "Truck", grupo: "S11D", modelo: "XDE260", frota: "TR-XDE260", interface: "Telemetry", despacho: "Parado", ping: "Online", hora: "10:31:44", unidade: "TR-XDE260-041" },
  { categoria: "Excavator", grupo: "Serra Norte", modelo: "XE9400E", frota: "EX-9400E", interface: "OEM / VIMS", despacho: "Standby", ping: "Late", hora: "09:54:02", unidade: "EX-9400E-018" },
  { categoria: "Drill", grupo: "Carajás Norte", modelo: "XR620", frota: "DR-620", interface: "OEM Backend", despacho: "Apto", ping: "Online", hora: "10:30:58", unidade: "DR-620-011" },
];

const activityRows = [
  { eq: "EX-9400E-032", inicio: "26/05 09:30", trabalho: "Hydraulic cooling system inspection", sub: "Clean radiator / filter DP check", om: "40039512", ect: "16:00", comment: "YCO - Ordem aberta pela telemetria" },
  { eq: "TR-XDE260-041", inicio: "26/05 10:00", trabalho: "Brake pressure verification", sub: "Accumulator test", om: "40039531", ect: "14:30", comment: "Waiting maintenance confirmation" },
  { eq: "EX-9400E-018", inicio: "25/05 22:10", trabalho: "Electrical inspection", sub: "Battery / alternator measurement", om: "40039288", ect: "Released", comment: "Keep under observation" },
];

const trendRows = [
  { modelo: "XE9400E", tag: "EX-9400E-032", data: "26/05 08:14", evento: "Temp. óleo hidráulico alta", turma: "A", eixo: "Norte", operador: "OP-1842", local: "Pit 3" },
  { modelo: "XDE260", tag: "TR-XDE260-041", data: "26/05 07:48", evento: "Pressão de freio baixa", turma: "B", eixo: "Sul", operador: "OP-0911", local: "Ramp 5" },
  { modelo: "XR620", tag: "DR-620-011", data: "26/05 06:32", evento: "Queda pressão bomba", turma: "A", eixo: "Norte", operador: "OP-2618", local: "Bench 12" },
];

const cmaFields = [
  ["OM de Origem", "40039512"],
  ["ID da Análise", "CMA-ROTA-2026-0526-017"],
  ["Condição do Ativo", "Anormal / em observação"],
  ["Status do Ativo", "Parado para inspeção"],
  ["Risco de Falha", "Alto"],
  ["Impacto de Falha", "Risco de parada não programada e perda de DF"],
  ["Diagnóstico", "Temperatura elevada associada à perda de eficiência de arrefecimento."],
  ["Recomendações", "Inspecionar radiador, ventilador, filtro e qualidade do óleo; validar curva após intervenção."],
];

const rules = [
  { title: "Critical / Don’t Go", text: "Critical、Level 3或满足安全/停机风险条件时，CMA可直接联动CCM/MCM进入紧急停机与YEM路径。" },
  { title: "趋势规则权限", text: "趋势规则新增、阈值修改和模型变更应由指定CMA或可靠性工程管理员维护。" },
  { title: "Nota / OM边界", text: "本系统可触发或关联Nota/OM，但正式维修对象、计划、备件、执行和关闭仍由SAP PM承载。" },
  { title: "事件关闭", text: "工单完成不等于事件关闭；需验证参数恢复、告警消失、设备释放和CMA/MCM确认。" },
];

function toneFor(value) {
  if (["Critical", "Não aceito", "Parado", "High", "Late"].includes(value)) return "red";
  if (["Medium", "Observação", "Standby"].includes(value)) return "amber";
  if (["Online", "Apto", "Aceito", "Released"].includes(value)) return "green";
  return "slate";
}

function Badge({ children, tone = "slate" }) {
  const map = {
    slate: "bg-slate-100 text-slate-700 border-slate-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-800 border-amber-200",
    red: "bg-rose-50 text-rose-700 border-rose-200",
    dark: "bg-slate-900 text-white border-slate-900",
  };
  return <span className={`inline-flex items-center rounded-md border px-2 py-1 text-[11px] font-semibold leading-none ${map[tone]}`}>{children}</span>;
}

function Panel({ title, subtitle, icon: Icon, children, right }) {
  return (
    <section className="rounded-xl border border-slate-300 bg-white shadow-sm">
      <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-4 py-3">
        <div className="flex items-start gap-3">
          {Icon && <div className="rounded-lg border border-slate-200 bg-white p-2 text-slate-700"><Icon className="h-4 w-4" /></div>}
          <div>
            <h3 className="text-sm font-bold text-slate-900">{title}</h3>
            {subtitle && <p className="mt-1 text-xs leading-5 text-slate-500">{subtitle}</p>}
          </div>
        </div>
        {right}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

function MiniTable({ columns, rows, onRowClick, selectedKey, rowKey }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <table className="w-full border-collapse text-left text-xs">
        <thead className="bg-slate-100 text-[11px] uppercase tracking-wide text-slate-500">
          <tr>{columns.map((c) => <th key={c.key} className="border-b border-slate-200 px-3 py-2 font-bold">{c.label}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {rows.map((r, i) => {
            const key = rowKey ? rowKey(r) : i;
            const selected = selectedKey && selectedKey === key;
            return (
              <tr key={key} onClick={() => onRowClick?.(r)} className={`${onRowClick ? "cursor-pointer hover:bg-blue-50/50" : ""} ${selected ? "bg-blue-50" : ""}`}>
                {columns.map((c) => (
                  <td key={c.key} className="px-3 py-2 align-top text-slate-700">
                    {c.render ? c.render(r[c.key], r) : r[c.key]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function FieldGrid({ items, cols = "md:grid-cols-4" }) {
  return (
    <div className={`grid gap-2 ${cols}`}>
      {items.map(([k, v]) => (
        <div key={k} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{k}</div>
          <div className="mt-1 text-sm font-semibold text-slate-800">{v}</div>
        </div>
      ))}
    </div>
  );
}

function SimpleBars({ data }) {
  return (
    <div className="flex h-36 items-end gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
      {data.map((d) => (
        <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
          <div className="w-full rounded-t bg-slate-700" style={{ height: `${d.value}%` }} />
          <span className="text-[10px] font-semibold text-slate-500">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

function SignalCurve({ name, unit, values }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-bold text-slate-700">{name}</span>
        <Badge tone="blue">{values[values.length - 1]} {unit}</Badge>
      </div>
      <div className="space-y-1.5">
        {values.map((v, idx) => (
          <div key={`${name}-${idx}`} className="flex items-center gap-2">
            <span className="w-7 text-[10px] text-slate-400">T{idx + 1}</span>
            <div className="h-2 flex-1 rounded bg-slate-100">
              <div className="h-2 rounded bg-slate-700" style={{ width: `${Math.min(100, Math.max(8, v))}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScenarioHeader({ code, title, pt, description, steps }) {
  return (
    <div className="mb-4 rounded-xl border border-slate-800 bg-slate-900 p-5 text-white shadow-sm">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge tone="dark">{code}</Badge>
            <span className="text-xs font-medium text-slate-300">{pt}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-300">{description}</p>
        </div>
        <div className="grid min-w-[360px] grid-cols-4 gap-2 text-center text-[11px] font-semibold text-slate-100">
          {steps.map((s, i) => (
            <div key={s} className="rounded-lg bg-white/10 p-2">
              <div className="mx-auto mb-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] text-slate-900">{i + 1}</div>
              {s}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MineCareChrome({ active, setActive, children }) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-800 bg-slate-950 text-white">
        <div className="flex h-14 items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600"><MonitorCog className="h-5 w-5" /></div>
            <div>
              <div className="text-sm font-bold">XGSS · Equipment Health & Event Management</div>
              <div className="text-[11px] text-slate-400">MineCare-style PWA Prototype · CMA / MCM / PCM / SAP</div>
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-300 lg:flex">
            <Search className="h-3.5 w-3.5" />
            Search Unit / Event / OM / Nota
          </div>
        </div>
        <div className="flex gap-1 overflow-x-auto border-t border-slate-800 px-5 py-2">
          {minecareModules.map((m) => {
            const Icon = m.icon;
            const selected = active === m.id;
            return (
              <button key={m.id} onClick={() => setActive(m.id)} className={`flex min-w-[180px] items-center gap-2 rounded-lg px-3 py-2 text-left transition ${selected ? "bg-white text-slate-950" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}>
                <Icon className="h-4 w-4 shrink-0" />
                <span>
                  <span className="block text-xs font-bold">{m.code} · {m.label}</span>
                  <span className={`block text-[10px] ${selected ? "text-slate-500" : "text-slate-500"}`}>{m.pt}</span>
                </span>
              </button>
            );
          })}
        </div>
      </header>
      <div className="grid grid-cols-12 gap-0">
        <aside className="col-span-12 border-b border-slate-300 bg-white p-4 lg:col-span-3 lg:min-h-[calc(100vh-100px)] lg:border-b-0 lg:border-r xl:col-span-2">
          <div className="mb-3 text-[11px] font-bold uppercase tracking-wide text-slate-400">Page Structure</div>
          <div className="space-y-2">
            {minecareModules.map((m) => {
              const selected = active === m.id;
              return (
                <button key={m.id} onClick={() => setActive(m.id)} className={`w-full rounded-lg border p-3 text-left transition ${selected ? "border-blue-300 bg-blue-50" : "border-slate-200 bg-white hover:bg-slate-50"}`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900">{m.code} {m.label}</span>
                    <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {m.pages.map((p) => <span key={p} className="rounded bg-slate-100 px-1.5 py-1 text-[10px] text-slate-500">{p}</span>)}
                  </div>
                </button>
              );
            })}
          </div>
        </aside>
        <main className="col-span-12 p-4 lg:col-span-9 xl:col-span-10">{children}</main>
      </div>
    </div>
  );
}

function HomePage() {
  return (
    <>
      <ScenarioHeader
        code="00"
        title="MineCare式设备健康与事件管理工作台"
        pt="Home / Help System / Application Launcher"
        description="本版将原型改造成接近MineCare页面构成的工作台：以四大应用入口为主线，覆盖事件处理、实时监控、趋势分析、时间追踪，并保留CMA Web、SAP PM、PCM、PowerBI的外围集成边界。"
        steps={["设备状态", "事件处理", "参数验证", "维修闭环"]}
      />
      <div className="grid gap-4 xl:grid-cols-3">
        <Panel title="四大功能模块入口" subtitle="对应MineCare帮助系统/功能轮盘式入口" icon={BookOpen}>
          <div className="grid gap-3 md:grid-cols-2">
            {minecareModules.slice(1, 5).map((m) => {
              const Icon = m.icon;
              return (
                <div key={m.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-3 flex items-center gap-2"><Icon className="h-5 w-5 text-blue-600" /><span className="text-sm font-bold">{m.code} {m.label}</span></div>
                  <div className="text-xs leading-5 text-slate-600">{m.pages.join(" / ")}</div>
                </div>
              );
            })}
          </div>
        </Panel>
        <Panel title="现场业务闭环" subtitle="从MineCare事件识别到SAP/PCM/MCM闭环" icon={GitBranch}>
          <div className="space-y-2 text-xs">
            {["设备数据 / OEM报警 / 操作员反馈", "MineCare事件与趋势识别", "CMA研判：Critical / Non-critical / Don’t Go", "SAP Nota / OM进入PCM计划", "MCM Time Tracking跟踪停机与释放", "PowerBI复盘DF、MTTR、MTBF"].map((x, i) => (
              <div key={x} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-2">
                <span className="flex h-6 w-6 items-center justify-center rounded bg-slate-900 text-[11px] font-bold text-white">{i + 1}</span>
                <span className="font-medium text-slate-700">{x}</span>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="多源监测输入" subtitle="MineCare不是CMA全部，而是专业监测系统之一" icon={Database}>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              ["MineCare", "事件 / 实时 / 趋势 / 时间追踪"],
              ["MineStar Health", "CAT设备报警与Level分级"],
              ["MEMS", "轮胎压力 / 温度 / 磨损"],
              ["Oil & Vibration", "实验室与专项监测报告"],
              ["CMA Web", "Laudo / 分析报告 / 推荐"],
              ["SAP PM", "Nota / OM / 正式维修闭环"],
            ].map(([a, b]) => (
              <div key={a} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="font-bold text-slate-800">{a}</div>
                <div className="mt-1 leading-4 text-slate-500">{b}</div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}

function EventPage() {
  const [selected, setSelected] = useState(events[0]);
  const columns = [
    { key: "unidade", label: "Unidade" },
    { key: "evento", label: "Evento / Descrição" },
    { key: "fonte", label: "Fonte" },
    { key: "primeiro", label: "Primeiro" },
    { key: "ultimo", label: "Último" },
    { key: "snapshot", label: "Snapshot" },
    { key: "contagem", label: "Contagem" },
    { key: "valor", label: "Último Valor" },
    { key: "status", label: "Status", render: (v) => <Badge tone={toneFor(v)}>{v}</Badge> },
  ];
  return (
    <>
      <ScenarioHeader
        code="M1"
        title="事件处理：Tratamento de Eventos"
        pt="Event Handling"
        description="页面构成按MineCare事件处理模块重做：先用主列表集中呈现设备报警与趋势事件，再进入事件详情查看等级、OEM编码、潜在原因、Troubleshooting、相似事件和工单回填。"
        steps={["事件汇总", "筛选接受", "诊断详情", "开单/回填"]}
      />
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <Panel title="事件处理主列表" subtitle="集中展示OEM事件和趋势事件；CMA从这里识别重复、高频、严重或未接受事件" icon={BellRing} right={<Badge tone="red">4 Não aceito</Badge>}>
            <div className="mb-3 flex flex-wrap gap-2 text-xs">
              {['Critical', 'Non-critical', 'Não aceito', 'Aceito', 'OEM ID', 'Last 24h'].map((f) => <button key={f} className="rounded border border-slate-200 bg-white px-2.5 py-1.5 font-semibold text-slate-600 hover:bg-slate-50">{f}</button>)}
            </div>
            <MiniTable columns={columns} rows={events} onRowClick={setSelected} selectedKey={selected.unidade} rowKey={(r) => r.unidade} />
          </Panel>
        </div>
        <Panel title="事件详情与诊断分析" subtitle="Detalhes de Notificação：从报警走向可诊断事件" icon={AlertTriangle} right={<Badge tone={toneFor(selected.nivel)}>{selected.nivel}</Badge>}>
          <FieldGrid cols="grid-cols-2" items={[
            ["Unidade", selected.unidade],
            ["Nível", selected.nivel],
            ["ID OEM / Interface", selected.oem],
            ["Último Valor", selected.valor],
          ]} />
          <div className="mt-3 rounded-lg border border-slate-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">
            <b>Causa potencial：</b>{selected.causa}<br />
            <b>Ações recomendadas：</b>{selected.action}
          </div>
          <div className="mt-3 grid gap-2">
            <button className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-left text-xs font-bold text-blue-700">Buscar notificações similares</button>
            <button className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-xs font-bold text-slate-700">Abrir Real-Time Monitoring</button>
            <button className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-xs font-bold text-slate-700">Criar / Vincular Nota SAP</button>
          </div>
          <div className="mt-3 rounded-lg bg-slate-900 p-3 text-xs leading-5 text-slate-100">
            Comentário: YCO - Ordem aberta pela telemetria. OM 40039512 linked to event.
          </div>
        </Panel>
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Panel title="事件诊断区块" subtitle="MineCare式详情页通常要放原因、建议、排查步骤、GPS和历史相似事件" icon={FileText}>
          <div className="grid gap-2 text-xs">
            {["Causa potencial / 潜在原因", "Ações recomendadas / 推荐动作", "Troubleshooting / 排查建议", "GPS / Localização", "Histórico / Similar Notifications"].map((x) => <div key={x} className="rounded-lg bg-slate-50 p-2 font-medium text-slate-700">{x}</div>)}
          </div>
        </Panel>
        <Panel title="业务规则" subtitle="事件识别阶段控制点" icon={Settings}>
          <div className="space-y-2 text-xs leading-5 text-slate-600">
            <p><b>重复事件：</b>同一设备、同一系统、同一OEM编码或故障模式在窗口内重复出现时合并观察。</p>
            <p><b>Don’t Go：</b>Critical、Level 3、安全风险、停机风险或持续超限时进入紧急路径。</p>
            <p><b>非紧急：</b>通过CMA Web形成分析后，触发或关联SAP Nota进入PCM计划。</p>
          </div>
        </Panel>
        <Panel title="事件到工单" subtitle="告警不是终点，必须能回填Nota/OM与处理结果" icon={Link2}>
          <FieldGrid cols="grid-cols-2" items={[["Nota", "10084529"], ["OM", "40039512"], ["Tipo", "YCO / YCM"], ["Status", "Em execução"]]} />
        </Panel>
      </div>
    </>
  );
}

function RealTimePage() {
  const [selected, setSelected] = useState(equipmentRows[0]);
  const cols = [
    { key: "categoria", label: "Categoria" },
    { key: "grupo", label: "Grupo" },
    { key: "modelo", label: "Modelo" },
    { key: "frota", label: "Frota" },
    { key: "interface", label: "Interface" },
    { key: "despacho", label: "Estado do despacho", render: (v) => <Badge tone={toneFor(v)}>{v}</Badge> },
    { key: "ping", label: "Estado do Ping", render: (v) => <Badge tone={toneFor(v)}>{v}</Badge> },
    { key: "hora", label: "Hora do Ping" },
  ];
  return (
    <>
      <ScenarioHeader
        code="M2"
        title="实时监控：设备清单、参数配置与实时曲线"
        pt="Real-Time Monitoring"
        description="按MineCare实时监控页面构成重做：先进入设备列表确认设备在线、接口和调度状态，再为具体设备创建监控会话、选择OEM参数，最后用实时曲线验证异常是否持续或恶化。"
        steps={["选设备", "确认Ping", "选参数", "看曲线"]}
      />
      <div className="grid gap-4 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <Panel title="设备清单与通讯状态" subtitle="设备在线、接口和调度状态是事件判断前提" icon={Truck}>
            <MiniTable columns={cols} rows={equipmentRows} onRowClick={setSelected} selectedKey={selected.unidade} rowKey={(r) => r.unidade} />
          </Panel>
        </div>
        <div className="xl:col-span-2">
          <Panel title="创建实时监控会话" subtitle="选择接口、参数和最大监控时长" icon={RadioTower} right={<Badge tone="green">Ping {selected.ping}</Badge>}>
            <FieldGrid cols="grid-cols-2" items={[
              ["Unidade", selected.unidade],
              ["Carga", "Alta / Production"],
              ["Razão", "Telemetry event"],
              ["Próxima ação", "Check within 30 min"],
              ["Interface OEM", selected.interface],
              ["Duração máxima", "60 min"],
            ]} />
            <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="mb-2 text-xs font-bold text-slate-700">Parâmetros OEM</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {["Engine Speed", "Engine Oil Pressure", "Oil Filter DP", "Hydraulic Oil Temp", "Fan Speed", "Battery Voltage"].map((p) => <label key={p} className="flex items-center gap-2 rounded bg-white p-2"><input type="checkbox" defaultChecked={p.includes("Oil") || p.includes("Hydraulic")} />{p}</label>)}
              </div>
            </div>
          </Panel>
        </div>
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Panel title="实时曲线图" subtitle="多参数同屏对比，用于验证异常是否持续、恢复或达到停机阈值" icon={Activity}>
          <div className="space-y-3">
            <SignalCurve name="Hydraulic Oil Temperature" unit="℃" values={[62, 68, 74, 81, 88, 96, 101]} />
            <SignalCurve name="Oil Filter Differential Pressure" unit="kPa" values={[20, 25, 30, 38, 45, 54, 61]} />
          </div>
        </Panel>
        <Panel title="异常验证判断" subtitle="CMA与MCM沟通时的判断依据" icon={ShieldAlert}>
          <div className="space-y-2 text-xs leading-5 text-slate-600">
            <div className="rounded-lg bg-rose-50 p-3 text-rose-700"><b>停止/Don’t Go：</b>参数持续恶化且超过停机阈值。</div>
            <div className="rounded-lg bg-amber-50 p-3 text-amber-800"><b>合并窗口：</b>异常可控，建议合并下个停机/保养窗口处理。</div>
            <div className="rounded-lg bg-emerald-50 p-3 text-emerald-700"><b>继续观察：</b>参数恢复或未达到阈值，保持趋势监控。</div>
          </div>
        </Panel>
        <Panel title="GPS与下一动作" subtitle="界面中保留Carga、Próxima ação、Hora da próxima ação等字段" icon={MapPin}>
          <FieldGrid cols="grid-cols-2" items={[["Localização GPS", "-6.03, -50.18"], ["Hora da próxima ação", "11:00"], ["Dispatch", selected.despacho], ["Ping", selected.hora]]} />
        </Panel>
      </div>
    </>
  );
}

function TrendPage() {
  const trendCols = [
    { key: "modelo", label: "modelo" },
    { key: "tag", label: "TAG" },
    { key: "data", label: "Data Hora" },
    { key: "evento", label: "evento_PT" },
    { key: "turma", label: "Turma" },
    { key: "eixo", label: "Eixo Mina" },
    { key: "operador", label: "operador" },
    { key: "local", label: "local" },
  ];
  return (
    <>
      <ScenarioHeader
        code="M3"
        title="趋势分析、遥测报表与CMA Web结构化分析"
        pt="Trending Client / Telemetry Reports / CMA Web"
        description="按照MineCare趋势分析与外围CMA Web页面重做：包括趋势事件总览、趋势明细下钻、遥测报警报表、报警明细与故障类型，以及CMA Web资产选择和诊断填写。"
        steps={["看趋势", "下钻明细", "统计报表", "CMA分析"]}
      />
      <div className="grid gap-4 xl:grid-cols-3">
        <Panel title="趋势事件分析总览" subtitle="按设备、模型、矿区位置、班次和事件描述识别异常集中区域" icon={BarChart3}>
          <SimpleBars data={[{ label: "Mon", value: 42 }, { label: "Tue", value: 64 }, { label: "Wed", value: 51 }, { label: "Thu", value: 78 }, { label: "Fri", value: 58 }, { label: "Sat", value: 86 }]} />
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            {["Grupo", "Modelo", "Equipamento", "Operador", "Eixo Mina", "Escala Turma", "Evento Descrição", "Ano"].map((x) => <div key={x} className="rounded bg-slate-50 p-2 font-semibold text-slate-600">{x}</div>)}
          </div>
        </Panel>
        <Panel title="遥测报警报表总览" subtitle="Evento por Dia/Mês、Criticidade、Equipamentos" icon={Gauge}>
          <div className="space-y-3">
            <SimpleBars data={[{ label: "Critical", value: 70 }, { label: "High", value: 55 }, { label: "Medium", value: 32 }, { label: "Info", value: 20 }]} />
            <FieldGrid cols="grid-cols-2" items={[["Eventos", "1,286"], ["Critical", "74"], ["Equipamentos", "126"], ["Aberta > 7d", "18"]]} />
          </div>
        </Panel>
        <Panel title="报警明细与故障类型" subtitle="查看报警是否已关联Nota/OM，统计机械、电气、操作等故障类型" icon={Database}>
          <div className="space-y-2 text-xs">
            {[["Mechanical", 42], ["Electrical", 23], ["Operation", 18], ["Hydraulic", 17]].map(([n, v]) => (
              <div key={n}>
                <div className="mb-1 flex justify-between font-semibold"><span>{n}</span><span>{v}%</span></div>
                <div className="h-2 rounded bg-slate-100"><div className="h-2 rounded bg-slate-700" style={{ width: `${v}%` }} /></div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <Panel title="趋势事件明细表" subtitle="从仪表板下钻到具体设备、时间、班次、地点和操作员" icon={ClipboardList}>
          <MiniTable columns={trendCols} rows={trendRows} />
        </Panel>
        <Panel title="CMA Web：资产选择与诊断填写" subtitle="承接MineCare事件和趋势输出，形成结构化Laudo/分析报告" icon={FileText}>
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <div className="mb-2 text-xs font-bold text-slate-600">Busca de ativos / 设备结构树</div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs leading-6">
                EX-9400E-032<br />└─ Hydraulic System<br />&nbsp;&nbsp;&nbsp;└─ Cooling Circuit<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└─ Filter / Radiator / Fan
              </div>
            </div>
            <FieldGrid cols="grid-cols-1" items={cmaFields.slice(0, 4)} />
          </div>
          <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3 text-xs leading-5 text-slate-600">
            <b>Diagnóstico：</b>{cmaFields[6][1]}<br />
            <b>Recomendações：</b>{cmaFields[7][1]}
          </div>
        </Panel>
      </div>
    </>
  );
}

function TimePage() {
  const [selected, setSelected] = useState(activityRows[0]);
  const columns = [
    { key: "eq", label: "Equipamento" },
    { key: "inicio", label: "Início do Tempo" },
    { key: "trabalho", label: "Descrição do Trabalho" },
    { key: "sub", label: "Última Subatividade" },
    { key: "om", label: "No. de Ordem de Serviço" },
    { key: "ect", label: "ECT" },
    { key: "comment", label: "Comentário" },
  ];
  return (
    <>
      <ScenarioHeader
        code="M4"
        title="时间追踪：Rastreamento de Tempo / Lista de Atividades"
        pt="Time Tracking"
        description="按照MCM Time Tracking页面构成重做：活动列表集中展示当前活动中和待处理设备，活动详情登记OM、子活动、负责人、状态/原因、系统/总成，并支撑设备释放。"
        steps={["查活动", "看OM", "记子活动", "释放设备"]}
      />
      <div className="grid gap-4 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <Panel title="Lista de Atividades 活动列表" subtitle="MCM跟踪停机状态的主界面；CMA多用于查询，MCM/CCM负责维护状态" icon={Timer}>
            <MiniTable columns={columns} rows={activityRows} onRowClick={setSelected} selectedKey={selected.eq} rowKey={(r) => r.eq} />
          </Panel>
        </div>
        <div className="xl:col-span-2">
          <Panel title="Detalhes de Atividade 活动详情" subtitle="对单台设备的维修活动进行详细登记和跟踪" icon={Wrench} right={<Badge tone={selected.ect === "Released" ? "green" : "amber"}>ECT {selected.ect}</Badge>}>
            <FieldGrid cols="grid-cols-2" items={[
              ["Equipamento", selected.eq],
              ["Tipo de Equipamento", selected.eq.includes("TR") ? "Truck" : "Excavator"],
              ["No. Ordem Serviço", selected.om],
              ["Responsável", "MCM / MC Execution"],
              ["Estado / Razão", selected.ect === "Released" ? "Released" : "Maintenance"],
              ["Sistema / Conjunto", selected.eq.includes("TR") ? "Brake" : "Hydraulic"],
            ]} />
            <div className="mt-3 rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-600">
              <b>Descrição：</b>{selected.trabalho}<br />
              <b>Subatividade：</b>{selected.sub}<br />
              <b>Comentário：</b>{selected.comment}
            </div>
          </Panel>
        </div>
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Panel title="子活动记录" subtitle="维修执行拆分到检查、处理、测试、释放" icon={ClipboardList}>
          <div className="space-y-2 text-xs">
            {["Inspection started", "Root cause confirmed", "Repair / cleaning / replacement", "Operational test", "Equipment released"].map((x, i) => (
              <div key={x} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-2">
                <CheckCircle2 className={`h-4 w-4 ${i < 3 ? "text-emerald-600" : "text-slate-300"}`} />
                <span className="font-medium text-slate-700">{x}</span>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="设备释放控制" subtitle="MCM确认设备是否恢复运行、是否交还调度" icon={Route}>
          <FieldGrid cols="grid-cols-2" items={[["Release", "Pending"], ["Dispatch", "Return after test"], ["Observation", "24h"], ["SAP Close", "After validation"]]} />
        </Panel>
        <Panel title="时间追踪业务规则" subtitle="停机代码、OM、活动状态进入指标口径" icon={Settings}>
          <div className="space-y-2 text-xs leading-5 text-slate-600">
            <p><b>活动状态：</b>Pending → In progress → Waiting validation → Released。</p>
            <p><b>责任边界：</b>SAP维护正式OM；MineCare/MCM跟踪停机状态和现场活动。</p>
            <p><b>指标口径：</b>停机时长、预计释放、OM状态用于DF/MTTR复盘。</p>
          </div>
        </Panel>
      </div>
    </>
  );
}

function IntegrationPage() {
  return (
    <>
      <ScenarioHeader
        code="X1"
        title="集成闭环：MineCare / CMA Web / SAP PM / PCM / MCM / PowerBI"
        pt="System Boundary & Business Rules"
        description="把新原型与XGSS发布端统一起来：设备健康与事件管理模块承担现场事件工作台能力，SAP PM承载正式维修闭环，PCM承载计划备料排程，MCM承载停机释放，PowerBI承载复盘分析。"
        steps={["发现", "研判", "开单", "复盘"]}
      />
      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="系统边界与业务流" subtitle="设备数据 → MineCare事件/趋势 → CMA分析 → SAP Nota/OM → PCM计划 → MCM释放 → BI复盘" icon={Layers3}>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="grid gap-2 text-center text-xs font-bold text-slate-700">
              <div className="rounded-lg bg-white p-3 shadow-sm">设备 / 数据源层<br /><span className="font-normal text-slate-500">XCMG / CAT / Komatsu · ECU / VIMS / J1939 / MEMS</span></div>
              <div className="grid gap-2 md:grid-cols-3">
                <div className="rounded-lg bg-slate-900 p-3 text-white">MineCare<br /><span className="font-normal text-slate-300">Event / Real-time / Trend / Time</span></div>
                <div className="rounded-lg bg-blue-700 p-3 text-white">CMA Web<br /><span className="font-normal text-blue-100">Analysis / Laudo / Recommendation</span></div>
                <div className="rounded-lg bg-slate-900 p-3 text-white">XGSS<br /><span className="font-normal text-slate-300">Docs / Knowledge / Parts</span></div>
              </div>
              <div className="grid gap-2 md:grid-cols-4">
                <div className="rounded-lg bg-white p-3 shadow-sm">SAP PM<br /><span className="font-normal text-slate-500">Nota / OM</span></div>
                <div className="rounded-lg bg-white p-3 shadow-sm">PCM<br /><span className="font-normal text-slate-500">Plan / Parts / Schedule</span></div>
                <div className="rounded-lg bg-white p-3 shadow-sm">MCM<br /><span className="font-normal text-slate-500">Status / Release</span></div>
                <div className="rounded-lg bg-white p-3 shadow-sm">PowerBI<br /><span className="font-normal text-slate-500">KPI / Review</span></div>
              </div>
            </div>
          </div>
        </Panel>
        <Panel title="接口对象与字段" subtitle="后续可扩展为接口设计表" icon={Database}>
          <MiniTable
            columns={[{ key: "obj", label: "对象" }, { key: "source", label: "来源" }, { key: "use", label: "用途" }]}
            rows={[
              { obj: "Equipment / Unidade", source: "XGSS / SAP / MineCare", use: "统一设备对象与事件归属" },
              { obj: "Event / Alarm", source: "MineCare / MineStar / MEMS", use: "异常识别、分级、Don’t Go判断" },
              { obj: "Trend Record", source: "Trending Client / Reports", use: "提前识别潜在故障" },
              { obj: "CMA Analysis", source: "CMA Web", use: "结构化诊断、Laudo和推荐动作" },
              { obj: "Nota / OM", source: "SAP PM", use: "正式维修通知和工单闭环" },
              { obj: "Activity / Release", source: "MCM Time Tracking", use: "停机控制、释放和执行状态" },
            ]}
          />
        </Panel>
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-4">
        {rules.map((r) => (
          <Panel key={r.title} title={r.title} icon={Settings}>
            <p className="text-xs leading-5 text-slate-600">{r.text}</p>
          </Panel>
        ))}
      </div>
    </>
  );
}

export default function App() {
  const [active, setActive] = useState("home");
  const page = useMemo(() => {
    if (active === "event") return <EventPage />;
    if (active === "realtime") return <RealTimePage />;
    if (active === "trend") return <TrendPage />;
    if (active === "time") return <TimePage />;
    if (active === "integration") return <IntegrationPage />;
    return <HomePage />;
  }, [active]);

  return <MineCareChrome active={active} setActive={setActive}>{page}</MineCareChrome>;
}
