// useResetLocalStorageEveryDay.js
import { useEffect } from "react";

const useResetLocalStorageEveryDay = () => {
  useEffect(() => {
    const checkDayAndReset = () => {
      const now = new Date();
      const currentDay = now.toDateString(); // Pega a data atual no formato de string

      // Verifica se o dia mudou
      if (localStorage.getItem("lastDay") !== currentDay) {
        console.log("Novo dia detectado. Resetando localStorage...");

        // Reseta o localStorage
        localStorage.clear();

        // Armazena o dia atual no localStorage
        localStorage.setItem("lastDay", currentDay);
      }
    };

    // Checa o dia a cada minuto (60.000 milissegundos)
    const intervalId = setInterval(checkDayAndReset, 60000); // 1 vez por minuto

    // Executa a verificação imediatamente na montagem
    checkDayAndReset();

    // Limpa o intervalo quando o componente é desmontado
    return () => clearInterval(intervalId);
  }, []);
};

export default useResetLocalStorageEveryDay;
