import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Settings2, Eye, EyeOff, Search, Edit, Filter } from 'lucide-react'
import BottomBar from '../components/BottomBar'

const VISIBLE_COLUMNS_STORAGE = 'mp.vedomosti.visibleColumns.v1'
const COLUMN_WIDTHS_STORAGE = 'mp.vedomosti.columnWidths.v1'
const COLUMN_ORDER_STORAGE = 'mp.vedomosti.columnOrder.v1'

const BASE_ROWS = [
  {
    id: 31412,
    tourNo: 1711,
    product: 'ЖД Россия',
    date: '04.09.2026',
    endDate: '10.09.2026',
    to: 'Волгоград И-Волга',
    operator: 'ЖД',
    days: '7',
    shortName: 'Волгоград',
    fullName: 'Наследники великой степи',
    route: 'Волгоград - Старая Сарепта - оз. Баскунчак - Астрахань - Осетровая ферма - Лотосовые поля - Элиста',
    note: '',
    price: 70100,
    seats: '10/0/0/0-10',
    seatsDuplicate: '10/0/0/0-10',
    pickup: '',
    departure: '',
    department: 'ЖД',
    guide: '',
    noQuota: 'var3',
    docs: '',
    pd: 'Нет',
    incomeChecked: 'Нет',
    costsChecked: 'Нет',
    clientDiscount: 0,
    agencyDiscount: 0,
    hours: '0',
    ignoreRemoved: 'Нет'
  },
  {
    id: 31404,
    tourNo: 1741,
    product: 'ЖД Россия',
    date: '27.08.2026',
    endDate: '01.09.2026',
    to: 'Северное сияние',
    operator: 'ЖД',
    days: '6',
    shortName: 'Карелия',
    fullName: 'Святой треугольник: Кижи - Валаам - Соловки (3 дня) - 6',
    route: 'Петрозаводск - Кижи - Рускеала - Кивач - Соловки (3 дня) - Кемь',
    note: '',
    price: 80200,
    seats: '10/0/0/0-10',
    seatsDuplicate: '10/0/0/0-10',
    pickup: '',
    departure: '',
    department: 'ЖД',
    guide: '',
    noQuota: 'var3',
    docs: '',
    pd: 'Нет',
    incomeChecked: 'Нет',
    costsChecked: 'Нет',
    clientDiscount: 0,
    agencyDiscount: 0,
    hours: '0',
    ignoreRemoved: 'Нет'
  },
  {
    id: 31391,
    tourNo: 1742,
    product: 'ЖД Россия',
    date: '27.08.2026',
    endDate: '31.08.2026',
    to: 'Северное сияние',
    operator: 'ЖД',
    days: '5',
    shortName: 'Карелия',
    fullName: 'Святой треугольник: Кижи - Валаам - Соловки (2 дня) - 5',
    route: 'Петрозаводск - Кижи - Рускеала - Валаам - Кивач - Соловки (2 дня) - Кемь',
    note: '',
    price: 67200,
    seats: '10/0/0/0-10',
    seatsDuplicate: '10/0/0/0-10',
    pickup: '',
    departure: '',
    department: 'ЖД',
    guide: '',
    noQuota: 'var3',
    docs: '',
    pd: 'Нет',
    incomeChecked: 'Нет',
    costsChecked: 'Нет',
    clientDiscount: 0,
    agencyDiscount: 0,
    hours: '0',
    ignoreRemoved: 'Нет'
  },
  {
    id: 31379,
    tourNo: 1743,
    product: 'ЖД Россия',
    date: '27.08.2026',
    endDate: '30.08.2026',
    to: 'Северное сияние',
    operator: 'ЖД',
    days: '4',
    shortName: 'Карелия',
    fullName: 'Святой треугольник: Кижи - Валаам - Соловки - 4',
    route: 'Петрозаводск - Кижи - Рускеала - Кивач - Соловки - Кемь',
    note: '',
    price: 56600,
    seats: '10/0/0/0-10',
    seatsDuplicate: '10/0/0/0-10',
    pickup: '',
    departure: '',
    department: 'ЖД',
    guide: '',
    noQuota: 'var3',
    docs: '',
    pd: 'Нет',
    incomeChecked: 'Нет',
    costsChecked: 'Нет',
    clientDiscount: 0,
    agencyDiscount: 0,
    hours: '0',
    ignoreRemoved: 'Нет'
  },
  {
    id: 31392,
    tourNo: 2504,
    product: 'ЖД Россия',
    date: '06.06.2026',
    endDate: '07.06.2026',
    to: 'Вокруг света Москва',
    operator: 'Рубцова',
    days: '2',
    shortName: 'Тамбов (модерн)',
    fullName: 'Фестиваль модерна в усадьбе Асеевых',
    route: 'Тамбов – прогулка на катере по реке Цна',
    note: '',
    price: 19990,
    seats: '25/0/0/0-25',
    seatsDuplicate: '25/0/0/0-25',
    pickup: '',
    departure: '',
    department: 'Рубцова',
    guide: '',
    noQuota: 'var1',
    docs: '',
    pd: 'Нет',
    incomeChecked: 'Нет',
    costsChecked: 'Нет',
    clientDiscount: 10,
    agencyDiscount: 0,
    hours: '0',
    ignoreRemoved: 'Нет'
  },
  {
    id: 31367,
    tourNo: 753,
    product: 'МН авто',
    date: '12.06.2026',
    endDate: '14.06.2026',
    to: 'Вокруг света Москва',
    operator: 'Шевырева',
    days: '3',
    shortName: 'Великие Луки – Торопец',
    fullName: 'Себе ж я возьму вон ту землю',
    route: 'Великие Луки – Торопец – Себеж – ландшафтный парк в усадьбе Ореховно – Усадьба С. Ковалевской – Усадьба М. Мусоргского',
    note: '',
    price: 27900,
    seats: '26/0/0/0-26',
    seatsDuplicate: '26/0/0/0-26',
    pickup: 'м. Парк Победы',
    departure: '07:30',
    department: 'Шевырева',
    guide: '',
    noQuota: 'var1',
    docs: '',
    pd: 'Нет',
    incomeChecked: 'Нет',
    costsChecked: 'Нет',
    clientDiscount: 10,
    agencyDiscount: 0,
    hours: '0',
    ignoreRemoved: 'Нет'
  },
  {
    id: 31366,
    tourNo: 1156,
    product: 'Пешки',
    date: '10.05.2026',
    endDate: '10.05.2026',
    to: 'Вокруг света Москва',
    operator: 'Жевнеров',
    days: '1',
    shortName: 'Московские кофейни',
    fullName: 'Кофейная симфония столицы',
    route: 'Московские кофейни (с дегустацией)',
    note: '',
    price: 3500,
    seats: '12/0/0/0-12',
    seatsDuplicate: '12/0/0/0-12',
    pickup: 'м. Площадь Революции и Театральная',
    departure: '',
    department: 'Жевнеров',
    guide: '',
    noQuota: 'var5',
    docs: '',
    pd: 'Нет',
    incomeChecked: 'Нет',
    costsChecked: 'Нет',
    clientDiscount: 0,
    agencyDiscount: 0,
    hours: '3,5',
    ignoreRemoved: 'Нет'
  },
  {
    id: 31362,
    tourNo: 2020,
    product: 'Пешки',
    date: '09.05.2026',
    endDate: '09.05.2026',
    to: 'Вокруг света Москва',
    operator: 'Жевнеров',
    days: '1',
    shortName: 'Формы и вкусы',
    fullName: 'Формы и вкусы. Москва с итальянским акцентом',
    route: 'Итальянская кухня в Москве',
    note: '',
    price: 4900,
    seats: '12/0/0/0-12',
    seatsDuplicate: '12/0/0/0-12',
    pickup: 'м. Площадь Революции и Театральная',
    departure: '',
    department: 'Жевнеров',
    guide: '',
    noQuota: 'var5',
    docs: '',
    pd: 'Нет',
    incomeChecked: 'Нет',
    costsChecked: 'Нет',
    clientDiscount: 0,
    agencyDiscount: 0,
    hours: '3,5',
    ignoreRemoved: 'Нет'
  },
  {
    id: 31359,
    tourNo: 2019,
    product: 'Пешки',
    date: '02.05.2026',
    endDate: '02.05.2026',
    to: 'Вокруг света Москва',
    operator: 'Жевнеров',
    days: '1',
    shortName: 'Питейные заведения',
    fullName: 'Москва на ход ноги (18+)',
    route: 'Питейные заведения Москвы (с дегустациями)',
    note: '',
    price: 5700,
    seats: '12/0/0/0-12',
    seatsDuplicate: '12/0/0/0-12',
    pickup: 'м. Трубная',
    departure: '18:30',
    department: 'Жевнеров',
    guide: '',
    noQuota: 'var5',
    docs: '',
    pd: 'Нет',
    incomeChecked: 'Нет',
    costsChecked: 'Нет',
    clientDiscount: 0,
    agencyDiscount: 0,
    hours: '4',
    ignoreRemoved: 'Нет'
  },
  {
    id: 31355,
    tourNo: 1719,
    product: 'ЖД Россия',
    date: '19.09.2026',
    endDate: '25.09.2026',
    to: 'Владивосток Туроператор Пять звезд',
    operator: 'ЖД',
    days: '7',
    shortName: 'Владивосток',
    fullName: 'Владивосток и Находка: 7 дней у моря',
    route: 'Владивосток - остров Русский - остров Путятина - Находка',
    note: '',
    price: 73450,
    seats: '10/0/0/0-10',
    seatsDuplicate: '10/0/0/0-10',
    pickup: '',
    departure: '',
    department: 'ЖД',
    guide: '',
    noQuota: 'var3',
    docs: '',
    pd: 'Нет',
    incomeChecked: 'Нет',
    costsChecked: 'Нет',
    clientDiscount: 0,
    agencyDiscount: 0,
    hours: '0',
    ignoreRemoved: 'Нет'
  },
  {
    id: 31349,
    tourNo: 1657,
    product: 'ЖД Россия',
    date: '14.09.2026',
    endDate: '23.09.2026',
    to: 'Владивосток Туроператор Пять звезд',
    operator: 'ЖД',
    days: '10',
    shortName: 'Владивосток',
    fullName: 'Отпуск в тельняшке',
    route: 'Владивосток - Сафари-парк - остров Русский - остров Фуругельма - полуостров Гамова',
    note: '',
    price: 124900,
    seats: '10/0/0/0-10',
    seatsDuplicate: '10/0/0/0-10',
    pickup: '',
    departure: '',
    department: 'ЖД',
    guide: '',
    noQuota: 'var3',
    docs: '',
    pd: 'Нет',
    incomeChecked: 'Нет',
    costsChecked: 'Нет',
    clientDiscount: 0,
    agencyDiscount: 0,
    hours: '0',
    ignoreRemoved: 'Нет'
  },
  {
    id: 31339,
    tourNo: 1658,
    product: 'ЖД Россия',
    date: '30.09.2026',
    endDate: '08.10.2026',
    to: 'Владивосток Туроператор Пять звезд',
    operator: 'ЖД',
    days: '9',
    shortName: 'Владивосток',
    fullName: 'Семейное путешествие во Владивосток',
    route: 'Владивосток - Приморский океанариум - Сафари-парк - мыс Таранный - Ботанический сад',
    note: '',
    price: 83000,
    seats: '10/0/0/0-10',
    seatsDuplicate: '10/0/0/0-10',
    pickup: '',
    departure: '',
    department: 'ЖД',
    guide: '',
    noQuota: 'var3',
    docs: '',
    pd: 'Нет',
    incomeChecked: 'Нет',
    costsChecked: 'Нет',
    clientDiscount: 0,
    agencyDiscount: 0,
    hours: '0',
    ignoreRemoved: 'Нет'
  },
  {
    id: 31327,
    tourNo: 1660,
    product: 'ЖД Россия',
    date: '31.10.2026',
    endDate: '07.11.2026',
    to: 'Владивосток Туроператор Пять звезд',
    operator: 'ЖД',
    days: '8',
    shortName: 'Владивосток',
    fullName: 'МорскаЯ',
    route: 'Владивосток - остров Русский - Сафари-парк - отдых ГК Теплое море',
    note: '',
    price: 84150,
    seats: '10/0/0/0-10',
    seatsDuplicate: '10/0/0/0-10',
    pickup: '',
    departure: '',
    department: 'ЖД',
    guide: '',
    noQuota: 'var3',
    docs: '',
    pd: 'Нет',
    incomeChecked: 'Нет',
    costsChecked: 'Нет',
    clientDiscount: 0,
    agencyDiscount: 0,
    hours: '0',
    ignoreRemoved: 'Нет'
  },
  {
    id: 31314,
    tourNo: 1471,
    product: 'ОДН авто',
    date: '23.05.2026',
    endDate: '23.05.2026',
    to: 'Вокруг света Москва',
    operator: 'Одн 1',
    days: '1',
    shortName: 'Королёв – Музей РКК «Энергия»',
    fullName: 'Космическая столица России. «Поехали!»',
    route: 'Королёв – Музей Ракетно-Космической Корпорации «Энергия»',
    note: '',
    price: 4570,
    seats: '35/0/0/0-35',
    seatsDuplicate: '35/0/0/0-35',
    pickup: 'м. ВДНХ',
    departure: '10:00',
    department: 'Одн 1',
    guide: 'Терновский Дмитрий Борисович НПД',
    noQuota: 'var5',
    docs: '',
    pd: 'Да',
    incomeChecked: 'Нет',
    costsChecked: 'Нет',
    clientDiscount: 10,
    agencyDiscount: 0,
    hours: '8',
    ignoreRemoved: 'Нет'
  }
]

