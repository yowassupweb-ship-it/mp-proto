import Head from 'next/head'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Settings2, Eye, EyeOff, Search, Edit, Filter } from 'lucide-react'
import BottomBar from '../components/BottomBar'

const VISIBLE_COLUMNS_STORAGE = 'mp.vedomosti.visibleColumns.v1'
const COLUMN_WIDTHS_STORAGE = 'mp.vedomosti.columnWidths.v1'
const COLUMN_ORDER_STORAGE = 'mp.vedomosti.columnOrder.v1'

const BASE_ROWS = [
  {
    id: 16405,
    tourNo: 1090,
    product: 'Пешки',
    date: '07.12.2025',
    endDate: '07.12.2025',
    to: 'Вокруг света Москва',
    operator: 'Жевнеров',
    days: '1',
    shortName: 'Студенческий городок РУДН',
    fullName: 'Кухня дружбы народов',
    route: 'Москва – Студенческий городок РУДН – Главный корпус РУДН – Международный культурный центр – Музей дружбы народов – Парк 850-летия Москвы – Библиотека РУДН – Спортивный комплекс',
    note: '',
    price: 3850,
    seats: '1/0/0/11-12',
    pickup: 'у входа в кафе «Сити»',
    departure: '11:55',
    department: 'Жевнеров',
    guide: 'Таран Ирина Петровна НПД',
    noQuota: 'var5',
    docs: 'Проверено ст. менеджером',
    pd: 'Проверено ст. менеджером',
    incomeChecked: 'Да',
    costsChecked: 'Да',
    clientDiscount: 0,
    agencyDiscount: 0,
    hours: '3',
    ignoreRemoved: 'Нет'
  },
  {
    id: 16530,
    tourNo: 2016,
    product: 'Пешки',
    date: '15.11.2025',
    endDate: '15.11.2025',
    to: 'Вокруг света Москва',
    operator: 'Жевнеров',
    days: '1',
    shortName: 'Солдатская слобода',
    fullName: 'Планета Лефортово. Дворцово-парковое путешествие',
    route: 'Москва – Солдатская слобода – Лефортовский парк – Екатерининский дворец – Дворцовый пруд – Грот – Монументальные ворота – Аллея Славы – Памятник Петру I – Анненгофская роща – Яузский бульвар',
    note: '',
    price: 980,
    seats: '17/0/0/13-30',
    pickup: 'м. Лефортово',
    departure: '10:30',
    department: 'Жевнеров',
    guide: 'Седова Ирина Михайловна НПД',
    noQuota: 'var5',
    docs: 'Проверено ст. менеджером',
    pd: 'Проверено ст. менеджером',
    incomeChecked: 'Да',
    costsChecked: 'Да',
    clientDiscount: 0,
    agencyDiscount: 0,
    hours: '2,5',
    ignoreRemoved: 'Нет'
  },
  {
    id: 16544,
    tourNo: 2018,
    product: 'Пешки',
    date: '29.11.2025',
    endDate: '29.11.2025',
    to: 'Вокруг света Москва',
    operator: 'Одн 1',
    days: '1',
    shortName: 'Особняк Тарасова',
    fullName: 'Московский палаццо',
    route: 'Москва – Особняк Тарасова – ул. Спиридоновка – Патриаршие пруды – Дом Маргариты – Музей Булгакова – Малая Бронная – Большая Садовая – Триумфальная площадь – Тверская улица – Пушкинская площадь',
    note: 'Тур снят',
    price: 2790,
    seats: '10/0/0/0-10',
    pickup: 'м. Баррикадная',
    departure: '15:00',
    department: 'Одн 1',
    guide: 'Терновский Дмитрий Борисович НПД',
    noQuota: 'var5',
    docs: 'Проверено ст. менеджером',
    pd: 'Проверено ст. менеджером',
    incomeChecked: 'Да',
    costsChecked: 'Да',
    clientDiscount: 0,
    agencyDiscount: 0,
    hours: '2',
    ignoreRemoved: 'Да'
  }
]

const COLUMNS = [
  { key: 'id', title: '№ Ведомости', type: 'number', sortable: true, defaultWidth: 80 },
  { key: 'tourNo', title: '№ Тура', type: 'number', sortable: true, defaultWidth: 50 },
  { key: 'product', title: 'Продукт', type: 'string', sortable: true, defaultWidth: 70 },
  { key: 'date', title: 'Дата', type: 'date', sortable: true, defaultWidth: 90 },
  { key: 'endDate', title: 'Дата конца', type: 'date', sortable: true, defaultWidth: 100 },
  { key: 'to', title: 'TO', type: 'string', sortable: true, defaultWidth: 180 },
  { key: 'operator', title: 'Отдел', type: 'string', sortable: true, defaultWidth: 110 },
  { key: 'days', title: 'Дн.', type: 'string', sortable: true, defaultWidth: 58 },
  { key: 'shortName', title: 'Краткое название', type: 'string', sortable: true, defaultWidth: 200 },
  { key: 'fullName', title: 'Название', type: 'string', sortable: true, defaultWidth: 260 },
  { key: 'route', title: 'Маршрут', type: 'string', sortable: true, defaultWidth: 320 },
  { key: 'note', title: 'Заметка', type: 'string', sortable: true, defaultWidth: 100 },
  { key: 'price', title: 'Цена', type: 'number', sortable: true, defaultWidth: 80 },
  { key: 'seats', title: 'Мест', type: 'string', sortable: true, defaultWidth: 100 },
  { key: 'pickup', title: 'Место сбора (пункт)', type: 'string', sortable: true, defaultWidth: 160 },
  { key: 'departure', title: 'Время отпр.', type: 'string', sortable: true, defaultWidth: 100 },
  { key: 'department', title: 'Отдел', type: 'string', sortable: true, defaultWidth: 100 },
  { key: 'guide', title: 'Гид', type: 'string', sortable: true, defaultWidth: 250 },
  { key: 'noQuota', title: 'Нет квот', type: 'string', sortable: true, defaultWidth: 120 },
  { key: 'docs', title: 'Набор документов', type: 'string', sortable: true, defaultWidth: 210 },
  { key: 'pd', title: 'ПД', type: 'string', sortable: true, defaultWidth: 180 },
  { key: 'incomeChecked', title: 'Приходы пр.', type: 'string', sortable: true, defaultWidth: 105 },
  { key: 'costsChecked', title: 'Затраты пр.', type: 'string', sortable: true, defaultWidth: 100 },
  { key: 'clientDiscount', title: 'Скидка кл.', type: 'number', sortable: true, defaultWidth: 90 },
  { key: 'agencyDiscount', title: 'Скидка аг.', type: 'number', sortable: true, defaultWidth: 90 },
  { key: 'hours', title: 'Часы', type: 'string', sortable: true, defaultWidth: 60 },
  { key: 'ignoreRemoved', title: 'Игн. снят', type: 'string', sortable: true, defaultWidth: 90 }
]

