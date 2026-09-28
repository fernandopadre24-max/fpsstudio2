import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Music, Check } from "lucide-react";
import { useApp } from "../../context/AppContext";

export default function ClientSchedule() {
  const { services, schedules, addSchedule, currentUser } = useApp();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [success, setSuccess] = useState(false);

  const availableTimes = ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];

  const isTimeAvailable = (time: string) => {
    return !schedules.some(s => s.date === selectedDate && s.startTime === time && s.status !== "cancelado");
  };

  const handleBook = () => {
    if (!selectedService || !selectedDate || !selectedTime || !currentUser) return;
    const service = services.find(s => s.id === selectedService);
    if (!service) return;

    const startHour = parseInt(selectedTime.split(":")[0]);
    const endHour = startHour + service.duration;
    
    addSchedule({
      clientId: currentUser.id,
      serviceId: selectedService,
      date: selectedDate,
      startTime: selectedTime,
      endTime: `${endHour.toString().padStart(2, "0")}:00`,
      status: "pendente"
    });

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setSelectedService(null);
      setSelectedDate("");
      setSelectedTime("");
    }, 3000);
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Agendar Horário</h1>
        <p className="text-gray-400 text-sm mt-1">Escolha o serviço e o melhor horário</p>
      </div>

      {success && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-green-500/20 border border-green-500/30 text-green-300 flex items-center gap-3">
          <Check className="w-5 h-5" />
          <span>Agendamento realizado com sucesso! Aguarde a confirmação do estúdio.</span>
        </motion.div>
      )}

      {/* Serviços */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Music className="w-5 h-5 text-purple-400" />
          1. Escolha o Serviço
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {services.map(service => (
            <button
              key={service.id}
              onClick={() => setSelectedService(service.id)}
              className={`p-4 rounded-xl border text-left transition-all ${
                selectedService === service.id
                  ? "bg-purple-500/20 border-purple-500/50"
                  : "bg-white/5 border-white/10 hover:border-white/20"
              }`}
            >
              <p className="text-white font-medium">{service.name}</p>
              <p className="text-gray-400 text-xs mt-1">{service.description}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-purple-300 font-semibold">R$ {service.price}</span>
                <span className="text-gray-400 text-xs">{service.duration}h</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Data */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-400" />
          2. Escolha a Data
        </h3>
        <input
          type="date"
          value={selectedDate}
          min={today}
          onChange={e => setSelectedDate(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Horário */}
      {selectedDate && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-green-400" />
            3. Escolha o Horário
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {availableTimes.map(time => {
              const available = isTimeAvailable(time);
              return (
                <button
                  key={time}
                  onClick={() => available && setSelectedTime(time)}
                  disabled={!available}
                  className={`p-3 rounded-lg text-center text-sm font-medium transition-all ${
                    !available
                      ? "bg-red-500/10 text-red-400/50 border border-red-500/20 cursor-not-allowed"
                      : selectedTime === time
                      ? "bg-green-500/20 text-green-300 border border-green-500/50"
                      : "bg-white/5 text-white border border-white/10 hover:bg-white/10"
                  }`}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Confirmar */}
      {selectedService && selectedDate && selectedTime && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4">Resumo do Agendamento</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Serviço:</span>
              <span className="text-white">{services.find(s => s.id === selectedService)?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Data:</span>
              <span className="text-white">{new Date(selectedDate + "T12:00:00").toLocaleDateString("pt-BR")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Horário:</span>
              <span className="text-white">{selectedTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Duração:</span>
              <span className="text-white">{services.find(s => s.id === selectedService)?.duration}h</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-white/10">
              <span className="text-gray-400 font-medium">Valor:</span>
              <span className="text-green-400 font-bold text-lg">R$ {services.find(s => s.id === selectedService)?.price}</span>
            </div>
          </div>
          <button
            onClick={handleBook}
            className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-500/20"
          >
            Confirmar Agendamento
          </button>
        </motion.div>
      )}
    </div>
  );
}
