<template>
  <div>
    <h2 class="content-block">Cadastro e Estoque de Camisa</h2>
    <div class="box" id="form">
      <DxSelectBox
        v-model="cd_cor_camisa"
        ref="turma_select"
        label="Cor da Camisa"
        class="DxTextBox-cadastro_apontamento"
        :search-enabled="true"
        :data-source="cor_select" 
        display-expr="nm_cor_camisa"
        value-expr="cd_cor_camisa"
        search-mode="contains"
        search-expr="nm_cor_camisa"
        search-timeout="200"
        show-data-before-search="false"
      />
      <DxSelectBox
        v-model="cd_tamanho_camisa"
        label="Tamanho da Camisa"
        class="DxTextBox-cadastro_apontamento"
        :search-enabled="true"
        :data-source="tamanho_select"
        display-expr="nm_tamanho_camisa"
        value-expr="cd_tamanho_camisa"
        search-mode="contains"
        search-expr="nm_tamanho_camisa"
        search-timeout="200"
        show-data-before-search="false"
      />
      <DxNumberBox
        v-model="qt_camisa"
        label="Quantidade"
        class="DxTextBox-cadastro_apontamento"
        :show-spin-buttons="true"
        :show-clear-button="true"
      />
    </div>
    <div class="box">
      <DxButton
        v-if="status_cadastro"
        class="DxTextBox-cadastro_apontamento"
        icon="save"
        type="success"
        text="Entrada"
        @click="confirmar_cadastro()"
      />
      <DxButton
        v-else
        class="DxTextBox-cadastro_apontamento"
        icon="save"
        type="default"
        text="Altera Camisa"
        @click="confirma_alteracao()"
      />
      <DxButton
        class="DxTextBox-cadastro_apontamento"
        icon="clearformat"
        type="danger"
        text="Limpar"
        @click="limpar_dados()"
      />
    </div>
    <DxDataGrid
      class="DxDataGrids-cadastro_apontamento"
      :data-source="camisa_estoque"
      key-expr="cd_camisa_estoque"
      :selection="{ mode: 'single' }"
      @selection-changed="onSelectedCamisa"
      :columns="columns"
      :show-borders="true"
      :focused-row-enabled="true"
      :row-alternation-enabled="true"
      :column-auto-width="true"
    >
      <DxPager
        :allowed-page-sizes="pageSizes"
        :show-page-size-selector="true"
      />
      <DxFilterRow :visible="true"/>
      <DxHeaderFilter :visible="true"/>
      <template #teste="{ data }">
        <b class="header-datagrid-itens">{{ data.column.caption }}</b>
      </template>
      <DxRemoteOperations :group-paging="true"/>
      <DxGroupPanel :visible="true"/>
      <DxGrouping :auto-expand-all="true"/>
      <DxScrolling column-rendering-mode="virtual"/>
      <DxColumnChooser :enabled="true"/>
      <DxExport
        :enabled="true"
        :allow-export-selected-data="true"
      />
      <DxSearchPanel
        :visible="true"
        :highlight-case-sensitive="true"
      />
      <DxPaging :page-size="10"/>
    </DxDataGrid>
  </div>