function generateRows(total) {
  return Array.from({ length: total }, (_, idx) => {
    const base = BASE_ROWS[idx % BASE_ROWS.length]
    const nextId = base.id + idx * 3
    const day = String(((idx * 2) % 28) + 1).padStart(2, '0')
    const month = String((idx % 12) + 1).padStart(2, '0')
    const year = idx % 3 === 0 ? '2025' : '2026'

    return {
      ...base,
      id: nextId,
      tourNo: base.tourNo + (idx % 7),
      date: `${day}.${month}.${year}`,
      endDate: `${day}.${month}.${year}`,
      seats: `${(idx * 3) % 20}/0/0/${(idx % 18) + 1}-${(idx % 18) + 8}`,
      departure: `${String(9 + (idx % 9)).padStart(2, '0')}:${idx % 2 === 0 ? '00' : '30'}`,
      price: base.price + (idx % 5) * 120,
      note: idx % 5 === 0 ? 'Тур снят' : '',
      hours: idx % 2 === 0 ? '2,5' : '3'
    }
  })
}

function parseDate(dateText) {
  const [day = '01', month = '01', year = '1970'] = String(dateText || '').split('.')
  return new Date(Number(year), Number(month) - 1, Number(day)).getTime()
}

function compareValues(a, b, type) {
  if (type === 'number') return Number(a || 0) - Number(b || 0)
  if (type === 'date') return parseDate(a) - parseDate(b)
  return String(a || '').localeCompare(String(b || ''), 'ru', { sensitivity: 'base' })
}