const COLUMNS = [
  { key: 'id', title: '№ Ведомости', type: 'number', sortable: true, defaultWidth: 90 },
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
  { key: 'seats', title: 'Мест', type: 'string', sortable: true, defaultWidth: 135 },
  { key: 'seatsDuplicate', title: 'Мест', type: 'string', sortable: true, defaultWidth: 135 },
  { key: 'pickup', title: 'Место сбора (пункт)', type: 'string', sortable: true, defaultWidth: 160 },
  { key: 'departure', title: 'Время отпр.', type: 'string', sortable: true, defaultWidth: 100 },
  { key: 'guide', title: 'Гид', type: 'string', sortable: true, defaultWidth: 250 },
  { key: 'noQuota', title: 'Нет квот', type: 'string', sortable: true, defaultWidth: 120 },
  { key: 'docs', title: 'Документы', type: 'string', sortable: true, defaultWidth: 210 },
  { key: 'pd', title: 'ПД', type: 'string', sortable: true, defaultWidth: 60 },
  { key: 'incomeChecked', title: 'Приходы', type: 'string', sortable: true, defaultWidth: 105 },
  { key: 'costsChecked', title: 'Затраты', type: 'string', sortable: true, defaultWidth: 100 },
  { key: 'clientDiscount', title: 'Скидка кл.', type: 'number', sortable: true, defaultWidth: 90 },
  { key: 'agencyDiscount', title: 'Скидка аг.', type: 'number', sortable: true, defaultWidth: 90 },
  { key: 'hours', title: 'Часы', type: 'string', sortable: true, defaultWidth: 60 },
  { key: 'ignoreRemoved', title: 'Игн. снят', type: 'string', sortable: true, defaultWidth: 90 }
]

