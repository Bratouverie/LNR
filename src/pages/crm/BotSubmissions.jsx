import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Bot, Phone, User, Briefcase, Clock, CheckCircle, Trash2, Loader2 } from "lucide-react";

export default function CrmBotSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const data = await base44.entities.BotSubmission.list("-created_date", 100);
      setSubmissions(data);
    } catch (err) {
      console.error("Failed to load submissions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (id) => {
    try {
      await base44.entities.BotSubmission.update(id, { status: "manager_assigned" });
      loadSubmissions();
    } catch (err) {
      console.error("Failed to update:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await base44.entities.BotSubmission.delete(id);
      loadSubmissions();
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "bot_queue": return "bg-yellow-100 text-yellow-800";
      case "manager_assigned": return "bg-blue-100 text-blue-800";
      case "in_progress": return "bg-purple-100 text-purple-800";
      case "completed": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const statusLabel = (status) => {
    switch (status) {
      case "bot_queue": return "Новая";
      case "manager_assigned": return "Назначена";
      case "in_progress": return "В работе";
      case "completed": return "Завершена";
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bot className="h-6 w-6" />
            Заявки от консультанта Марии
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Всего: {submissions.length}</p>
        </div>
        <Button variant="outline" onClick={loadSubmissions}>Обновить</Button>
      </div>

      {submissions.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Bot className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>Пока нет заявок от консультанта Марии</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {submissions.map((s) => (
            <div key={s.id} className="bg-card border border-border rounded-xl p-4 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center shrink-0">
                <User className="h-5 w-5 text-pink-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-semibold">{s.firstName} {s.lastName}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(s.status)}`}>
                    {statusLabel(s.status)}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-muted-foreground">
                  <a href={`tel:${s.phone}`} className="flex items-center gap-1.5 hover:text-foreground">
                    <Phone className="h-3.5 w-3.5" /> {s.phone}
                  </a>
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5" /> {s.specialization}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {new Date(s.created_date).toLocaleString("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                {s.status === "bot_queue" && (
                  <Button size="sm" variant="outline" onClick={() => handleAssign(s.id)}>
                    <CheckCircle className="h-4 w-4 mr-1" /> Взять
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={() => handleDelete(s.id)} className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}