function VedomostiTable({ onOpenSettings }) {
  const allRows = useMemo(() => generateRows(120), [])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [showColumnSettings, setShowColumnSettings] = useState(false)
  const [visibleColumns, setVisibleColumns] = useState(() => COLUMNS.map((c) => c.key))
  const [columnWidths, setColumnWidths] = useState(() => Object.fromEntries(COLUMNS.map((c) => [c.key, c.defaultWidth])))
  const [columnTitles, setColumnTitles] = useState(() => Object.fromEntries(COLUMNS.map((c) => [c.key, c.title])))
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState({ key: 'date', dir: 'asc' })
  const [columnFilters, setColumnFilters] = useState({})
  const [openDatePicker, setOpenDatePicker] = useState(null)
  const [tempDateRange, setTempDateRange] = useState('')
  const [calendarDate, setCalendarDate] = useState(() => new Date())
  const [selectedStartDate, setSelectedStartDate] = useState(null)
  const [selectedEndDate, setSelectedEndDate] = useState(null)
  const [showRouteMultiline, setShowRouteMultiline] = useState(false)
  const [columnOrder, setColumnOrder] = useState(() => COLUMNS.map(c => c.key))
  const [draggedColumn, setDraggedColumn] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [openDaysDropdown, setOpenDaysDropdown] = useState(false)
  const [selectedDays, setSelectedDays] = useState([])
  const [openDepartmentDropdown, setOpenDepartmentDropdown] = useState(false)
  const [selectedDepartments, setSelectedDepartments] = useState([])
  const [openNoQuotaDropdown, setOpenNoQuotaDropdown] = useState(false)
  const [selectedNoQuota, setSelectedNoQuota] = useState([])
  const [openDepartureDropdown, setOpenDepartureDropdown] = useState(false)
  const [selectedDepartures, setSelectedDepartures] = useState([])
  const [openHoursDropdown, setOpenHoursDropdown] = useState(false)
  const [selectedHours, setSelectedHours] = useState([])
  const tableScrollRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    // Загрузка настроек с сервера
    loadSettingsFromServer()
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || !isLoaded) return
    console.log('[CLIENT] Column settings updated:', {
      visibleColumns,
      columnWidths,
      visibleCount: visibleColumns.length,
      totalWidth: Object.values(columnWidths).reduce((sum, w) => sum + w, 0)
    })
    // Автосохранение на сервер
    saveSettingsToServer()
  }, [visibleColumns])

  useEffect(() => {
    if (typeof window === 'undefined' || !isLoaded) return
    console.log('[CLIENT] Column widths updated:', {
      columnWidths,
      totalWidth: Object.values(columnWidths).reduce((sum, w) => sum + w, 0),
      avgWidth: Math.round(Object.values(columnWidths).reduce((sum, w) => sum + w, 0) / Object.keys(columnWidths).length)
    })
    // Автосохранение на сервер
    saveSettingsToServer()
  }, [columnWidths])

  useEffect(() => {
    if (typeof window === 'undefined' || !isLoaded) return
    console.log('[CLIENT] Column order updated:', { columnOrder })
    // Автосохранение на сервер
    saveSettingsToServer()
  }, [columnOrder])

  useEffect(() => {
    if (typeof window === 'undefined' || !isLoaded) return
    console.log('[CLIENT] Column titles updated:', { columnTitles })
    // Автосохранение на сервер
    saveSettingsToServer()
  }, [columnTitles])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const onKeyDown = (event) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return

      const target = event.target
      const isEditable =
        target instanceof HTMLElement &&
        (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))

      if (isEditable) return

      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        scrollTable(-200)
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault()
        scrollTable(200)
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  useEffect(() => {
    if (!openDatePicker) return

    const handleClickOutside = (e) => {
      if (!e.target.closest('.ved-date-filter')) {
        setOpenDatePicker(null)
      }
    }

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setOpenDatePicker(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [openDatePicker])

  useEffect(() => {
    if (!openDaysDropdown) return

    const handleClickOutside = (e) => {
      if (!e.target.closest('.ved-days-filter')) {
        setOpenDaysDropdown(false)
      }
    }

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setOpenDaysDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [openDaysDropdown])

  useEffect(() => {
    if (!openDepartmentDropdown && !openNoQuotaDropdown && !openDepartureDropdown && !openHoursDropdown) return

    const handleClickOutside = (e) => {
      if (!e.target.closest('.ved-days-filter')) {
        setOpenDepartmentDropdown(false)
        setOpenNoQuotaDropdown(false)
        setOpenDepartureDropdown(false)
        setOpenHoursDropdown(false)
      }
    }

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setOpenDepartmentDropdown(false)
        setOpenNoQuotaDropdown(false)
        setOpenDepartureDropdown(false)
        setOpenHoursDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [openDepartmentDropdown, openNoQuotaDropdown, openDepartureDropdown, openHoursDropdown])

  const visibleDefs = useMemo(() => {
    return columnOrder
      .map(key => COLUMNS.find(c => c.key === key))
      .filter(col => col && visibleColumns.includes(col.key))
  }, [visibleColumns, columnOrder])

  const activeFiltersCount = useMemo(() => {
    return Object.values(columnFilters).filter(val => val && val.trim()).length
  }, [columnFilters])

  const uniqueDepartments = useMemo(() => {
    const depts = new Set()
    allRows.forEach(row => {
      if (row.department) depts.add(row.department)
    })
    return Array.from(depts).sort()
  }, [allRows])

  const uniqueNoQuotas = useMemo(() => {
    const quotas = new Set()
    allRows.forEach(row => {
      if (row.noQuota) quotas.add(row.noQuota)
    })
    return Array.from(quotas).sort()
  }, [allRows])

  const uniqueDepartures = useMemo(() => {
    const deps = new Set()
    allRows.forEach(row => {
      if (row.departure) deps.add(row.departure)
    })
    return Array.from(deps).sort()
  }, [allRows])

  const uniqueHours = useMemo(() => {
    const hrs = new Set()
    allRows.forEach(row => {
      if (row.hours) hrs.add(row.hours)
    })
    return Array.from(hrs).sort()
  }, [allRows])

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase()

    return allRows.filter((row) => {
      // Глобальный поиск
      if (q) {
        const found = Object.values(row).some((val) => String(val || '').toLowerCase().includes(q))
        if (!found) return false
      }

      // Фильтры по столбцам
      for (const [key, filter] of Object.entries(columnFilters)) {
        if (!filter) continue
        const col = COLUMNS.find(c => c.key === key)
        if (!col) continue

        if (col.type === 'date') {
          const filterText = String(filter).trim()
          if (filterText) {
            // Поддержка диапазона дат: "01.01.2025 - 31.12.2025"
            const rangeMatch = filterText.match(/^(\d{2}\.\d{2}\.\d{4})\s*-\s*(\d{2}\.\d{2}\.\d{4})$/)
            if (rangeMatch) {
              const [_, fromStr, toStr] = rangeMatch
              const rowDate = parseDate(row[key])
              const fromDate = parseDate(fromStr)
              const toDate = parseDate(toStr)
              if (rowDate < fromDate || rowDate > toDate) return false
            } else {
              // Одиночная дата - точное совпадение
              const cellValue = String(row[key] || '').toLowerCase()
              if (!cellValue.includes(filterText.toLowerCase())) return false
            }
          }
        } else if (['department', 'noQuota', 'departure', 'hours'].includes(key)) {
          // Множественный фильтр с разделителем |
          const filterText = String(filter).trim()
          if (filterText) {
            const values = filterText.split('|').map(v => v.trim().toLowerCase())
            const cellValue = String(row[key] || '').toLowerCase()
            if (!values.some(v => cellValue.includes(v))) return false
          }
        } else {
          const filterText = String(filter).trim().toLowerCase()
          if (filterText) {
            const cellValue = String(row[key] || '').toLowerCase()
            if (!cellValue.includes(filterText)) return false
          }
        }
      }

      if (!q) return true

      const searchPool = [row.id, row.tourNo, row.shortName, row.fullName, row.route, row.pickup, row.guide, row.operator]
      return searchPool.some((value) => String(value || '').toLowerCase().includes(q))
    })
  }, [allRows, search, columnFilters])

  const sortedRows = useMemo(() => {
    const col = COLUMNS.find((c) => c.key === sortBy.key) || COLUMNS[0]
    const dir = sortBy.dir === 'asc' ? 1 : -1
    return [...filteredRows].sort((a, b) => compareValues(a[col.key], b[col.key], col.type) * dir)
  }, [filteredRows, sortBy])

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize))

  useEffect(() => {
    setPage(1)
  }, [pageSize, search, sortBy.key, sortBy.dir])

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const pageRows = useMemo(() => {
    const start = (page - 1) * pageSize
    return sortedRows.slice(start, start + pageSize)
  }, [page, pageSize, sortedRows])

  const pageButtons = useMemo(() => {
    const buttons = []
    const start = Math.max(1, page - 2)
    const end = Math.min(totalPages, start + 4)
    for (let i = start; i <= end; i += 1) buttons.push(i)
    return buttons
  }, [page, totalPages])

  function toggleColumn(key) {
    setVisibleColumns((prev) => {
      if (prev.includes(key)) {
        if (prev.length === 1) return prev
        return prev.filter((item) => item !== key)
      }
      return [...prev, key]
    })
  }

  function resetColumns() {
    setVisibleColumns(COLUMNS.map((c) => c.key))
  }

  function compactColumns() {
    const compactKeys = ['id', 'tourNo', 'product', 'date', 'to', 'shortName', 'route', 'price', 'seats', 'pickup', 'departure', 'guide', 'hours']
    setVisibleColumns(compactKeys)
    setColumnWidths((prev) => {
      const next = { ...prev }
      COLUMNS.forEach((col) => {
        const base = col.defaultWidth
        const aggressive = Math.round(base * 0.68)
        next[col.key] = Math.max(70, aggressive)
      })
      return next
    })
  }

  function setColumnWidth(key, value) {
    const width = Math.min(500, Math.max(40, Number(value || 40)))
    setColumnWidths((prev) => ({ ...prev, [key]: width }))
  }

  function setColumnTitle(key, value) {
    setColumnTitles((prev) => ({ ...prev, [key]: value }))
  }

  function resetColumnWidths() {
    setColumnWidths(Object.fromEntries(COLUMNS.map((c) => [c.key, c.defaultWidth])))
  }

  async function saveSettingsToServer() {
    const settings = {
      version: 4, // Версия настроек для миграции
      columnWidths,
      visibleColumns,
      columnOrder,
      columnTitles,
      timestamp: new Date().toISOString()
    }
    
    console.log('[CLIENT] Attempting to save settings to server:', settings)
    
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': 'default-user'
        },
        body: JSON.stringify(settings)
      })
      
      if (!response.ok) {
        throw new Error('Failed to save settings')
      }
      
      const result = await response.json()
      console.log('[CLIENT] Settings saved to server successfully:', result)
    } catch (err) {
      console.error('[CLIENT] Error saving settings to server:', err)
    }
  }

  async function loadSettingsFromServer() {
    console.log('[CLIENT] Loading settings from server...')
    try {
      const response = await fetch('/api/settings', {
        headers: {
          'X-User-Id': 'default-user'
        }
      })
      
      if (response.ok) {
        const settings = await response.json()
        console.log('[CLIENT] Settings loaded from server:', settings)
        
        // Версия настроек для миграции (добавлено 2026-02-17)
        const SETTINGS_VERSION = 4
        const savedVersion = settings.version || 1
        
        // Если версия настроек старая, используем новые дефолтные ширины и названия
        if (savedVersion < SETTINGS_VERSION) {
          console.log('[CLIENT] Migrating settings from version', savedVersion, 'to', SETTINGS_VERSION)
          // Применяем новые дефолтные ширины и названия, удаляем actions
          const newWidths = Object.fromEntries(COLUMNS.map((c) => [c.key, c.defaultWidth]))
          const newTitles = Object.fromEntries(COLUMNS.map((c) => [c.key, c.title]))
          const newOrder = COLUMNS.map(c => c.key)
          const newVisible = COLUMNS.map(c => c.key)
          setColumnWidths(newWidths)
          setColumnTitles(newTitles)
          setColumnOrder(newOrder)
          setVisibleColumns(newVisible)
        } else {
          // Загружаем сохраненные настройки для новой версии
          if (settings.columnWidths) setColumnWidths(settings.columnWidths)
          if (settings.columnTitles) setColumnTitles(settings.columnTitles)
        }
        
        if (settings.visibleColumns) setVisibleColumns(settings.visibleColumns)
        if (settings.columnOrder) setColumnOrder(settings.columnOrder)
        setIsLoaded(true)
        return true
      } else {
        console.log('[CLIENT] No settings found on server, using defaults')
        setIsLoaded(true)
        return false
      }
    } catch (err) {
      console.error('[CLIENT] Error loading settings from server:', err)
      setIsLoaded(true)
      return false
    }
  }

  function closeColumnSettings() {
    saveSettingsToServer()
    setShowColumnSettings(false)
  }

  function clearAllFilters() {
    setColumnFilters({})
    setSelectedDays([])
    setSelectedDepartments([])
    setSelectedNoQuota([])
    setSelectedDepartures([])
    setSelectedHours([])
  }

  function toggleDaysDropdown() {
    setOpenDaysDropdown(!openDaysDropdown)
  }

  function toggleDaySelection(day) {
    setSelectedDays(prev => {
      const newDays = prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
      
      // Обновляем фильтр
      if (newDays.length > 0) {
        setColumnFilters(prev => ({
          ...prev,
          days: newDays.join(', ')
        }))
      } else {
        setColumnFilters(prev => {
          const { days, ...rest } = prev
          return rest
        })
      }
      
      return newDays
    })
  }

  function toggleDepartmentSelection(dept) {
    setSelectedDepartments(prev => {
      const newDeps = prev.includes(dept) 
        ? prev.filter(d => d !== dept)
        : [...prev, dept]
      
      if (newDeps.length > 0) {
        setColumnFilters(prev => ({
          ...prev,
          department: newDeps.join('|')
        }))
      } else {
        setColumnFilters(prev => {
          const { department, ...rest } = prev
          return rest
        })
      }
      
      return newDeps
    })
  }

  function toggleNoQuotaSelection(quota) {
    setSelectedNoQuota(prev => {
      const newQuotas = prev.includes(quota) 
        ? prev.filter(q => q !== quota)
        : [...prev, quota]
      
      if (newQuotas.length > 0) {
        setColumnFilters(prev => ({
          ...prev,
          noQuota: newQuotas.join('|')
        }))
      } else {
        setColumnFilters(prev => {
          const { noQuota, ...rest } = prev
          return rest
        })
      }
      
      return newQuotas
    })
  }

  function toggleDepartureSelection(departure) {
    setSelectedDepartures(prev => {
      const newDepartures = prev.includes(departure) 
        ? prev.filter(d => d !== departure)
        : [...prev, departure]
      
      if (newDepartures.length > 0) {
        setColumnFilters(prev => ({
          ...prev,
          departure: newDepartures.join('|')
        }))
      } else {
        setColumnFilters(prev => {
          const { departure, ...rest } = prev
          return rest
        })
      }
      
      return newDepartures
    })
  }

  function toggleHoursSelection(hour) {
    setSelectedHours(prev => {
      const newHours = prev.includes(hour) 
        ? prev.filter(h => h !== hour)
        : [...prev, hour]
      
      if (newHours.length > 0) {
        setColumnFilters(prev => ({
          ...prev,
          hours: newHours.join('|')
        }))
      } else {
        setColumnFilters(prev => {
          const { hours, ...rest } = prev
          return rest
        })
      }
      
      return newHours
    })
  }

  function handleSort(col) {
    if (!col.sortable) return
    setSortBy((prev) => {
      if (prev.key !== col.key) return { key: col.key, dir: 'asc' }
      return { key: col.key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
    })
  }

  function renderCell(row, key) {
    const value = row[key]

    if (key === 'id') {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>{value}</span>
          <button 
            type="button" 
            className="ved-edit-btn"
            onClick={() => alert(`Редактирование ведомости #${value}`)}
            title="Редактировать"
          >
            <Edit size={14} />
          </button>
        </div>
      )
    }

    if (key === 'to') {
      if (value && value.includes('Вокруг света')) {
        return <span style={{ color: '#ff732d', fontWeight: 'bold' }}>{value}</span>
      }
      return <span style={{ fontWeight: 'bold' }}>{value || '—'}</span>
    }

    if (key === 'seats') {
      if (!value) return '—'
      // Парсим формат: 16/0/0/1-8
      const parts = String(value).split('/')
      return (
        <div className="ved-seats-display">
          <span className="ved-seats-text">
            <span className="ved-seat-total">{parts[0] || ''}</span>
            {parts.length > 1 && (
              <>
                <span className="ved-seat-sep">/</span>
                <span className="ved-seat-reserved">{parts[1] || '0'}</span>
                <span className="ved-seat-sep">/</span>
                <span className="ved-seat-paid">{parts[2] || '0'}</span>
                {parts[3] && (
                  <>
                    <span className="ved-seat-sep">/</span>
                    <span className="ved-seat-range">{parts[3]}</span>
                  </>
                )}
              </>
            )}
          </span>
        </div>
      )
    }

    if (key === 'price') return `${value} ₽`

    if (key === 'note') {
      if (!value) return '—'
      return <span className="ved-badge ved-badge--warn">{value}</span>
    }

    if (key === 'incomeChecked' || key === 'costsChecked') {
      return <span className="ved-badge ved-badge--ok">{value || '—'}</span>
    }

    return value || '—'
  }

  function getCellTitle(row, key) {
    const value = row[key]
    if (key === 'price') return `${value} ₽`
    if (!value) return ''
    return String(value)
  }

  function openDateRangePicker(colKey) {
    const existing = columnFilters[colKey] || ''
    setTempDateRange(existing)
    
    // Parse existing range if present
    if (existing) {
      const rangeMatch = existing.match(/^(\d{2})\.(\d{2})\.(\d{4})\s*-\s*(\d{2})\.(\d{2})\.(\d{4})$/)
      if (rangeMatch) {
        const [_, d1, m1, y1, d2, m2, y2] = rangeMatch
        setSelectedStartDate(new Date(Number(y1), Number(m1) - 1, Number(d1)))
        setSelectedEndDate(new Date(Number(y2), Number(m2) - 1, Number(d2)))
      } else {
        const singleMatch = existing.match(/^(\d{2})\.(\d{2})\.(\d{4})$/)
        if (singleMatch) {
          const [_, d, m, y] = singleMatch
          const date = new Date(Number(y), Number(m) - 1, Number(d))
          setSelectedStartDate(date)
          setSelectedEndDate(date)
        }
      }
    } else {
      setSelectedStartDate(null)
      setSelectedEndDate(null)
    }
    
    setCalendarDate(new Date())
    setOpenDatePicker(colKey)
  }

  function applyDateRange(colKey) {
    if (selectedStartDate && selectedEndDate) {
      const formatDate = (date) => {
        const d = String(date.getDate()).padStart(2, '0')
        const m = String(date.getMonth() + 1).padStart(2, '0')
        const y = date.getFullYear()
        return `${d}.${m}.${y}`
      }
      
      if (selectedStartDate.getTime() === selectedEndDate.getTime()) {
        setColumnFilters(prev => ({ ...prev, [colKey]: formatDate(selectedStartDate) }))
      } else {
        const start = selectedStartDate <= selectedEndDate ? selectedStartDate : selectedEndDate
        const end = selectedStartDate <= selectedEndDate ? selectedEndDate : selectedStartDate
        setColumnFilters(prev => ({ ...prev, [colKey]: `${formatDate(start)} - ${formatDate(end)}` }))
      }
    }
    setOpenDatePicker(null)
  }

  function clearDateRange(colKey) {
    setColumnFilters(prev => ({ ...prev, [colKey]: '' }))
    setTempDateRange('')
    setSelectedStartDate(null)
    setSelectedEndDate(null)
    setOpenDatePicker(null)
  }

  function handleCalendarDateClick(date) {
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      setSelectedStartDate(date)
      setSelectedEndDate(null)
    } else {
      setSelectedEndDate(date)
    }
  }

  function generateCalendarDays(year, month) {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1
    const days = []
    
    // Previous month days
    for (let i = startOffset - 1; i >= 0; i--) {
      const date = new Date(year, month, -i)
      days.push({ date, isCurrentMonth: false })
    }
    
    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i)
      days.push({ date, isCurrentMonth: true })
    }
    
    // Next month days to fill grid
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i)
      days.push({ date, isCurrentMonth: false })
    }
    
    return days
  }

  function handleDragStart(e, columnKey) {
    setDraggedColumn(columnKey)
    e.dataTransfer.effectAllowed = 'move'
  }

  function handleDragOver(e) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  function handleDrop(e, targetColumnKey) {
    e.preventDefault()
    if (!draggedColumn || draggedColumn === targetColumnKey) {
      setDraggedColumn(null)
      return
    }

    const newOrder = [...columnOrder]
    const draggedIdx = newOrder.indexOf(draggedColumn)
    const targetIdx = newOrder.indexOf(targetColumnKey)
    
    newOrder.splice(draggedIdx, 1)
    newOrder.splice(targetIdx, 0, draggedColumn)
    
    setColumnOrder(newOrder)
    setDraggedColumn(null)
  }

  const headScrollRef = useRef(null)
  const dockScrollRef = useRef(null)

  function scrollTable(delta) {
    const tableEl = tableScrollRef.current
    if (!tableEl) return

    const nextLeft = Math.max(0, Math.min(tableEl.scrollWidth - tableEl.clientWidth, tableEl.scrollLeft + delta))
    tableEl.scrollLeft = nextLeft
  }

  useEffect(() => {
    const tableEl = tableScrollRef.current
    const headEl = headScrollRef.current
    const dockEl = dockScrollRef.current
    if (!tableEl || !headEl || !dockEl) return

    const syncScroll = (e) => {
      const scrollLeft = e.target.scrollLeft
      if (e.target !== tableEl) tableEl.scrollLeft = scrollLeft
      if (e.target !== headEl) headEl.scrollLeft = scrollLeft
      if (e.target !== dockEl) dockEl.scrollLeft = scrollLeft
    }

    tableEl.addEventListener('scroll', syncScroll)
    headEl.addEventListener('scroll', syncScroll)
    dockEl.addEventListener('scroll', syncScroll)

    return () => {
      tableEl.removeEventListener('scroll', syncScroll)
      headEl.removeEventListener('scroll', syncScroll)
      dockEl.removeEventListener('scroll', syncScroll)
    }
  }, [])

  return (
    <section className="ved-page">
      <div className="ved-page-header">
        <div className="ved-header-search">
          <Search size={16} className="ved-search-icon" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по всем столбцам..."
            className="ved-global-search-input"
          />
        </div>
        <h1 className="ved-page-title">Ведомости</h1>
        <div className="ved-header-actions">
          {activeFiltersCount > 0 && (
            <button 
              type="button" 
              className="ved-header-btn ved-clear-filters-btn"
              onClick={clearAllFilters}
              title={`Сбросить все фильтры (${activeFiltersCount})`}
            >
              <Filter size={16} />
              <span className="ved-filter-badge">{activeFiltersCount}</span>
            </button>
          )}
          <button 
            type="button" 
            className="ved-header-btn"
            onClick={clearAllFilters}
            title="Сбросить фильтры"
          >
            <EyeOff size={16} />
          </button>
          <button 
            type="button" 
            className="ved-header-btn"
            onClick={() => setShowColumnSettings(true)}
            title="Настройки столбцов"
          >
            <Settings2 size={16} />
          </button>
        </div>
      </div>
      <div className="ved-table-wrap">
        <div className="ved-head-scroll" ref={headScrollRef}>
          <div 
            className="ved-head-proxy" 
            style={{
              width: `${visibleDefs.reduce((sum, col) => sum + (columnWidths[col.key] || col.defaultWidth), 0)}px`
            }}
          >
            <div className="ved-head-row" role="row">
              {visibleDefs.map((col, index) => (
                <button
                  key={`proxy-${col.key}`}
                  type="button"
                  data-col={col.key}
                  className={`ved-head-proxy-cell ${index === 0 ? 'ved-sticky ved-sticky-1' : ''} ${col.sortable ? 'ved-sortable' : ''} ${draggedColumn === col.key ? 'ved-dragging' : ''} ${columnFilters[col.key] ? 'ved-filtered' : ''}`}
                  onClick={() => handleSort(col)}
                  draggable={true}
                  onDragStart={(e) => handleDragStart(e, col.key)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, col.key)}
                  style={{
                    width: `${columnWidths[col.key] || col.defaultWidth}px`,
                    minWidth: `${columnWidths[col.key] || col.defaultWidth}px`
                  }}
                >
                  <span className="ved-th-inner">
                    <span className="ved-th-title" title={columnTitles[col.key] || col.title}>{columnTitles[col.key] || col.title}</span>
                    {col.key === 'route' && (
                      <button
                        type="button"
                        className="ved-route-toggle"
                        onClick={(e) => {
                          e.stopPropagation()
                          setShowRouteMultiline(v => !v)
                        }}
                        title={showRouteMultiline ? 'Скрыть полные маршруты' : 'Показать полные маршруты'}
                      >
                        {showRouteMultiline ? <Eye size={14} /> : <EyeOff size={14} />}
                      </button>
                    )}
                    {sortBy.key === col.key ? (
                      <svg className="ved-sort-icon" width="10" height="14" viewBox="0 0 10 14" fill="none">
                        <path d="M5 2L8 6H2L5 2Z" fill={sortBy.dir === 'asc' ? 'currentColor' : '#cbd5e1'} />
                        <path d="M5 12L2 8H8L5 12Z" fill={sortBy.dir === 'desc' ? 'currentColor' : '#cbd5e1'} />
                      </svg>
                    ) : null}
                  </span>
                </button>
              ))}
            </div>
            <div className="ved-head-row ved-filter-row" role="row">
              {visibleDefs.map((col, index) => (
                <div
                  key={`filter-${col.key}`}
                  data-col={col.key}
                  className={`ved-filter-cell ${index === 0 ? 'ved-sticky ved-sticky-1' : ''}`}
                  style={{
                    width: `${columnWidths[col.key] || col.defaultWidth}px`,
                    minWidth: `${columnWidths[col.key] || col.defaultWidth}px`
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {col.type === 'date' ? (
                    <div className="ved-date-filter">
                      <input
                        type="text"
                        className="ved-filter-input"
                        placeholder="дд.мм.гггг - дд.мм.гггг"
                        value={columnFilters[col.key] || ''}
                        onFocus={() => openDateRangePicker(col.key)}
                        readOnly
                      />
                      {openDatePicker === col.key && (
                        <div className="ved-date-picker-dropdown ved-calendar-dropdown">
                          <div className="ved-date-picker-header">
                            <button 
                              type="button" 
                              className="ved-cal-nav-btn"
                              onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1))}
                            >
                              ‹
                            </button>
                            <span className="ved-cal-month-year">
                              {new Intl.DateTimeFormat('ru', { month: 'long', year: 'numeric' }).format(calendarDate)}
                            </span>
                            <button 
                              type="button" 
                              className="ved-cal-nav-btn"
                              onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1))}
                            >
                              ›
                            </button>
                          </div>
                          <div className="ved-calendar-grid">
                            <div className="ved-cal-weekdays">
                              {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
                                <div key={day} className="ved-cal-weekday">{day}</div>
                              ))}
                            </div>
                            <div className="ved-cal-days">
                              {generateCalendarDays(calendarDate.getFullYear(), calendarDate.getMonth()).map(({ date, isCurrentMonth }, idx) => {
                                const isSelected = selectedStartDate && selectedEndDate && 
                                  date >= (selectedStartDate <= selectedEndDate ? selectedStartDate : selectedEndDate) && 
                                  date <= (selectedStartDate <= selectedEndDate ? selectedEndDate : selectedStartDate)
                                const isStart = selectedStartDate && date.getTime() === selectedStartDate.getTime()
                                const isEnd = selectedEndDate && date.getTime() === selectedEndDate.getTime()
                                
                                return (
                                  <button
                                    key={idx}
                                    type="button"
                                    className={`ved-cal-day ${isCurrentMonth ? '' : 'ved-cal-day-other'} ${isSelected ? 'ved-cal-day-selected' : ''} ${isStart || isEnd ? 'ved-cal-day-edge' : ''}`}
                                    onClick={() => handleCalendarDateClick(date)}
                                  >
                                    {date.getDate()}
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                          <div className="ved-date-picker-actions">
                            <button type="button" onClick={() => clearDateRange(col.key)} className="ved-date-btn ved-date-btn-clear">
                              Очистить
                            </button>
                            <button 
                              type="button" 
                              onClick={() => applyDateRange(col.key)} 
                              className="ved-date-btn ved-date-btn-apply"
                              disabled={!selectedStartDate || !selectedEndDate}
                            >
                              Применить
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : col.key === 'days' ? (
                    <div className="ved-days-filter" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        className="ved-filter-input"
                        placeholder="Выберите дни..."
                        value={selectedDays.length > 0 ? `${selectedDays.length} выбрано` : ''}
                        onFocus={() => setOpenDaysDropdown(true)}
                        readOnly
                      />
                      {openDaysDropdown && (
                        <div className="ved-days-dropdown">
                          {['1', '2', '3', '4', '5', '6', '7'].map(day => (
                            <label key={day} className="ved-days-option">
                              <input
                                type="checkbox"
                                checked={selectedDays.includes(day)}
                                onChange={() => toggleDaySelection(day)}
                              />
                              <span>{day}</span>
                            </label>
                          ))}
                          <button 
                            type="button" 
                            className="ved-days-close"
                            onClick={() => setOpenDaysDropdown(false)}
                          >
                            Закрыть
                          </button>
                        </div>
                      )}
                    </div>
                  ) : col.key === 'department' ? (
                    <div className="ved-days-filter" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        className="ved-filter-input"
                        placeholder="Выберите отделы..."
                        value={selectedDepartments.length > 0 ? `${selectedDepartments.length} выбрано` : ''}
                        onFocus={() => setOpenDepartmentDropdown(true)}
                        readOnly
                      />
                      {openDepartmentDropdown && (
                        <div className="ved-days-dropdown">
                          {uniqueDepartments.map(dept => (
                            <label key={dept} className="ved-days-option">
                              <input
                                type="checkbox"
                                checked={selectedDepartments.includes(dept)}
                                onChange={() => toggleDepartmentSelection(dept)}
                              />
                              <span>{dept}</span>
                            </label>
                          ))}
                          <button 
                            type="button" 
                            className="ved-days-close"
                            onClick={() => setOpenDepartmentDropdown(false)}
                          >
                            Закрыть
                          </button>
                        </div>
                      )}
                    </div>
                  ) : col.key === 'noQuota' ? (
                    <div className="ved-days-filter" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        className="ved-filter-input"
                        placeholder="Выберите квот..."
                        value={selectedNoQuota.length > 0 ? `${selectedNoQuota.length} выбрано` : ''}
                        onFocus={() => setOpenNoQuotaDropdown(true)}
                        readOnly
                      />
                      {openNoQuotaDropdown && (
                        <div className="ved-days-dropdown">
                          {uniqueNoQuotas.map(quota => (
                            <label key={quota} className="ved-days-option">
                              <input
                                type="checkbox"
                                checked={selectedNoQuota.includes(quota)}
                                onChange={() => toggleNoQuotaSelection(quota)}
                              />
                              <span>{quota}</span>
                            </label>
                          ))}
                          <button 
                            type="button" 
                            className="ved-days-close"
                            onClick={() => setOpenNoQuotaDropdown(false)}
                          >
                            Закрыть
                          </button>
                        </div>
                      )}
                    </div>
                  ) : col.key === 'departure' ? (
                    <div className="ved-days-filter" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        className="ved-filter-input"
                        placeholder="Выберите время..."
                        value={selectedDepartures.length > 0 ? `${selectedDepartures.length} выбрано` : ''}
                        onFocus={() => setOpenDepartureDropdown(true)}
                        readOnly
                      />
                      {openDepartureDropdown && (
                        <div className="ved-days-dropdown">
                          {uniqueDepartures.map(dep => (
                            <label key={dep} className="ved-days-option">
                              <input
                                type="checkbox"
                                checked={selectedDepartures.includes(dep)}
                                onChange={() => toggleDepartureSelection(dep)}
                              />
                              <span>{dep}</span>
                            </label>
                          ))}
                          <button 
                            type="button" 
                            className="ved-days-close"
                            onClick={() => setOpenDepartureDropdown(false)}
                          >
                            Закрыть
                          </button>
                        </div>
                      )}
                    </div>
                  ) : col.key === 'hours' ? (
                    <div className="ved-days-filter" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        className="ved-filter-input"
                        placeholder="Выберите часы..."
                        value={selectedHours.length > 0 ? `${selectedHours.length} выбрано` : ''}
                        onFocus={() => setOpenHoursDropdown(true)}
                        readOnly
                      />
                      {openHoursDropdown && (
                        <div className="ved-days-dropdown">
                          {uniqueHours.map(hour => (
                            <label key={hour} className="ved-days-option">
                              <input
                                type="checkbox"
                                checked={selectedHours.includes(hour)}
                                onChange={() => toggleHoursSelection(hour)}
                              />
                              <span>{hour}</span>
                            </label>
                          ))}
                          <button 
                            type="button" 
                            className="ved-days-close"
                            onClick={() => setOpenHoursDropdown(false)}
                          >
                            Закрыть
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <input
                      type="text"
                      className="ved-filter-input"
                      placeholder="Поиск..."
                      value={columnFilters[col.key] || ''}
                      onChange={(e) => {
                        setColumnFilters(prev => ({
                          ...prev,
                          [col.key]: e.target.value
                        }))
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="ved-table-scroll" ref={tableScrollRef}>
        <table 
          className="ved-table"
          style={{
            width: `${visibleDefs.reduce((sum, col) => sum + (columnWidths[col.key] || col.defaultWidth), 0)}px`
          }}
        >
          <tbody>
            {pageRows.length ? (
              pageRows.map((row) => (
                <tr key={row.id}>
                  {visibleDefs.map((col, index) => (
                    <td
                      key={`${row.id}-${col.key}`}
                      data-col={col.key}
                      className={`${col.key === 'price' ? 'ved-num' : ''} ${index === 0 ? 'ved-sticky ved-sticky-1' : ''} ${col.key === 'route' && showRouteMultiline ? 'ved-multiline' : ''}`}
                      style={{
                        width: `${columnWidths[col.key] || col.defaultWidth}px`,
                        minWidth: `${columnWidths[col.key] || col.defaultWidth}px`
                      }}
                      title={getCellTitle(row, col.key)}
                    >
                      <div className={col.key === 'route' && showRouteMultiline ? 'ved-cell-content-wrap' : 'ved-cell-content'}>
                        {renderCell(row, col.key)}
                      </div>
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td className="ved-empty" colSpan={visibleDefs.length}>Ничего не найдено по текущим фильтрам.</td>
              </tr>
            )}
          </tbody>
        </table>
        </div>

        <div className="ved-scroll-dock" ref={dockScrollRef}>
          <div style={{ width: visibleDefs.reduce((sum, col) => sum + (columnWidths[col.key] || col.defaultWidth), 0) + 'px', height: '1px' }}></div>
        </div>
      </div>

      <div className="ved-table-footer">
        <label className="ved-page-size">
          Строк на странице
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value))
              setPage(1)
            }}
          >
            {[10, 20, 30, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>

        <div className="ved-pager">
          <button className="ved-pager-nav" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
            Назад
          </button>
          {pageButtons.map((p) => (
            <button key={p} className={`ved-pager-num ${p === page ? 'is-active' : ''}`} onClick={() => setPage(p)}>
              {p}
            </button>
          ))}
          <span>
            Страница {page} из {totalPages}
          </span>
          <button className="ved-pager-nav" disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
            Вперёд
          </button>
        </div>
      </div>

      {showColumnSettings && (
        <>
          <div className="ved-modal-overlay" onClick={closeColumnSettings} />
          <div className="ved-modal">
            <div className="ved-modal-header">
              <h3>Настройки столбцов</h3>
              <button 
                className="ved-modal-close" 
                onClick={closeColumnSettings}
                aria-label="Закрыть"
              >
                ×
              </button>
            </div>
            <div className="ved-modal-body">
              <div className="ved-col-title">Видимые столбцы ({visibleColumns.length})</div>
              <div className="ved-col-actions">
                <button type="button" onClick={resetColumns}>
                  Показать все
                </button>
                <button type="button" onClick={compactColumns}>
                  Компактно
                </button>
                <button type="button" onClick={resetColumnWidths}>
                  Сброс ширин
                </button>
              </div>

              <div className="ved-col-list">
                {COLUMNS.map((col) => (
                  <div key={col.key} className="ved-col-option">
                    <label className="ved-col-main">
                      <input
                        type="checkbox"
                        checked={visibleColumns.includes(col.key)}
                        onChange={() => toggleColumn(col.key)}
                      />
                      <input
                        type="text"
                        className="ved-col-title-input"
                        value={columnTitles[col.key] || col.title}
                        onChange={(e) => setColumnTitle(col.key, e.target.value)}
                        placeholder={col.title}
                      />
                    </label>
                    <div className="ved-col-width">
                      <input
                        type="range"
                        min="40"
                        max="500"
                        step="10"
                        value={columnWidths[col.key] || col.defaultWidth}
                        onChange={(e) => setColumnWidth(col.key, e.target.value)}
                      />
                      <input
                        type="number"
                        min="40"
                        max="500"
                        value={columnWidths[col.key] || col.defaultWidth}
                        onChange={(e) => setColumnWidth(col.key, e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  )
}

export default function Home() {
  const [activeView, setActiveView] = useState('home')
  const [activeSelection, setActiveSelection] = useState({ sectionKey: null, itemLabel: null })
  const [theme, setTheme] = useState('light')
  const [settingsOpener, setSettingsOpener] = useState(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const savedTheme = window.localStorage.getItem('mp.theme')
    if (savedTheme === 'dark' || savedTheme === 'light') {
      setTheme(savedTheme)
    }
  }, [])

  useEffect(() => {
    if (typeof document === 'undefined') return
    document.documentElement.setAttribute('data-theme', theme)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('mp.theme', theme)
    }
  }, [theme])

  function handleSelectItem({ sectionKey, itemLabel }) {
    setActiveSelection({ sectionKey, itemLabel })

    if (itemLabel === 'Ведомости') {
      setActiveView('vedomosti')
      return
    }
    setActiveView('home')
  }

  function handleLogout() {
    setActiveView('home')
    setActiveSelection({ sectionKey: null, itemLabel: null })
  }

  return (
    <>
      <Head>
        <title>MP — Bottom Bar Demo</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="page">
        {activeView === 'vedomosti' ? (
          <VedomostiTable 
            onOpenSettings={setSettingsOpener}
          />
        ) : null}
      </main>

      <BottomBar
        onSelectItem={handleSelectItem}
        activeSelection={activeSelection}
        theme={theme}
        onThemeChange={setTheme}
        onLogout={handleLogout}
        showColumnsSettings={activeView === 'vedomosti'}
        onOpenSettings={() => settingsOpener?.()}
      />
    </>
  )
}
