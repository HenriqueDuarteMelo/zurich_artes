<template>
    <div>
      <h2 class="content-block">Cadastra cor de camisa</h2>
      <div class="box" id="form">
        <DxTextBox
          v-model="nm_cor_camisa"
          label="Cor"
          class="DxTextBox-cadastro_funcionario"
        />
      </div>
      <div class="box">
        <DxButton
          v-if="status_cor"
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
          @click="altera_cor()"
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
        :data-source="grid_cor"
        key-expr="cd_cor_camisa"
        :selection="{ mode: 'single' }"
        :columns="columns"
        :show-borders="true"
        :focused-row-enabled="true"
        :row-alternation-enabled="true"
        :column-auto-width="true"
        @selection-changed="onSelectedCor"
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
          status_cor: true,
          var_teste:false,
          pageSizes: [50, 100],
          grid_cor: '',
          cd_cor_camisa:[],
          carregando: false,
          nm_cor_camisa: '',
          columns: [
            {
              'caption': "Cores",
              'dataField':"nm_cor_camisa",
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
      },
      created(){
        this.carrega_dados()
      },
      methods:{
        async carrega_dados(){
          this.carregando   = true
          this.carregando   = false
          this.grid_cor = await api.get('consulta_cor',[])
        },
         onSelectedCor({selectedRowsData}){
          var data = selectedRowsData [0]
          this.cd_cor_camisa = data.cd_cor_camisa
          this.nm_cor_camisa = data.nm_cor_camisa
          this.status_cor = false
        },
        limpar_dados(){
          this.nm_cor_camisa = ''
          this.status_cor = true
        },
        async confirmar_cadastro() {
            if (!this.nm_cor_camisa) {
              notify({ message: 'Informe uma cor válido!', type: 'error' });
              return;
            }
            try {
              const result_api = await api.post('cadastra_cor', {
                nm_cor_camisa: this.nm_cor_camisa,
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
                notify({ message: result_api.message || 'Erro ao cadastrar a cor!', type: 'error' });
              }
            } catch (error) {
              if (error.response && error.response.data?.message) {
                notify({ message: error.response.data.message, type: 'error' });
              } else {
                console.error('Erro ao tentar cadastrar a cor:', error);
                notify({ message: 'Erro ao tentar cadastrar a cor', type: 'error' });
              }
            }
        },
        async altera_cor(){
          var results = await api.post(`altera_cor_camisa`, {
            nm_cor_camisa: this.nm_cor_camisa,
            cd_cor_camisa: this.cd_cor_camisa,
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