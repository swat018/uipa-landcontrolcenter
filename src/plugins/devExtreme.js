import {
  DxDataGrid,
  DxMasterDetail,
  DxColumn,
  DxHeaderFilter,
  DxSearch,
  DxSearchPanel,
  DxFilterRow,
  DxPaging,
  DxScrolling,
  DxEditing,
  DxValidationRule,
  DxExport
} from 'devextreme-vue/data-grid'

import { 
  DxTreeList,
  DxColumnChooser,
  DxSelection,
  DxLookup
} from 'devextreme-vue/tree-list'


const devExtreamPlugins = {
  install(app) {
    app.component('DxDataGrid', DxDataGrid)
    app.component('DxMasterDetail', DxMasterDetail)
    app.component('DxColumn', DxColumn)
    app.component('DxHeaderFilter', DxHeaderFilter)
    app.component('DxSearch', DxSearch)
    app.component('DxSearchPanel', DxSearchPanel)
    app.component('DxTreeList', DxTreeList)
    app.component('DxColumnChooser', DxColumnChooser)
    app.component('DxSelection', DxSelection)
    app.component('DxLookup', DxLookup)
    app.component('DxPaging', DxPaging)
    app.component('DxFilterRow', DxFilterRow)
    app.component('DxScrolling', DxScrolling)
    app.component('DxEditing', DxEditing)
    app.component('DxValidationRule', DxValidationRule)
    app.component('DxExport', DxExport)
  }
}

export default devExtreamPlugins
