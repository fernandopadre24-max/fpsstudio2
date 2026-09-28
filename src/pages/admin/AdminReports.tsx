import { motion } from "framer-motion";
import { FileText, Download, FileSpreadsheet, Users, DollarSign, Calendar } from "lucide-react";
import { useApp } from "../../context/AppContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export default function AdminReports() {
  const { users, payments, schedules, services, quotes } = useApp();
  const clients = users.filter(u => u.role === "client");
  const confirmedPayments = payments.filter(p => p.status === "confirmado");

  const exportPDF = (type: string) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Studio Pro - Relatório", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Gerado em: ${new Date().toLocaleDateString("pt-BR")}`, 14, 32);

    if (type === "clients") {
      autoTable(doc, {
        startY: 40,
        head: [["Nome", "E-mail", "Telefone", "Data Cadastro"]],
        body: clients.map(c => [c.name, c.email, c.phone || "-", new Date(c.createdAt).toLocaleDateString("pt-BR")]),
        theme: "grid",
        headStyles: { fillColor: [168, 85, 247] },
      });
    } else if (type === "financial") {
      const total = confirmedPayments.reduce((s, p) => s + p.amount, 0);
      doc.text(`Receita Total: R$ ${total.toFixed(2)}`, 14, 42);
      autoTable(doc, {
        startY: 50,
        head: [["Cliente", "Valor", "Data", "Status"]],
        body: payments.map(p => {
          const client = users.find(u => u.id === p.clientId);
          return [client?.name || "-", `R$ ${p.amount.toFixed(2)}`, new Date(p.createdAt).toLocaleDateString("pt-BR"), p.status];
        }),
        theme: "grid",
        headStyles: { fillColor: [16, 185, 129] },
      });
    } else if (type === "schedules") {
      autoTable(doc, {
        startY: 40,
        head: [["Cliente", "Serviço", "Data", "Horário", "Status"]],
        body: schedules.map(s => {
          const client = users.find(u => u.id === s.clientId);
          const service = services.find(sv => sv.id === s.serviceId);
          return [client?.name || "-", service?.name || "-", s.date, `${s.startTime}-${s.endTime}`, s.status];
        }),
        theme: "grid",
        headStyles: { fillColor: [59, 130, 246] },
      });
    }

    doc.save(`relatorio_${type}_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  const exportExcel = (type: string) => {
    let data: Record<string, unknown>[] = [];
    let filename = "";

    if (type === "clients") {
      data = clients.map(c => ({
        Nome: c.name, Email: c.email, Telefone: c.phone || "-",
        "Data Cadastro": new Date(c.createdAt).toLocaleDateString("pt-BR"),
        Status: c.active ? "Ativo" : "Inativo"
      }));
      filename = "clientes";
    } else if (type === "financial") {
      data = payments.map(p => {
        const client = users.find(u => u.id === p.clientId);
        return {
          Cliente: client?.name || "-", Valor: p.amount,
          Data: new Date(p.createdAt).toLocaleDateString("pt-BR"),
          Status: p.status, "Confirmação": p.confirmedAt ? new Date(p.confirmedAt).toLocaleDateString("pt-BR") : "-"
        };
      });
      filename = "financeiro";
    } else if (type === "schedules") {
      data = schedules.map(s => {
        const client = users.find(u => u.id === s.clientId);
        const service = services.find(sv => sv.id === s.serviceId);
        return {
          Cliente: client?.name || "-", Serviço: service?.name || "-",
          Data: s.date, "Horário": `${s.startTime}-${s.endTime}`, Status: s.status
        };
      });
      filename = "agendamentos";
    } else if (type === "performance") {
      data = clients.map(c => {
        const clientSchedules = schedules.filter(s => s.clientId === c.id);
        const clientPayments = confirmedPayments.filter(p => p.clientId === c.id);
        return {
          Cliente: c.name,
          "Agendamentos": clientSchedules.length,
          "Concluídos": clientSchedules.filter(s => s.status === "concluido").length,
          "Total Gasto": `R$ ${clientPayments.reduce((s, p) => s + p.amount, 0).toFixed(2)}`,
          "Desde": new Date(c.createdAt).toLocaleDateString("pt-BR")
        };
      });
      filename = "desempenho_clientes";
    }

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Dados");
    XLSX.writeFile(wb, `${filename}_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  const reports = [
    { id: "clients", title: "Relatório de Clientes", desc: "Lista completa de todos os clientes cadastrados", icon: Users, color: "from-purple-500 to-pink-500" },
    { id: "financial", title: "Relatório Financeiro", desc: "Todas as transações e fluxo de caixa", icon: DollarSign, color: "from-green-500 to-emerald-500" },
    { id: "schedules", title: "Relatório de Agendamentos", desc: "Histórico de todos os agendamentos", icon: Calendar, color: "from-blue-500 to-cyan-500" },
    { id: "performance", title: "Desempenho por Cliente", desc: "Métricas detalhadas de cada cliente", icon: FileText, color: "from-amber-500 to-orange-500" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Relatórios</h1>
        <p className="text-gray-400 text-sm mt-1">Exporte dados em PDF ou Excel</p>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <p className="text-gray-400 text-sm">Total de Clientes</p>
          <p className="text-2xl font-bold text-white mt-1">{clients.length}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <p className="text-gray-400 text-sm">Agendamentos</p>
          <p className="text-2xl font-bold text-white mt-1">{schedules.length}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <p className="text-gray-400 text-sm">Orçamentos Enviados</p>
          <p className="text-2xl font-bold text-white mt-1">{quotes.length}</p>
        </motion.div>
      </div>

      {/* Relatórios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report, i) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${report.color} flex items-center justify-center flex-shrink-0`}>
                <report.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold">{report.title}</h3>
                <p className="text-gray-400 text-sm mt-1">{report.desc}</p>
                
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => exportPDF(report.id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors text-sm font-medium"
                  >
                    <FileText className="w-4 h-4" />
                    PDF
                  </button>
                  <button
                    onClick={() => exportExcel(report.id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/20 text-green-300 hover:bg-green-500/30 transition-colors text-sm font-medium"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    Excel
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabela de desempenho */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-4">Desempenho por Cliente</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-gray-400 text-sm font-medium py-3 px-4">Cliente</th>
                <th className="text-left text-gray-400 text-sm font-medium py-3 px-4">Agendamentos</th>
                <th className="text-left text-gray-400 text-sm font-medium py-3 px-4">Concluídos</th>
                <th className="text-left text-gray-400 text-sm font-medium py-3 px-4">Total Gasto</th>
                <th className="text-left text-gray-400 text-sm font-medium py-3 px-4">Desde</th>
              </tr>
            </thead>
            <tbody>
              {clients.map(c => {
                const clientSchedules = schedules.filter(s => s.clientId === c.id);
                const clientPayments = confirmedPayments.filter(p => p.clientId === c.id);
                return (
                  <tr key={c.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3 px-4 text-white text-sm">{c.name}</td>
                    <td className="py-3 px-4 text-gray-300 text-sm">{clientSchedules.length}</td>
                    <td className="py-3 px-4 text-gray-300 text-sm">{clientSchedules.filter(s => s.status === "concluido").length}</td>
                    <td className="py-3 px-4 text-green-400 text-sm font-medium">R$ {clientPayments.reduce((s, p) => s + p.amount, 0).toFixed(2)}</td>
                    <td className="py-3 px-4 text-gray-400 text-sm">{new Date(c.createdAt).toLocaleDateString("pt-BR")}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
