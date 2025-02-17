<template>
    <div>
      <h2 class="content-block">Clientes Devedores</h2>
      <div class="box" id="form">
        <DxTextBox
          v-model="nm_cliente"
          label="Cliente"
          class="DxTextBox-cadastro_funcionario"
        />
        <DxNumberBox
          v-model="qt_deve"
          label="Quantidade"
          class="DxTextBox-cadastro_apontamento"
          :show-spin-buttons="true"
          :show-clear-button="true"
        />
      </div>
      <div class="box">
        <DxButton
          v-if="status_cliente_devedor"
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
          text="Confirmar Alteração"
          @click="altera_cliente_devedor()"
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
        :allow-exporting="false"
        class="DxDataGrids-cadastro_apontamento"
        :data-source="grid_cliente_devedor"
        key-expr="cd_cliente_devedor"
        :selection="{ mode: 'single' }"
        :columns="columns"
        :show-borders="true"
        :focused-row-enabled="true"
        :row-alternation-enabled="true"
        :column-auto-width="true"
        @selection-changed="onSelectedClienteDeve"
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
        <template #cellTemplatea>
          <DxButton
            type="success"
            text="Aprovar"
            @click="aprovar_pagamento()"
          />
        </template>
      </DxDataGrid>
    </div>
  </template>
    
    <script>
    import { DxNumberBox } from 'devextreme-vue/number-box';
    import DxButton from 'devextreme-vue/button'
    import DxTextBox from 'devextreme-vue/text-box'
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
          qt_deve: 0,
          status_cliente_devedor: true,
          pageSizes: [50, 100],
          grid_cliente_devedor: '',
          cd_cliente_devedor:[],
          carregando: false,
          nm_cliente: '',
          columns: [
            {
              'caption': "Cliente",
              'dataField':"nm_cliente",
              'headerCellTemplate':"teste"
            },
            {
              'caption': "Quantidade",
              'dataField':"qt_deve",
              'headerCellTemplate':"teste",
              format: { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 },
            },
            {
              'caption': "Aprovar Pagamento",
              'dataField':"teste",
              'headerCellTemplate':"teste",
              'cellTemplate' : "cellTemplatea"
            },
          ]
        }
      },
      components:{
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
        DxTextBox,
        DxExport,
        DxNumberBox,
      },
      created(){
        this.carrega_dados()
      },
      methods:{
        async carrega_dados(){
          this.carregando   = true
          this.carregando   = false
          this.grid_cliente_devedor = await api.get('consulta_cliente_devedor',[])
        },
         onSelectedClienteDeve({selectedRowsData}){
            if (selectedRowsData && selectedRowsData.length > 0) {
    const data = selectedRowsData[0];
    if (data && data.cd_cliente_devedor) {
      this.cd_cliente_devedor = data.cd_cliente_devedor;
      this.nm_cliente = data.nm_cliente;
      this.qt_deve = data.qt_deve;
      this.status_cliente_devedor = false;
    } else {
      console.error("Não foi possível acessar 'cd_cliente_devedor' no item selecionado.");
    }
  } else {
    console.error("Nenhuma linha selecionada.");
  }
},
        limpar_dados(){
          this.nm_cliente = ''
          this.qt_deve = 0
          this.status_cliente_devedor = true
          this.cd_cliente_devedor = [];
        },
        async confirmar_cadastro() {
            if (this.nm_cliente == null || this.qt_deve == 0 || this.nm_cliente == '') {
              notify({ message: 'Informe um cliente válido!', type: 'error' });
              return;
            }
            try {
              const result_api = await api.post('cadastra_cliente_devedor', {
                nm_cliente: this.nm_cliente,
                qt_deve: this.qt_deve
              });
          
              // Exiba o resultado completo da API
              console.log('Resultado completo da API:', result_api);
          
              // Acessando diretamente a resposta, sem a necessidade de result_api.data
              if (result_api.success === true) {
                notify({ message: result_api.message || 'Cadastro efetuado com sucesso!', type: 'success' });
                this.limpar_dados();
                this.carrega_dados();
              } else {
                // Em caso de falha
                notify({ message: result_api.message || 'Erro ao cadastrar cliente!', type: 'error' });
              }
            } catch (error) {
              if (error.response && error.response.data?.message) {
                notify({ message: error.response.data.message, type: 'error' });
              } else {
                console.error('Erro ao tentar cadastrar cliente:', error);
                notify({ message: 'Erro ao tentar cadastrar cliente', type: 'error' });
              }
            }
        },
        async altera_cliente_devedor(){
          var results = await api.post(`altera_cliente_devedor`, {
            nm_cliente: this.nm_cliente,
            qt_deve: this.qt_deve,
            cd_cliente_devedor: this.cd_cliente_devedor
          });
          console.log(results)
          notify({ message: 'Alteração feita com sucesso', type: 'success' });
          this.limpar_dados()
          this.carrega_dados()
        },
        async aprovar_pagamento() {
      try {
        const response = await api.post(`aprova_pagamento/${this.cd_cliente_devedor}`);
        console.log('Pagamento aprovado:', response);
        notify({ message: 'Pagamento aprovado!', type: 'success' });
        this.carrega_dados();
        this.limpar_dados();
      } catch (error) {
        notify({ message: 'Erro ao aprovar pagamento', type: 'error' });
      }
    },
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