<template>
    <div>
      <h2 class="content-block">Cadastro Tamanho camisa</h2>
      <div class="box" id="form">
        <DxTextBox
          v-model="nm_tamanho_camisa"
          label="Tamanho"
          class="DxTextBox-cadastro_funcionario"
        />
      </div>
      <div class="box">
        <DxButton
          v-if="status_tamanho"
          class="DxTextBox-cadastro_apontamento"
          icon="save"
          type="success"
          text="Confirmar cadastro"
          @click="confirmar_cadastro()"
        />
        <DxButton
          v-else
          class="DxTextBox-cadastro_apontamento"
          icon="save"
          type="default"
          text="Confirmar Alteração"
          @click="altera_tamanho()"
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
        :data-source="grid_tamanho"
        key-expr="cd_tamanho_camisa"
        :selection="{ mode: 'single' }"
        :columns="columns"
        :show-borders="true"
        :focused-row-enabled="true"
        :row-alternation-enabled="true"
        :column-auto-width="true"
        @selection-changed="onSelectedTamanho"
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
          status_tamanho: true,
          pageSizes: [50, 100],
          grid_tamanho: '',
          cd_tamanho_camisa:[],
          carregando: false,
          nm_tamanho_camisa: '',
          columns: [
            {
              'caption': "Tamanho",
              'dataField':"nm_tamanho_camisa",
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
          this.grid_tamanho = await api.get('consulta_tamanho',[])
        },
         onSelectedTamanho({selectedRowsData}){
          var data = selectedRowsData [0]
          this.cd_tamanho_camisa = data.cd_tamanho_camisa
          this.nm_tamanho_camisa = data.nm_tamanho_camisa
          this.status_tamanho = false
        },
        limpar_dados(){
          this.nm_tamanho_camisa = ''
          this.status_tamanho = true
        },
        async confirmar_cadastro() {
            if (!this.nm_tamanho_camisa) {
              notify({ message: 'Informe um tamanho válido!', type: 'error' });
              return;
            }
            try {
              const result_api = await api.post('cadastra_tamanho', {
                nm_tamanho_camisa: this.nm_tamanho_camisa,
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
                notify({ message: result_api.message || 'Erro ao cadastrar o tamanho!', type: 'error' });
              }
            } catch (error) {
              if (error.response && error.response.data?.message) {
                notify({ message: error.response.data.message, type: 'error' });
              } else {
                console.error('Erro ao tentar cadastrar o tamanho:', error);
                notify({ message: 'Erro ao tentar cadastrar o tamanho', type: 'error' });
              }
            }
        },
        async altera_tamanho(){
          var results = await api.post(`altera_tamanho_camisa`, {
            nm_tamanho_camisa: this.nm_tamanho_camisa,
            cd_tamanho_camisa: this.cd_tamanho_camisa,
          });
          notify({ message: 'Alteração feita com sucesso', type: 'success' });
          console.log(results)
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