</template>
  
  <script>
  import { DxSelectBox } from 'devextreme-vue/select-box'
  import DxNumberBox from 'devextreme-vue/number-box'
  import DxButton from 'devextreme-vue/button'
  import notify from 'devextreme/ui/notify'
  import api from '../api/api'
  import {
    DxDataGrid,
    DxRemoteOperations,
    DxGroupPanel,
    DxGrouping,
    DxSearchPanel,
    DxHeaderFilter,
    DxFilterRow,
    DxPaging,
    DxScrolling,
    DxColumnChooser,
    DxPager,
    DxExport
  } from 'devextreme-vue/data-grid'
  
  export default{
    data(){
      return{
        status_cadastro: true,
        pageSizes: [50, 100],
        carregando: false,
        dado: '',
        status: false,
        cd_funcionario_selecionado: '',
        cd_tarefa_selecionada: 0,
        qt_camisa: 0,
        vl_horas_gastas: 0,
        cd_talhao_selecionado: 0,
        cd_ramal_selecionado: 0,
        cd_apontamento_selecionado: 0,
        observacao: null,
        apontamento_selecionado: {},
        camisa_estoque:[],
        funcionarios: [],
        ramal: [],
        talhao: [],
        cor_select: [],
        tamanho_select: [],
        cd_tamanho_camisa: 0,
        cd_cor_camisa: 0,
        propriedade: [],
        columns: [
          {
            'caption': "Cor",
            'dataField':"nm_cor_camisa",
            'headerCellTemplate':"teste"
          },
          {
            'caption': "Tamanho",
            'headerCellTemplate':"teste",
            'dataField':"nm_tamanho_camisa"
          },
          {
            'caption': "Quantidade",
            'headerCellTemplate':"teste",
            'dataField':"qt_camisa"
          },
        ]
      }
    },
    components:{
      DxSelectBox,
      DxNumberBox,
      DxButton,
      DxDataGrid,
      DxRemoteOperations,
      DxGroupPanel,
      DxGrouping,
      DxSearchPanel,
      DxPaging,
      DxScrolling,
      DxHeaderFilter,
      DxFilterRow,
      DxPager,
      DxColumnChooser,
      DxExport,
    },
    created(){
      this.carrega_dados()
    },
    methods:{
      async carrega_dados(){
        this.carregando   = true
        this.dt_apontamento = new Date().toISOString().slice(0,10)
        this.cor_select       = await api.get('consulta_cor', [])
        this.tamanho_select = await api.get('consulta_tamanho', [])
        this.carregando   = false
        this.camisa_estoque = await api.get('consulta_camisa_estoque',[])
      },
      async onSelectedCamisa(selectedRowsData){
        console.log('linha retorna: ', selectedRowsData.selectedRowsData)
        var data = selectedRowsData.selectedRowsData [0]
        this.selectgrid = data
        this.cd_cor_camisa = this.selectgrid.cd_cor_camisa
        this.qt_camisa = this.selectgrid.qt_camisa
        this.nm_cor_camisa = this.selectgrid.nm_cor_camisa
        this.cd_tamanho_camisa = this.selectgrid.cd_tamanho_camisa
        this.nm_tamanho_camisa = this.selectgrid.nm_tamanho_camisa
        this.cd_camisa_estoque = this.selectgrid.cd_camisa_estoque
        this.status_cadastro = false
      },
      
      limpar_dados(){
        this.cd_cor_camisa = ''
        this.cd_tamanho_camisa = ''
        this.qt_camisa = 0
        this.cd_talhao_selecionado = 0
        this.observacao = null
        this.cd_ramal_selecionado = 0
        this.status_cadastro = true
      },
      async confirmar_cadastro() {
        if(this.cd_cor_camisa == null || this.cd_tamanho_camisa == null || this.qt_camisa == 0){
          notify(
            {message: 'Preencha todos os campos para cadastro!',type: 'error',displayTime: 3500,animation: {show: {type: 'fade', duration: 400, from: 0, to: 1,},hide: { type: 'fade', duration: 40, to: 0 },},},{position: 'bottom center'}
          )
        }
        else{
          const json = {
            cd_cor_camisa: this.cd_cor_camisa,
            cd_tamanho_camisa: this.cd_tamanho_camisa,
            qt_camisa: this.qt_camisa
          };
          try {
            const response = await api.post('cadastra_camisa_estoque', json);
            // Log para ver a resposta completa
            console.log("Resposta da API:", response);
            // Verifique se a resposta é bem-sucedida
            if (response.status === 200 && response.data && response.data.message) {
              notify({
                message: response.data.message,
                type: 'success',
                displayTime: 3500,
                animation: {
                  show: { type: 'fade', duration: 400, from: 0, to: 1 },
                  hide: { type: 'fade', duration: 40, to: 0 },
                },
              });
            } else {
              notify({
                message: 'Cadastrado com Sucesso!',
                type: 'success',
                displayTime: 3500,
                animation: {
                  show: { type: 'fade', duration: 400, from: 0, to: 1 },
                  hide: { type: 'fade', duration: 40, to: 0 },
                },
              });
            }
            this.carrega_dados(); // Recarregar os dados
            this.limpar_dados();  // Limpar os dados após o cadastro
          } catch (error) {
            console.error("Erro ao confirmar cadastro:", error);
            notify({
              message: 'Ocorreu um erro ao tentar cadastrar a camisa. Por favor, tente novamente.',
              type: 'error',
              displayTime: 3500,
              animation: {
                show: { type: 'fade', duration: 400, from: 0, to: 1 },
                hide: { type: 'fade', duration: 40, to: 0 },
              },
            });
          }
        }
      },
      async confirma_alteracao(){
        const json = {
          cd_camisa_estoque: this.cd_camisa_estoque,  // Usando o código da camisa selecionada
          cd_cor_camisa: this.cd_cor_camisa,
          cd_tamanho_camisa: this.cd_tamanho_camisa,
          qt_camisa: this.qt_camisa,
        };
        try {
          const response = await api.post('altera_camisa_estoque', json);
          console.log('Resposta da API:', response);
          notify(
            {message: 'Alteração feita com sucesso!',type: 'success',displayTime: 3000,animation: {show: {type: 'fade', duration: 400, from: 0, to: 1,},hide: { type: 'fade', duration: 40, to: 0 },},},{position: 'bottom center'}
          )
          if (response.status === 200 && response.data.message) {
            notify({
              message: response.data.message,
              type: 'success',
              displayTime: 3500,
              animation: {
                show: { type: 'fade', duration: 400, from: 0, to: 1 },
                hide: { type: 'fade', duration: 40, to: 0 },
              },
            });
          }
          this.carrega_dados();
          this.limpar_dados();
        } catch (error) {
          console.error('Erro ao alterar estoque:', error);
          notify({
            message: 'Ocorreu um erro ao tentar alterar o estoque. Por favor, tente novamente.',
            type: 'error',
            displayTime: 3500,
            animation: {
              show: { type: 'fade', duration: 400, from: 0, to: 1 },
              hide: { type: 'fade', duration: 40, to: 0 },
            },
          });
        }
      }
    }
  }
  </script>
  <style>
  .box{
    display: grid;
    grid-template-columns: 52vh 52vh 52vh;
    margin: auto 5vh;
  }
  .box-gird{
    display: grid;
    grid-template-columns: 5vh 20vh;
    margin: auto 5vh;
  }
  
  .DxTextBox-cadastro_apontamento{
    margin: 1vh 1vh;
  }
  
  .DxDataGrids-cadastro_apontamento{
    margin: 5vh;
  }
  
  .header-datagrid-itens{
    font-size:18px;
    color: black;
  }
  </style>