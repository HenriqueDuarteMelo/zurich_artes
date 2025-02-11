<template>
    <div>
      <h2 class="content-block">Cadastro e Estoque de Caneca</h2>
      <div class="box" id="form">
        <DxTextBox
          v-model="nm_caneca"
          label="Caneca"
          class="DxTextBox-cadastro_funcionario"
        />
        <DxNumberBox
        v-model="qt_caneca"
        label="Quantidade"
        class="DxTextBox-cadastro_apontamento"
        :show-spin-buttons="true"
        :show-clear-button="true"
      />
      </div>
      <div class="box">
        <DxButton
          v-if="status_caneca"
          class="DxTextBox-cadastro_apontamento"
          icon="save"
          type="success"
          text="Cadastro"
          @click="confirmar_cadastro()"
        />
        <DxButton
          v-else
          class="DxTextBox-cadastro_apontamento"
          icon="save"
          type="default"
          text="Confirmar Alteração"
          @click="altera_caneca()"
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
        :data-source="grid_caneca"
        key-expr="cd_caneca"
        :selection="{ mode: 'single' }"
        :columns="columns"
        :show-borders="true"
        :focused-row-enabled="true"
        :row-alternation-enabled="true"
        :column-auto-width="true"
        @selection-changed="onSelectedcaneca"
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
    import DxButton from 'devextreme-vue/button'
    import DxNumberBox from 'devextreme-vue/number-box'
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
          qt_caneca: 0,
          status_caneca: true,
          var_teste:false,
          pageSizes: [50, 100],
          grid_caneca: '',
          cd_caneca:[],
          carregando: false,
          nm_caneca: '',
          columns: [
            {
              'caption': "Tipo Caneca",
              'dataField':"nm_caneca",
              'headerCellTemplate':"teste"
            },
            {
              'caption': "Quantidade",
              'dataField':"qt_caneca",
              'headerCellTemplate':"teste"
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
        DxNumberBox
      },
      created(){
        this.carrega_dados()
      },
      methods:{
        async carrega_dados(){
          this.carregando   = true
          this.carregando   = false
          this.grid_caneca = await api.get('consulta_caneca',[])
        },
         onSelectedcaneca({selectedRowsData}){
          var data = selectedRowsData [0]
          this.cd_caneca = data.cd_caneca
          this.nm_caneca = data.nm_caneca
          this.qt_caneca = data.qt_caneca
          this.status_caneca = false
        },
        limpar_dados(){
          this.nm_caneca = ''
          this.qt_caneca = 0
          this.status_caneca = true
        },
        async confirmar_cadastro() {
            if (!this.nm_caneca || !this.qt_caneca) {
              notify({ message: 'Preencha todos os campos!', type: 'error' });
              return;
            }
            try {
              const result_api = await api.post('cadastra_caneca', {
                nm_caneca: this.nm_caneca,
                qt_caneca: this.qt_caneca
              });
              console.log('Resultado completo da API:', result_api);
              if (result_api.success === true) {
                notify({ message: result_api.message || 'Cadastro efetuado com sucesso!', type: 'success' });
                this.limpar_dados();
                this.carrega_dados();
              } else {
                notify({ message: result_api.message || 'Erro ao cadastrar a caneca!', type: 'error' });
              }
            } catch (error) {
              if (error.response && error.response.data?.message) {
                notify({ message: error.response.data.message, type: 'error' });
              } else {
                console.error('Erro ao tentar cadastrar a caneca:', error);
                notify({ message: 'Erro ao tentar cadastrar a caneca', type: 'error' });
              }
            }
        },
        async altera_caneca(){
          var results = await api.post(`altera_caneca`, {
            nm_caneca: this.nm_caneca,
            qt_caneca: this.qt_caneca,
            cd_caneca: this.cd_caneca,
          });
          console.log(results)
          notify({ message: 'Alteração feita com sucesso', type: 'success' });
          this.limpar_dados()
          this.carrega_dados()
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