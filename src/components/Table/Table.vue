<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="table-container">
    <div class="controls">
      <button @click="printTable">打印</button>
      <button @click="exportExcel">导出Excel</button>
    </div>

    <table>
      <thead>
        <tr>
          <th
            v-for="(col, index) in columns"
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
          <td v-for="col in columns" :key="col.prop">
            {{ formatCell(row[col.prop]) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, type PropType } from 'vue'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

export interface Column {
  label: string
  prop: string
  sortable?: boolean
  width?: number
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
</style>
