export const processStoreHours = (openingHours: string) => {
  const now = new Date();
  const currentDay = now.getDay(); // 0 = Domingo, 1 = Segunda, etc.
  const currentTime = now.getHours() * 60 + now.getMinutes(); // Minutos desde meia-noite

  const dayNames = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

  // Criar objeto com todos os dias da semana
  const weekSchedule = dayNames.map((day) => ({ day, hours: 'Fechado' }));

  // Processar horários cadastrados
  const schedules = openingHours.split(' | ');
  schedules.forEach((schedule) => {
    const [day, hours] = schedule.split(': ');
    const dayIndex = dayNames.indexOf(day);
    if (dayIndex !== -1) {
      weekSchedule[dayIndex].hours = hours;
    }
  });

  // Verificar se está aberto hoje
  const todaySchedule = weekSchedule[currentDay];
  let isOpen = false;
  let closingTime = null;
  let nextOpenTime = null;

  if (todaySchedule.hours !== 'Fechado') {
    const [openTime, closeTime] = todaySchedule.hours.split(' - ');
    const [openHour, openMin] = openTime.split(':').map(Number);
    const [closeHour, closeMin] = closeTime.split(':').map(Number);

    const openMinutes = openHour * 60 + openMin;
    const closeMinutes = closeHour * 60 + closeMin;

    isOpen = currentTime >= openMinutes && currentTime < closeMinutes;
    closingTime = isOpen ? closeTime : null;
    nextOpenTime = !isOpen && currentTime < openMinutes ? openTime : null;
  }

  return {
    weekSchedule,
    isOpen,
    closingTime,
    nextOpenTime,
    currentDay,
  };
};