const EDIT_SECTIONS = [
  'Настройки',
  'Доп. услуги',
  'Проживание',
  'Заказы',
  'Лист ожидания',
  'Квоты',
  'Расходы',
  'Расходы выгрузки',
  'Документы'
]

function generateRows(total) {
  if (total <= BASE_ROWS.length) return BASE_ROWS.slice(0, total)

  return Array.from({ length: total }, (_, idx) => {
    const base = BASE_ROWS[idx % BASE_ROWS.length]
    const cycle = Math.floor(idx / BASE_ROWS.length)
    const [startDay = '01', startMonth = '01', startYear = '2026'] = String(base.date || '').split('.')
    const [endDay = '01', endMonth = '01', endYear = '2026'] = String(base.endDate || '').split('.')

    const shiftedStart = new Date(Number(startYear), Number(startMonth) - 1, Number(startDay) + cycle * 7)
    const shiftedEnd = new Date(Number(endYear), Number(endMonth) - 1, Number(endDay) + cycle * 7)

    const formatDate = (d) => `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`

    const seatsMatch = String(base.seats || '').match(/^(\d+)\/(\d+)\/(\d+)\/(\d+)-(\d+)$/)
    let seats = base.seats
    let seatsDuplicate = base.seatsDuplicate

    if (seatsMatch) {
      const free = Number(seatsMatch[1])
      const reserve = Number(seatsMatch[2])
      const paid = Number(seatsMatch[3])
      const quota = Number(seatsMatch[4])
      const totalSeats = Number(seatsMatch[5])
      const delta = cycle % 4
      const nextFree = Math.max(0, Math.min(totalSeats, free - delta + (idx % 3)))
      const nextPaid = Math.max(0, Math.min(totalSeats, paid + delta))
      seats = `${nextFree}/${reserve}/${nextPaid}/${quota}-${totalSeats}`
      seatsDuplicate = seats
    }

    const nextPrice = Number(base.price || 0) + cycle * 250 + (idx % 5) * 50
    const nextDeparture = base.departure
      ? `${String((Number(base.departure.split(':')[0] || 0) + cycle) % 24).padStart(2, '0')}:${String(base.departure.split(':')[1] || '00').padStart(2, '0')}`
      : ''

    return {
      ...base,
      id: base.id + cycle * 100000,
      tourNo: base.tourNo + cycle,
      date: formatDate(shiftedStart),
      endDate: formatDate(shiftedEnd),
      seats,
      seatsDuplicate,
      departure: nextDeparture,
      price: nextPrice,
      pd: cycle % 3 === 0 ? base.pd : (cycle % 2 === 0 ? 'Да' : 'Нет'),
      incomeChecked: cycle % 2 === 0 ? base.incomeChecked : 'Нет',
      costsChecked: cycle % 2 === 0 ? base.costsChecked : 'Нет'
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
  const allRows = useMemo(() => generateRows(320), [])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [softGridLines, setSoftGridLines] = useState(false)
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
  const [openToDropdown, setOpenToDropdown] = useState(false)
  const [selectedTos, setSelectedTos] = useState([])
  const [openProductDropdown, setOpenProductDropdown] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState([])
  const [openOperatorDropdown, setOpenOperatorDropdown] = useState(false)
  const [selectedOperators, setSelectedOperators] = useState([])
  const [openIncomeCheckedDropdown, setOpenIncomeCheckedDropdown] = useState(false)
  const [selectedIncomeChecked, setSelectedIncomeChecked] = useState([])
  const [openCostsCheckedDropdown, setOpenCostsCheckedDropdown] = useState(false)
  const [selectedCostsChecked, setSelectedCostsChecked] = useState([])
  const [openIgnoreRemovedDropdown, setOpenIgnoreRemovedDropdown] = useState(false)
  const [selectedIgnoreRemoved, setSelectedIgnoreRemoved] = useState([])
  const [floatingDropdownVersion, setFloatingDropdownVersion] = useState(0)
  const tableScrollRef = useRef(null)
  const headScrollRef = useRef(null)
  const dockScrollRef = useRef(null)
  const filterAnchorsRef = useRef({})

  const isColumnDropdownOpen = (colKey) =>
    openDatePicker === colKey ||
    (colKey === 'days' && openDaysDropdown) ||
    (colKey === 'to' && openToDropdown) ||
    (colKey === 'department' && openDepartmentDropdown) ||
    (colKey === 'product' && openProductDropdown) ||
    (colKey === 'operator' && openOperatorDropdown) ||
    (colKey === 'noQuota' && openNoQuotaDropdown) ||
    (colKey === 'departure' && openDepartureDropdown) ||
    (colKey === 'hours' && openHoursDropdown) ||
    (colKey === 'incomeChecked' && openIncomeCheckedDropdown) ||
    (colKey === 'costsChecked' && openCostsCheckedDropdown) ||
    (colKey === 'ignoreRemoved' && openIgnoreRemovedDropdown)

  const getFloatingDropdownStyle = (anchorKey, minWidth = 200) => {
    const anchor = filterAnchorsRef.current[anchorKey]
    if (!anchor) return undefined

    const rect = anchor.getBoundingClientRect()
    const versionOffset = floatingDropdownVersion * 0

    return {
      position: 'fixed',
      top: `${rect.bottom + 4 + versionOffset}px`,
      left: `${rect.left}px`,
      minWidth: `${Math.max(rect.width, minWidth)}px`,
      zIndex: 2000000
    }
  }

  useEffect(() => {
    const hasOpenDropdown = Boolean(
      openDatePicker ||
      openDaysDropdown ||
      openToDropdown ||
      openProductDropdown ||
      openOperatorDropdown ||
      openDepartmentDropdown ||
      openNoQuotaDropdown ||
      openDepartureDropdown ||
      openHoursDropdown ||
      openIncomeCheckedDropdown ||
      openCostsCheckedDropdown ||
      openIgnoreRemovedDropdown
    )

    if (!hasOpenDropdown || typeof window === 'undefined') return

    let rafId = 0

    const requestReposition = () => {
      if (rafId) return
      rafId = window.requestAnimationFrame(() => {
        rafId = 0
        setFloatingDropdownVersion((prev) => prev + 1)
      })
    }

    requestReposition()
    const tableEl = tableScrollRef.current
    const headEl = headScrollRef.current
    const dockEl = dockScrollRef.current

    window.addEventListener('scroll', requestReposition, true)
    window.addEventListener('resize', requestReposition)
    tableEl?.addEventListener('scroll', requestReposition)
    headEl?.addEventListener('scroll', requestReposition)
    dockEl?.addEventListener('scroll', requestReposition)

    return () => {
      window.removeEventListener('scroll', requestReposition, true)
      window.removeEventListener('resize', requestReposition)
      tableEl?.removeEventListener('scroll', requestReposition)
      headEl?.removeEventListener('scroll', requestReposition)
      dockEl?.removeEventListener('scroll', requestReposition)
      if (rafId) {
        window.cancelAnimationFrame(rafId)
      }
    }
  }, [openDatePicker, openDaysDropdown, openDepartmentDropdown, openNoQuotaDropdown, openDepartureDropdown, openHoursDropdown, openToDropdown, openProductDropdown, openOperatorDropdown, openIncomeCheckedDropdown, openCostsCheckedDropdown, openIgnoreRemovedDropdown])

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
    if (!openDepartmentDropdown && !openNoQuotaDropdown && !openDepartureDropdown && !openHoursDropdown && !openToDropdown && !openProductDropdown && !openOperatorDropdown && !openIncomeCheckedDropdown && !openCostsCheckedDropdown && !openIgnoreRemovedDropdown) return

    const handleClickOutside = (e) => {
      if (!e.target.closest('.ved-days-filter')) {
        setOpenDepartmentDropdown(false)
        setOpenNoQuotaDropdown(false)
        setOpenDepartureDropdown(false)
        setOpenHoursDropdown(false)
        setOpenToDropdown(false)
        setOpenProductDropdown(false)
        setOpenOperatorDropdown(false)
        setOpenIncomeCheckedDropdown(false)
        setOpenCostsCheckedDropdown(false)
        setOpenIgnoreRemovedDropdown(false)
      }
    }

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setOpenDepartmentDropdown(false)
        setOpenNoQuotaDropdown(false)
        setOpenDepartureDropdown(false)
        setOpenHoursDropdown(false)
        setOpenToDropdown(false)
        setOpenProductDropdown(false)
        setOpenOperatorDropdown(false)
        setOpenIncomeCheckedDropdown(false)
        setOpenCostsCheckedDropdown(false)
        setOpenIgnoreRemovedDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [openDepartmentDropdown, openNoQuotaDropdown, openDepartureDropdown, openHoursDropdown, openToDropdown, openProductDropdown, openOperatorDropdown, openIncomeCheckedDropdown, openCostsCheckedDropdown, openIgnoreRemovedDropdown])

  const yesNoOptions = useMemo(() => ['Да', 'Нет'], [])

  const uniqueProducts = useMemo(() => {
    const products = new Set()
    allRows.forEach(row => {
      if (row.product) products.add(row.product)
    })
    return Array.from(products).sort()
  }, [allRows])

  const uniqueOperators = useMemo(() => {
    const operators = new Set()
    allRows.forEach(row => {
      if (row.operator) operators.add(row.operator)
    })
    return Array.from(operators).sort()
  }, [allRows])

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

  const uniqueTos = useMemo(() => {
    const tos = new Set()
    allRows.forEach(row => {
      if (row.to) tos.add(row.to)
    })
    return Array.from(tos).sort()
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
        } else if (['to', 'product', 'operator', 'department', 'noQuota', 'departure', 'hours', 'incomeChecked', 'costsChecked', 'ignoreRemoved'].includes(key)) {
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
      version: 5, // Версия настроек для миграции
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

        const allColumnKeys = COLUMNS.map((c) => c.key)
        const placeSeatsDuplicateAfterSeats = (keys = []) => {
          const withoutDuplicate = keys.filter((key) => key !== 'seatsDuplicate')
          const seatsIndex = withoutDuplicate.indexOf('seats')
          if (seatsIndex === -1) return withoutDuplicate
          const nextKeys = [...withoutDuplicate]
          nextKeys.splice(seatsIndex + 1, 0, 'seatsDuplicate')
          return nextKeys
        }
        const normalizeOrder = (order = []) => {
          const valid = order.filter((key) => allColumnKeys.includes(key))
          const missing = allColumnKeys.filter((key) => !valid.includes(key))
          return placeSeatsDuplicateAfterSeats([...valid, ...missing])
        }
        const normalizeVisible = (visible = []) => {
          const valid = visible.filter((key) => allColumnKeys.includes(key))
          const missing = allColumnKeys.filter((key) => !valid.includes(key))
          return placeSeatsDuplicateAfterSeats([...valid, ...missing])
        }
        const normalizeWidths = (widths = {}) => {
          const defaults = Object.fromEntries(COLUMNS.map((c) => [c.key, c.defaultWidth]))
          return { ...defaults, ...widths }
        }
        const normalizeTitles = (titles = {}) => {
          const defaults = Object.fromEntries(COLUMNS.map((c) => [c.key, c.title]))
          const normalizedTitles = { ...defaults, ...titles }
          if (normalizedTitles.docs === 'Набор документов') {
            normalizedTitles.docs = 'Документы'
          }
          return normalizedTitles
        }
        
        // Версия настроек для миграции (добавлено 2026-02-17)
        const SETTINGS_VERSION = 5
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
          setColumnWidths(normalizeWidths(settings.columnWidths))
          setColumnTitles(normalizeTitles(settings.columnTitles))
        }
        
        setVisibleColumns(normalizeVisible(settings.visibleColumns))
        setColumnOrder(normalizeOrder(settings.columnOrder))
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

  function closeAllDropdowns(except = null) {
    if (except !== 'date') setOpenDatePicker(null)
    if (except !== 'days') setOpenDaysDropdown(false)
    if (except !== 'to') setOpenToDropdown(false)
    if (except !== 'product') setOpenProductDropdown(false)
    if (except !== 'operator') setOpenOperatorDropdown(false)
    if (except !== 'department') setOpenDepartmentDropdown(false)
    if (except !== 'noQuota') setOpenNoQuotaDropdown(false)
    if (except !== 'departure') setOpenDepartureDropdown(false)
    if (except !== 'hours') setOpenHoursDropdown(false)
    if (except !== 'incomeChecked') setOpenIncomeCheckedDropdown(false)
    if (except !== 'costsChecked') setOpenCostsCheckedDropdown(false)
    if (except !== 'ignoreRemoved') setOpenIgnoreRemovedDropdown(false)
  }

  function openDropdownOnly(dropdownKey) {
    closeAllDropdowns(dropdownKey)
    if (dropdownKey === 'days') setOpenDaysDropdown(true)
    if (dropdownKey === 'to') setOpenToDropdown(true)
    if (dropdownKey === 'product') setOpenProductDropdown(true)
    if (dropdownKey === 'operator') setOpenOperatorDropdown(true)
    if (dropdownKey === 'department') setOpenDepartmentDropdown(true)
    if (dropdownKey === 'noQuota') setOpenNoQuotaDropdown(true)
    if (dropdownKey === 'departure') setOpenDepartureDropdown(true)
    if (dropdownKey === 'hours') setOpenHoursDropdown(true)
    if (dropdownKey === 'incomeChecked') setOpenIncomeCheckedDropdown(true)
    if (dropdownKey === 'costsChecked') setOpenCostsCheckedDropdown(true)
    if (dropdownKey === 'ignoreRemoved') setOpenIgnoreRemovedDropdown(true)
  }

  function clearAllFilters() {
    setColumnFilters({})
    closeAllDropdowns()
    setSelectedDays([])
    setSelectedTos([])
    setSelectedProducts([])
    setSelectedOperators([])
    setSelectedDepartments([])
    setSelectedNoQuota([])
    setSelectedDepartures([])
    setSelectedHours([])
    setSelectedIncomeChecked([])
    setSelectedCostsChecked([])
    setSelectedIgnoreRemoved([])
  }

  function toggleDaysDropdown() {
    if (openDaysDropdown) {
      closeAllDropdowns()
    } else {
      openDropdownOnly('days')
    }
  }

  function toggleDropdownByKey(dropdownKey, isOpen) {
    if (isOpen) {
      closeAllDropdowns()
    } else {
      openDropdownOnly(dropdownKey)
    }
  }

  function toggleToSelection(toValue) {
    setSelectedTos(prev => {
      const newTos = prev.includes(toValue)
        ? prev.filter(t => t !== toValue)
        : [...prev, toValue]

      if (newTos.length > 0) {
        setColumnFilters(prev => ({
          ...prev,
          to: newTos.join('|')
        }))
      } else {
        setColumnFilters(prev => {
          const { to, ...rest } = prev
          return rest
        })
      }

      return newTos
    })
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

  function toggleProductSelection(product) {
    setSelectedProducts(prev => {
      const newProducts = prev.includes(product)
        ? prev.filter(p => p !== product)
        : [...prev, product]

      if (newProducts.length > 0) {
        setColumnFilters(prev => ({
          ...prev,
          product: newProducts.join('|')
        }))
      } else {
        setColumnFilters(prev => {
          const { product, ...rest } = prev
          return rest
        })
      }

      return newProducts
    })
  }

  function toggleOperatorSelection(operator) {
    setSelectedOperators(prev => {
      const newOperators = prev.includes(operator)
        ? prev.filter(o => o !== operator)
        : [...prev, operator]

      if (newOperators.length > 0) {
        setColumnFilters(prev => ({
          ...prev,
          operator: newOperators.join('|')
        }))
      } else {
        setColumnFilters(prev => {
          const { operator, ...rest } = prev
          return rest
        })
      }

      return newOperators
    })
  }

  function toggleIncomeCheckedSelection(status) {
    setSelectedIncomeChecked(prev => {
      const next = prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
      if (next.length > 0) {
        setColumnFilters(prev => ({ ...prev, incomeChecked: next.join('|') }))
      } else {
        setColumnFilters(prev => {
          const { incomeChecked, ...rest } = prev
          return rest
        })
      }
      return next
    })
  }

  function toggleCostsCheckedSelection(status) {
    setSelectedCostsChecked(prev => {
      const next = prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
      if (next.length > 0) {
        setColumnFilters(prev => ({ ...prev, costsChecked: next.join('|') }))
      } else {
        setColumnFilters(prev => {
          const { costsChecked, ...rest } = prev
          return rest
        })
      }
      return next
    })
  }

  function toggleIgnoreRemovedSelection(status) {
    setSelectedIgnoreRemoved(prev => {
      const next = prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
      if (next.length > 0) {
        setColumnFilters(prev => ({ ...prev, ignoreRemoved: next.join('|') }))
      } else {
        setColumnFilters(prev => {
          const { ignoreRemoved, ...rest } = prev
          return rest
        })
      }
      return next
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
          <Link href={`/vedomosti/${row.tourNo}`} style={{ color: 'inherit', textDecoration: 'none' }}>
            <span>{value}</span>
          </Link>
          <Link
            href={`/vedomosti/${row.tourNo}`}
            className="ved-edit-btn"
            title={`Открыть ведомость /vedomosti/${row.tourNo}`}
          >
            <Edit size={14} />
          </Link>
        </div>
      )
    }

    if (key === 'seats' || key === 'seatsDuplicate') {
      const seatSource = row.seats || row.seatsDuplicate || value
      if (!seatSource) return '—'
      const seatParts = String(seatSource).split('/')
      const seatFree = seatParts[0] || '0'
      const seatReserve = seatParts[1] || '0'
      const seatPaid = seatParts[2] || '0'
      const [seatQuota = '0', seatTotal = '0'] = String(seatParts[3] || '0-0').split('-')
      const seatBlocks = [seatFree, seatReserve, seatPaid, seatQuota, seatTotal]

      if (key === 'seatsDuplicate') {
        return (
          <div className="ved-seats-grid" title={String(seatSource)}>
            {seatBlocks.map((seatValue, index) => (
              <span key={`${seatValue}-${index}`} className={`ved-seats-grid-cell ved-seats-grid-cell--${index + 1}`}>
                {seatValue}
              </span>
            ))}
          </div>
        )
      }

      return (
        <div className="ved-seats-display" title={String(seatSource)}>
          <span className="ved-seats-circles">
            {seatBlocks.map((seatValue, index) => (
              <span key={`${seatValue}-${index}`} className={`ved-seat-circle ved-seat-circle--${index + 1}`}>
                {seatValue}
              </span>
            ))}
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
      return value || '—'
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
    closeAllDropdowns('date')
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
        <h1 className="ved-page-title">
          <Link href="/vedomosti" style={{ color: 'inherit', textDecoration: 'none' }}>
            Ведомости
          </Link>
        </h1>
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
            className={`ved-header-btn ${softGridLines ? 'ved-header-btn--active' : ''}`}
            onClick={() => setSoftGridLines((v) => !v)}
            title={softGridLines ? 'Акцентная сетка выключена' : 'Акцентная сетка включена'}
          >
            {softGridLines ? <EyeOff size={16} /> : <Eye size={16} />}
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
      <div className={`ved-table-wrap ${softGridLines ? 'ved-table-wrap--soft-lines' : ''}`}>
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
                    {(col.key === 'incomeChecked' || col.key === 'costsChecked') && (
                      <span className="ved-th-check-icon" aria-hidden="true">
                        <svg viewBox="0 0 16 16" fill="none">
                          <path d="M3 8.5L6.5 12L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    )}
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
                  className={`ved-filter-cell ${index === 0 ? 'ved-sticky ved-sticky-1' : ''} ${isColumnDropdownOpen(col.key) ? 'ved-filter-cell--open' : ''}`}
                  style={{
                    width: `${columnWidths[col.key] || col.defaultWidth}px`,
                    minWidth: `${columnWidths[col.key] || col.defaultWidth}px`
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {col.type === 'date' ? (
                    <div className="ved-date-filter" ref={(el) => { filterAnchorsRef.current[col.key] = el }}>
                      <input
                        type="text"
                        className="ved-filter-input"
                        placeholder="дд.мм.гггг - дд.мм.гггг"
                        value={columnFilters[col.key] || ''}
                        onFocus={() => openDateRangePicker(col.key)}
                        readOnly
                      />
                      {openDatePicker === col.key && (
                        <div className="ved-date-picker-dropdown ved-calendar-dropdown" style={getFloatingDropdownStyle(col.key, 252)}>
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
                    <div className="ved-days-filter" onClick={(e) => e.stopPropagation()} ref={(el) => { filterAnchorsRef.current.days = el }}>
                      <input
                        type="text"
                        className="ved-filter-input"
                        placeholder="Выберите дни..."
                        value={selectedDays.length > 0 ? `${selectedDays.length} выбрано` : ''}
                        onFocus={() => openDropdownOnly('days')}
                        readOnly
                      />
                      {openDaysDropdown && (
                        <div className="ved-days-dropdown ved-days-dropdown--compact" style={getFloatingDropdownStyle('days', 108)}>
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
                  ) : col.key === 'to' ? (
                    <div className="ved-days-filter" onClick={(e) => e.stopPropagation()} ref={(el) => { filterAnchorsRef.current.to = el }}>
                      <input
                        type="text"
                        className="ved-filter-input"
                        placeholder="Выберите ТО..."
                        value={selectedTos.length > 0 ? `${selectedTos.length} выбрано` : ''}
                        onFocus={() => openDropdownOnly('to')}
                        onClick={() => toggleDropdownByKey('to', openToDropdown)}
                        readOnly
                      />
                      {openToDropdown && (
                        <div className="ved-days-dropdown" style={getFloatingDropdownStyle('to', 220)}>
                          {uniqueTos.map(toValue => (
                            <label key={toValue} className="ved-days-option">
                              <input
                                type="checkbox"
                                checked={selectedTos.includes(toValue)}
                                onChange={() => toggleToSelection(toValue)}
                              />
                              <span>{toValue}</span>
                            </label>
                          ))}
                          <button type="button" className="ved-days-close" onClick={() => setOpenToDropdown(false)}>
                            Закрыть
                          </button>
                        </div>
                      )}
                    </div>
                  ) : col.key === 'product' ? (
                    <div className="ved-days-filter" onClick={(e) => e.stopPropagation()} ref={(el) => { filterAnchorsRef.current.product = el }}>
                      <input
                        type="text"
                        className="ved-filter-input"
                        placeholder="Выберите продукт..."
                        value={selectedProducts.length > 0 ? `${selectedProducts.length} выбрано` : ''}
                        onFocus={() => openDropdownOnly('product')}
                        readOnly
                      />
                      {openProductDropdown && (
                        <div className="ved-days-dropdown" style={getFloatingDropdownStyle('product', 200)}>
                          {uniqueProducts.map(product => (
                            <label key={product} className="ved-days-option">
                              <input
                                type="checkbox"
                                checked={selectedProducts.includes(product)}
                                onChange={() => toggleProductSelection(product)}
                              />
                              <span>{product}</span>
                            </label>
                          ))}
                          <button
                            type="button"
                            className="ved-days-close"
                            onClick={() => setOpenProductDropdown(false)}
                          >
                            Закрыть
                          </button>
                        </div>
                      )}
                    </div>
                  ) : col.key === 'operator' ? (
                    <div className="ved-days-filter" onClick={(e) => e.stopPropagation()} ref={(el) => { filterAnchorsRef.current.operator = el }}>
                      <input
                        type="text"
                        className="ved-filter-input"
                        placeholder="Выберите отдел..."
                        value={selectedOperators.length > 0 ? `${selectedOperators.length} выбрано` : ''}
                        onFocus={() => openDropdownOnly('operator')}
                        onClick={() => toggleDropdownByKey('operator', openOperatorDropdown)}
                        readOnly
                      />
                      {openOperatorDropdown && (
                        <div className="ved-days-dropdown" style={getFloatingDropdownStyle('operator', 200)}>
                          {uniqueOperators.map(operator => (
                            <label key={operator} className="ved-days-option">
                              <input
                                type="checkbox"
                                checked={selectedOperators.includes(operator)}
                                onChange={() => toggleOperatorSelection(operator)}
                              />
                              <span>{operator}</span>
                            </label>
                          ))}
                          <button
                            type="button"
                            className="ved-days-close"
                            onClick={() => setOpenOperatorDropdown(false)}
                          >
                            Закрыть
                          </button>
                        </div>
                      )}
                    </div>
                  ) : col.key === 'department' ? (
                    <div className="ved-days-filter" onClick={(e) => e.stopPropagation()} ref={(el) => { filterAnchorsRef.current.department = el }}>
                      <input
                        type="text"
                        className="ved-filter-input"
                        placeholder="Выберите отделы..."
                        value={selectedDepartments.length > 0 ? `${selectedDepartments.length} выбрано` : ''}
                        onFocus={() => openDropdownOnly('department')}
                        readOnly
                      />
                      {openDepartmentDropdown && (
                        <div className="ved-days-dropdown" style={getFloatingDropdownStyle('department', 200)}>
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
                    <div className="ved-days-filter" onClick={(e) => e.stopPropagation()} ref={(el) => { filterAnchorsRef.current.noQuota = el }}>
                      <input
                        type="text"
                        className="ved-filter-input"
                        placeholder="Выберите квот..."
                        value={selectedNoQuota.length > 0 ? `${selectedNoQuota.length} выбрано` : ''}
                        onFocus={() => openDropdownOnly('noQuota')}
                        readOnly
                      />
                      {openNoQuotaDropdown && (
                        <div className="ved-days-dropdown" style={getFloatingDropdownStyle('noQuota', 200)}>
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
                    <div className="ved-days-filter" onClick={(e) => e.stopPropagation()} ref={(el) => { filterAnchorsRef.current.departure = el }}>
                      <input
                        type="text"
                        className="ved-filter-input"
                        placeholder="Выберите время..."
                        value={selectedDepartures.length > 0 ? `${selectedDepartures.length} выбрано` : ''}
                        onFocus={() => openDropdownOnly('departure')}
                        readOnly
                      />
                      {openDepartureDropdown && (
                        <div className="ved-days-dropdown" style={getFloatingDropdownStyle('departure', 200)}>
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
                  ) : col.key === 'incomeChecked' ? (
                    <div className="ved-days-filter" onClick={(e) => e.stopPropagation()} ref={(el) => { filterAnchorsRef.current.incomeChecked = el }}>
                      <input
                        type="text"
                        className="ved-filter-input"
                        placeholder="Да / Нет"
                        value={selectedIncomeChecked.length > 0 ? selectedIncomeChecked.join(', ') : ''}
                        onFocus={() => openDropdownOnly('incomeChecked')}
                        readOnly
                      />
                      {openIncomeCheckedDropdown && (
                        <div className="ved-days-dropdown" style={getFloatingDropdownStyle('incomeChecked', 150)}>
                          {yesNoOptions.map(status => (
                            <label key={status} className="ved-days-option">
                              <input
                                type="checkbox"
                                checked={selectedIncomeChecked.includes(status)}
                                onChange={() => toggleIncomeCheckedSelection(status)}
                              />
                              <span>{status}</span>
                            </label>
                          ))}
                          <button type="button" className="ved-days-close" onClick={() => setOpenIncomeCheckedDropdown(false)}>
                            Закрыть
                          </button>
                        </div>
                      )}
                    </div>
                  ) : col.key === 'costsChecked' ? (
                    <div className="ved-days-filter" onClick={(e) => e.stopPropagation()} ref={(el) => { filterAnchorsRef.current.costsChecked = el }}>
                      <input
                        type="text"
                        className="ved-filter-input"
                        placeholder="Да / Нет"
                        value={selectedCostsChecked.length > 0 ? selectedCostsChecked.join(', ') : ''}
                        onFocus={() => openDropdownOnly('costsChecked')}
                        readOnly
                      />
                      {openCostsCheckedDropdown && (
                        <div className="ved-days-dropdown" style={getFloatingDropdownStyle('costsChecked', 150)}>
                          {yesNoOptions.map(status => (
                            <label key={status} className="ved-days-option">
                              <input
                                type="checkbox"
                                checked={selectedCostsChecked.includes(status)}
                                onChange={() => toggleCostsCheckedSelection(status)}
                              />
                              <span>{status}</span>
                            </label>
                          ))}
                          <button type="button" className="ved-days-close" onClick={() => setOpenCostsCheckedDropdown(false)}>
                            Закрыть
                          </button>
                        </div>
                      )}
                    </div>
                  ) : col.key === 'ignoreRemoved' ? (
                    <div className="ved-days-filter" onClick={(e) => e.stopPropagation()} ref={(el) => { filterAnchorsRef.current.ignoreRemoved = el }}>
                      <input
                        type="text"
                        className="ved-filter-input"
                        placeholder="Да / Нет"
                        value={selectedIgnoreRemoved.length > 0 ? selectedIgnoreRemoved.join(', ') : ''}
                        onFocus={() => openDropdownOnly('ignoreRemoved')}
                        readOnly
                      />
                      {openIgnoreRemovedDropdown && (
                        <div className="ved-days-dropdown" style={getFloatingDropdownStyle('ignoreRemoved', 150)}>
                          {yesNoOptions.map(status => (
                            <label key={status} className="ved-days-option">
                              <input
                                type="checkbox"
                                checked={selectedIgnoreRemoved.includes(status)}
                                onChange={() => toggleIgnoreRemovedSelection(status)}
                              />
                              <span>{status}</span>
                            </label>
                          ))}
                          <button type="button" className="ved-days-close" onClick={() => setOpenIgnoreRemovedDropdown(false)}>
                            Закрыть
                          </button>
                        </div>
                      )}
                    </div>
                  ) : col.key === 'hours' ? (
                    <div className="ved-days-filter" onClick={(e) => e.stopPropagation()} ref={(el) => { filterAnchorsRef.current.hours = el }}>
                      <input
                        type="text"
                        className="ved-filter-input"
                        placeholder="Выберите часы..."
                        value={selectedHours.length > 0 ? `${selectedHours.length} выбрано` : ''}
                        onFocus={() => openDropdownOnly('hours')}
                        readOnly
                      />
                      {openHoursDropdown && (
                        <div className="ved-days-dropdown" style={getFloatingDropdownStyle('hours', 200)}>
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

function VedomostEditPage() {
  const [activeSection, setActiveSection] = useState('Настройки')

  return (
    <section className="ved-page ved-edit-page">
      <div className="ved-sticky-header ved-sticky-header--in-table">
        <div className="ved-head">
          <h1>Зона заголовка</h1>
        </div>
        <span className="ved-head-chip">Редактирование ведомости</span>
      </div>

      <div className="ved-page-header">
        <div className="ved-header-spacer" />
        <h1 className="ved-page-title">Ведомость редактирование</h1>
        <div className="ved-header-spacer" />
      </div>

      <div className="ved-edit-tabs" role="tablist" aria-label="Разделы редактирования ведомости">
        {EDIT_SECTIONS.map((section) => (
          <button
            key={section}
            type="button"
            role="tab"
            aria-selected={activeSection === section}
            className={`ved-edit-tab ${activeSection === section ? 'is-active' : ''}`}
            onClick={() => setActiveSection(section)}
          >
            {section}
          </button>
        ))}
      </div>

      <div className="ved-edit-content">
        {activeSection === 'Настройки' ? (
          <div className="ved-edit-form">
            <label className="ved-edit-field">
              <span>№ Ведомости</span>
              <input defaultValue="31412" />
            </label>
            <label className="ved-edit-field">
              <span>№ Тура</span>
              <input defaultValue="1711" />
            </label>
            <label className="ved-edit-field">
              <span>Продукт</span>
              <input defaultValue="ЖД Россия" />
            </label>
            <label className="ved-edit-field">
              <span>TO</span>
              <input defaultValue="Волгоград И-Волга" />
            </label>
            <label className="ved-edit-field">
              <span>Отдел</span>
              <input defaultValue="ЖД" />
            </label>
            <label className="ved-edit-field">
              <span>Дн.</span>
              <input defaultValue="7" />
            </label>
            <label className="ved-edit-field">
              <span>Дата начала</span>
              <input defaultValue="04.09.2026" />
            </label>
            <label className="ved-edit-field">
              <span>Дата конца</span>
              <input defaultValue="10.09.2026" />
            </label>
            <label className="ved-edit-field ved-edit-field--wide">
              <span>Краткое название</span>
              <input defaultValue="Волгоград" />
            </label>
            <label className="ved-edit-field ved-edit-field--wide">
              <span>Название</span>
              <input defaultValue="Наследники великой степи" />
            </label>
            <label className="ved-edit-field ved-edit-field--wide">
              <span>Маршрут</span>
              <textarea defaultValue="Волгоград - Старая Сарепта - оз. Баскунчак - Астрахань - Осетровая ферма - Лотосовые поля - Элиста" rows={3} />
            </label>
            <label className="ved-edit-field">
              <span>Цена</span>
              <input defaultValue="70100" />
            </label>
            <label className="ved-edit-field">
              <span>Мест</span>
              <input defaultValue="10/0/0/0-10" />
            </label>
            <label className="ved-edit-field">
              <span>ПД</span>
              <input defaultValue="Нет" />
            </label>
            <label className="ved-edit-field">
              <span>Документы</span>
              <input defaultValue="" placeholder="—" />
            </label>
          </div>
        ) : (
          <div className="ved-edit-soon">Раздел «{activeSection}» пока не реализован.</div>
        )}
      </div>
    </section>
  )
}

export default function Home() {
  const router = useRouter()
  const [activeView, setActiveView] = useState(() => (router.pathname === '/vedomosti' ? 'vedomosti' : 'home'))
  const [activeSelection, setActiveSelection] = useState(() => (
    router.pathname === '/vedomosti'
      ? { sectionKey: 'tours', itemLabel: 'Ведомости' }
      : { sectionKey: null, itemLabel: null }
  ))
  const [theme, setTheme] = useState('light')
  const [settingsOpener, setSettingsOpener] = useState(null)

  useEffect(() => {
    if (!router.isReady) return

    if (router.pathname === '/vedomosti') {
      setActiveView('vedomosti')
      setActiveSelection({ sectionKey: 'tours', itemLabel: 'Ведомости' })
      return
    }

    if (router.pathname === '/') {
      setActiveView('home')
      setActiveSelection({ sectionKey: null, itemLabel: null })
    }
  }, [router.isReady, router.pathname])

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
      if (router.pathname !== '/vedomosti') {
        router.push('/vedomosti')
      }
      return
    }
    if (itemLabel === 'Ведомости ред.') {
      setActiveView('vedomosti-edit')
      return
    }
    setActiveView('home')
    if (router.pathname !== '/') {
      router.push('/')
    }
  }

  function handleLogout() {
    setActiveView('home')
    setActiveSelection({ sectionKey: null, itemLabel: null })
    if (router.pathname !== '/') {
      router.push('/')
    }
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
        ) : activeView === 'vedomosti-edit' ? (
          <VedomostEditPage />
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
