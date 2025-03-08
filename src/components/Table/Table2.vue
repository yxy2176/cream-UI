<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="table-container">
    <div class="controls">
      <button @click="showColumnConfig = !showColumnConfig">列配置</button>
      <button @click="printTable">打印</button>
      <button @click="exportExcel">导出Excel</button>
    </div>

    <!-- 列配置弹窗 -->
    <div v-if="showColumnConfig" class="column-config-modal">
      <div class="config-content">
        <h3>显示列配置</h3>
        <div v-for="col in columns" :key="col.prop" class="config-item">
          <label>
            <input type="checkbox" v-model="col.visible" @change="updateColumns" />
            {{ col.label }}
          </label>
        </div>
        <button @click="showColumnConfig = false">关闭</button>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th
            v-for="(col, index) in visibleColumns"
            :key="col.prop"
            draggable="true"
            @dragstart="handleDragStart($event, index)"
            @dragover.prevent="handleDragOver($event, index)"
            @drop="handleDrop($event, index)"
          >
            {{ col.label }}
            <span v-if="col.sortable" @click="handleSort(col.prop)" class="sort-icon">
              {{ sortState[col.prop] === 'asc' ? '↑' : '↓' }}
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, rowIndex) in sortedData"
          :key="rowIndex"
          draggable="true"
          @dragstart="handleRowDragStart($event, rowIndex)"
          @dragover.prevent="handleRowDragOver($event, rowIndex)"
          @drop="handleRowDrop($event, rowIndex)"
        >
          <td v-for="col in visibleColumns" :key="col.prop">
            {{ formatCell(row[col.prop]) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, type PropType, watch } from 'vue'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

export interface Column {
  label: string
  prop: string
  sortable?: boolean
  width?: number
  visible?: boolean // 新增可见性控制
}

export interface TableRow {
  [key: string]: string | number | Date
}

const props = defineProps({
  columns: {
    type: Array as PropType<Column[]>,
    required: true,
    validator: (value: Column[]) => value.every((col) => 'label' in col && 'prop' in col),
  },
  data: {
    type: Array as PropType<TableRow[]>,
    required: true,
  },
})

const emit = defineEmits<{
  (e: 'update:data', value: TableRow[]): void
  (e: 'update:columns', value: Column[]): void
}>()

type SortState = 'asc' | 'desc' | null
const sortState = ref<Record<string, SortState>>({})
const sortKey = ref<string>('')

const dragStartIndex = ref(0)
const rowDragStartIndex = ref(0)

const sortedData = computed(() => {
  if (!sortKey.value) return props.data
  return [...props.data].sort((a, b) => {
    const valA = a[sortKey.value]
    const valB = b[sortKey.value]
    const modifier = sortState.value[sortKey.value] === 'asc' ? 1 : -1

    if (typeof valA === 'number' && typeof valB === 'number') {
      return (valA - valB) * modifier
    }
    return String(valA).localeCompare(String(valB)) * modifier
  })
})

// 列拖动处理
const handleDragStart = (event: DragEvent, index: number) => {
  dragStartIndex.value = index
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleDragOver = (event: DragEvent, index: number) => {
  event.preventDefault()
}

const handleDrop = (event: DragEvent, index: number) => {
  event.preventDefault()
  const newColumns = [...props.columns]
  const dragged = newColumns[dragStartIndex.value]
  newColumns.splice(dragStartIndex.value, 1)
  newColumns.splice(index, 0, dragged)
  emit('update:columns', newColumns)
}

// 行拖动处理
const handleRowDragStart = (event: DragEvent, index: number) => {
  rowDragStartIndex.value = index
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleRowDragOver = (event: DragEvent, index: number) => {
  event.preventDefault()
}

const handleRowDrop = (event: DragEvent, index: number) => {
  event.preventDefault()
  const newData = [...props.data]
  const [dragged] = newData.splice(rowDragStartIndex.value, 1)
  newData.splice(index, 0, dragged)
  emit('update:data', newData)
}

// 排序处理
const handleSort = (key: string) => {
  sortKey.value = key
  sortState.value = {
    ...sortState.value,
    [key]: sortState.value[key] === 'asc' ? 'desc' : 'asc',
  }
}

// 单元格格式化
const formatCell = (value: string | number | Date) => {
  if (value instanceof Date) {
    return value.toLocaleDateString()
  }
  return value
}

// 打印功能
const printTable = () => {
  const printWindow = window.open('', '_blank')
  const tableHTML = `
    <html>
      <head>
        <title>打印表格</title>
        <style>
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #000; padding: 8px; }
          .sort-icon { margin-left: 8px; }
        </style>
      </head>
      <body>
        ${document.querySelector('.table-container')?.innerHTML}
      </body>
    </html>
  `
  printWindow?.document.write(tableHTML)
  printWindow?.print()
  printWindow?.close()
}

// 导出Excel
const exportExcel = () => {
  const header = props.columns.map((col) => col.label)
  const rows = sortedData.value.map((row) =>
    props.columns.map((col) => {
      const value = row[col.prop]
      return value instanceof Date ? value.toISOString() : value
    }),
  )

  const worksheet = XLSX.utils.aoa_to_sheet([header, ...rows])
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
  })

  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })

  saveAs(blob, `export-${new Date().toISOString().slice(0, 10)}.xlsx`)
}

// 新增响应式变量
const showColumnConfig = ref(false)

// 计算可见列
const visibleColumns = computed(() => {
  return props.columns.filter((col) => col.visible !== false)
})

// 当列配置变化时触发更新
const updateColumns = () => {
  emit('update:columns', [...props.columns])
}

// 观察数据变化自动生成列
watch(
  () => props.data,
  (newData) => {
    if (newData.length > 0) {
      const firstRow = newData[0]
      const dynamicColumns = Object.keys(firstRow)
        .filter((key) => !props.columns.some((col) => col.prop === key))
        .map((key) => ({
          label: key,
          prop: key,
          visible: true,
        }))

      if (dynamicColumns.length > 0) {
        emit('update:columns', [...props.columns, ...dynamicColumns])
      }
    }
  },
  { immediate: true },
)
</script>

<style scoped>
.table-container {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
}

th,
td {
  border: 1px solid #ddd;
  padding: 12px;
  min-width: 120px;
}

th {
  background-color: #f8f9fa;
  cursor: move;
  position: relative;
}

.sort-icon {
  cursor: pointer;
  margin-left: 8px;
  user-select: none;
}

tr:hover {
  background-color: #f1f1f1;
}

.controls {
  margin-bottom: 16px;
  display: flex;
  gap: 8px;
}

button {
  padding: 8px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #0056b3;
}

/* 列配置弹窗样式 */
.column-config-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.config-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 300px;
}

.config-item {
  margin: 10px 0;
  display: flex;
  align-items: center;
}

.config-item label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.config-item input {
  margin-right: 8px;
}
</style>
