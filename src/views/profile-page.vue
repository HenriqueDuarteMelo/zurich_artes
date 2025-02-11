<template>
  <div>
    <h2>Agenda Zurich</h2>

    <DxScheduler
      :data-source="appointments"
      :views="views"
      :current-date="currentDate"
      :current-view="currentView"
      :start-day-hour="0"
      :end-day-hour="23"
      :show-all-day-panel="false"
      :show-appointments="true"
      @appointment-updated="onAppointmentEdit"
      @appointment-added="onAppointmentAdded"
      @appointment-deleted="onAppointmentDelete"
    >
    </DxScheduler>
  </div>
</template>

<script>
import { DxScheduler } from "devextreme-vue/scheduler";
import "devextreme/dist/css/dx.light.css";
import api from '../api/api';

export default {
  components: {
    DxScheduler,
  },
  data() {
    return {
      currentView: "month",
      currentDate: new Date(),
      appointments: [],
      views: ["day", "week", "month"],
    };
  },
  methods: {
    onAppointmentAdded(e) {
      console.log('Evento de agendamento adicionado:', e);
      const appointmentData = e.appointmentData;
      this.cadastra_agenda(appointmentData);
    },
    onAppointmentEdit(e) {
      console.log('Evento de edição de agendamento:', e);
      const appointmentData = e.appointmentData;
      this.edita_agenda(appointmentData);
    },
    async onAppointmentDelete(e) {
      console.log('Evento para deletar:', e);
      const appointmentData = e.appointmentData;
      this.deleta_agenda(appointmentData);
    },
    async edita_agenda(appointmentData) {
        console.log('Editando agendamento com dados:', appointmentData);
        const formattedStartDate = this.formataData(appointmentData.startDate);
        const formattedEndDate = this.formataData(appointmentData.endDate);
        const dataToSend = {
          id: appointmentData.cd_calendario,
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          text: appointmentData.text,
          description: appointmentData.description,
        };
        const response = await api.post('editar_agendamento', dataToSend);
      
        if (response?.data?.success) {
          console.log('Agendamento atualizado com sucesso:', response.data);
          this.busca_agenda();
        } else {
          console.warn('Erro ao atualizar agendamento:', response?.data?.message || 'Erro desconhecido');
        }
    },

    async deleta_agenda(appointmentData) {
        console.log('Deletando agendamento com dados:', appointmentData);
        const dataToSend = {
          cd_calendario: appointmentData.cd_calendario,
        };
        const response = await api.post('deletar_agendamento', dataToSend);
      
        if (response?.data?.success) {
          console.log('Agendamento deletado com sucesso:', response.data);
          this.busca_agenda();
        } else {
          console.warn('Erro ao deletar agendamento:', response?.data?.message || 'Erro desconhecido');
        }
    },
    
    async cadastra_agenda(appointmentData) {
      console.log('Iniciando cadastra_agenda', appointmentData);

      const formattedStartDate = this.formataData(appointmentData.startDate);
      const formattedEndDate = this.formataData(appointmentData.endDate);

      const dataToSend = {
        cd_calendario: appointmentData.id || null,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        text: appointmentData.text,
        description: appointmentData.description,
      };

      const response = await api.post('cadastrar_agendamento', dataToSend);
      if (response.data?.success) {
        console.log('Agendamento salvo/atualizado com sucesso:', response.data.message);
        this.busca_agenda();
      } else {
        console.error('Erro ao salvar/atualizar agendamento:', response.data?.message || 'Erro desconhecido');
      }
    },
    async busca_agenda() {
  try {
    console.log("Usando dados simulados para depuração...");
    const response = await api.get('buscar_agendamentos', [])

    if (Array.isArray(response) && response.length > 0) {
      this.appointments = response.map((item) => ({
        ...item,
        startDate: new Date(item.startdate),
        endDate: new Date(item.enddate),
      }));
      console.log("Agendamentos carregados:", this.appointments);
    } else {
      console.warn("Nenhum agendamento encontrado.");
      this.appointments = [];
    }
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error);
    this.appointments = [];
  }
},
    formataData(date) {
      if (!date) {
        throw new Error('Data inválida');
      }
      const parsedDate = new Date(date);

      if (isNaN(parsedDate.getTime())) {
        throw new Error('Data inválida');
      }

      const year = parsedDate.getFullYear();
      const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
      const day = String(parsedDate.getDate()).padStart(2, '0');
      const hours = String(parsedDate.getHours()).padStart(2, '0');
      const minutes = String(parsedDate.getMinutes()).padStart(2, '0');
      const seconds = String(parsedDate.getSeconds()).padStart(2, '0');

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
  },
  mounted() {
    this.busca_agenda();
  }
};
</script>

<style lang="scss">
.custom-appointment-form {
  .form-group {
    margin-bottom: 15px;
  }

  .form-actions {
    display: flex;
    justify-content: space-between;
  }
}
</style>
