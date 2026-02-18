import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, ChevronDown } from 'lucide-react'
import BottomBar from '../../components/BottomBar'

const EDIT_SECTIONS = [
  'Настройки',
  'Доп. услуги',
  'Проживание',
  'Заказы',
  'Лист ожидания',
  'Квоты',
  'Расходы',
  'Выгрузки',
  'Документы'
]

function GlassSelect({ label, value, options, onChange, className = '' }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (!rootRef.current) return
      if (!rootRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={`${className} ved-glass-select`} ref={rootRef}>
      <span>{label}</span>
      <button
        type="button"
        className={`ved-glass-select-trigger ${open ? 'is-open' : ''}`}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="ved-glass-select-value">{value || 'Выберите...'}</span>
        <span className="ved-glass-select-chevron" aria-hidden="true"><ChevronDown size={16} /></span>
      </button>

      {open ? (
        <div className="ved-glass-select-menu">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              className={`ved-glass-select-option ${option === value ? 'is-active' : ''}`}
              onClick={() => {
                onChange(option)
                setOpen(false)
              }}
            >
              {option}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default function VedomostEditByIdPage() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState('Настройки')
  const [theme, setTheme] = useState('light')
  const tabsRef = useRef(null)
  const [selectValues, setSelectValues] = useState({
    docsPack: '3 Договор реализации турпродукта Россия (ВС- Агент)',
    busType: 'без схемы',
    customerTemplate: 'Электронная путевка',
    touristTemplate: 'ЭП российский паспорт',
    customerPerson: 'ВС',
    customerCompany: 'ВС',
    vat: 'Без НДС',
    tourRemoved: 'Активен',
    holiday: '',
    transport: ''
  })

  const tourNo = useMemo(() => {
    const raw = router.query.id
    if (Array.isArray(raw)) return raw[0] || ''
    return raw || ''
  }, [router.query.id])

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

  useEffect(() => {
    if (!tabsRef.current) return
    
    function updateIndicatorPosition() {
      if (!tabsRef.current) return
      const container = tabsRef.current
      const activeIndex = EDIT_SECTIONS.indexOf(activeSection)
      const activeLabel = container.querySelectorAll('.ved-edit-tabs__item')[activeIndex]
      if (!activeLabel) return

      const listRect = container.querySelector('.ved-edit-tabs__list').getBoundingClientRect()
      const labelRect = activeLabel.getBoundingClientRect()
      const left = labelRect.left - listRect.left
      const top = labelRect.top - listRect.top
      const width = labelRect.width
      const height = labelRect.height

      container.style.setProperty('--active-left', `${left}px`)
      container.style.setProperty('--active-top', `${top}px`)
      container.style.setProperty('--active-width', `${width}px`)
      container.style.setProperty('--active-height', `${height}px`)
    }
    
    updateIndicatorPosition()
    requestAnimationFrame(updateIndicatorPosition)
    
    // Update on window resize
    window.addEventListener('resize', updateIndicatorPosition)

    const tabsList = tabsRef.current.querySelector('.ved-edit-tabs__list')
    let observer = null
    if (typeof ResizeObserver !== 'undefined' && tabsList) {
      observer = new ResizeObserver(() => {
        updateIndicatorPosition()
      })
      observer.observe(tabsList)
    }
    
    // Prevent auto-scroll when switching tabs
    if (typeof window !== 'undefined' && window.history.scrollRestoration) {
      window.history.scrollRestoration = 'manual'
    }
    
    return () => {
      window.removeEventListener('resize', updateIndicatorPosition)
      if (observer) {
        observer.disconnect()
      }
    }
  }, [activeSection])

  function handleSelectItem({ itemLabel }) {
    if (itemLabel === 'Ведомости') {
      router.push('/vedomosti')
      return
    }

    if (itemLabel === 'Ведомости ред.') {
      if (tourNo) {
        router.push(`/vedomosti/${tourNo}`)
      }
      return
    }

    router.push('/')
  }

  function handleLogout() {
    router.push('/')
  }

  function setSelectValue(key, value) {
    setSelectValues((prev) => ({ ...prev, [key]: value }))
  }

  function handleSectionChange(section) {
    const scrollY = window.scrollY
    setActiveSection(section)
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollY)
    })
  }

  return (
    <>
      <Head>
        <title>Ведомость {tourNo ? `#${tourNo}` : ''} — редактирование</title>
      </Head>

      <main className="page">
        <section className="ved-page ved-edit-page">
          <div className="ved-page-header">
            <div className="ved-header-search" style={{ display: 'flex', alignItems: 'center' }}>
              <Link href="/vedomosti" className="ved-edit-back-btn" title="Назад к таблице" style={{ textDecoration: 'none' }}>
                <ArrowLeft size={16} />
                <span>Назад</span>
              </Link>
            </div>
            <div className="ved-page-title-wrapper">
              <div className="ved-page-title-block">
                <h1 className="ved-page-title">«Степной бриз» №1</h1>
                <div className="ved-page-subtitle">Волгоград И-Волга</div>
              </div>
              <GlassSelect
                className={`ved-edit-field ved-page-status-select ${selectValues.tourRemoved === 'Активен' ? 'ved-summary-status-select--active' : 'ved-summary-status-select--removed'}`}
                value={selectValues.tourRemoved}
                options={['Активен', 'Снят']}
                onChange={(value) => setSelectValue('tourRemoved', value)}
              />
            </div>
            <div className="ved-header-spacer" />
          </div>

          <div className="ved-summary-card">
            <div className="ved-summary-info">
              <div className="ved-summary-header">
                <div className="ved-summary-title">Ведомость 31419</div>
                <div className="ved-summary-date">04.09.2026 - 09.09.2026</div>
              </div>
              <div className="ved-summary-route">Волгоград - Сарепта - оз. Баскунчак - Астрахань - Осетровая ферма - Лотосовые поля</div>
              <div className="ved-summary-access">Захарова Ирина Викторовна, Фирсанова Елена Евгеньевна, Паначёва Вика Владимировна</div>
              
              <div className="ved-summary-publish">
                <div className="ved-summary-publish-title">Опубликовать</div>
                <div className="ved-summary-publish-grid">
                  <div className="ved-toggle-wrapper ved-toggle-wrapper--bordered">
                    <input type="checkbox" id="switch-vstravel" />
                    <label htmlFor="switch-vstravel"></label>
                    <span className="ved-toggle-label">vs-travel</span>
                  </div>
                  <div className="ved-toggle-wrapper ved-toggle-wrapper--bordered">
                    <input type="checkbox" id="switch-vsoperator" />
                    <label htmlFor="switch-vsoperator"></label>
                    <span className="ved-toggle-label">vs-operator</span>
                  </div>
                  <div className="ved-toggle-wrapper ved-toggle-wrapper--bordered">
                    <input type="checkbox" id="switch-online" />
                    <label htmlFor="switch-online"></label>
                    <span className="ved-toggle-label">online магазин</span>
                  </div>
                  <div className="ved-toggle-wrapper ved-toggle-wrapper--bordered">
                    <input type="checkbox" id="switch-lkagent" />
                    <label htmlFor="switch-lkagent"></label>
                    <span className="ved-toggle-label">ЛК агента</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="ved-summary-people">
              <div className="ved-summary-counts">
                <div><span>Взрослых</span><b>0</b></div>
                <div><span>Детей</span><b>0</b></div>
                <div><span>Пенсионеров</span><b>0</b></div>
              </div>

              <div className="ved-summary-seats">
              <div className="ved-seats-card ved-seats-card--free">
                <div className="ved-seats-card-value">10</div>
                <div className="ved-seats-card-label">Свободные</div>
              </div>
              <div className="ved-seats-card ved-seats-card--quota">
                <div className="ved-seats-card-value">0</div>
                <div className="ved-seats-card-label">Квоты</div>
              </div>
              <div className="ved-seats-card ved-seats-card--booking">
                <div className="ved-seats-card-value">0</div>
                <div className="ved-seats-card-label">Брони</div>
              </div>
              <div className="ved-seats-card ved-seats-card--active">
                <div className="ved-seats-card-value">0</div>
                <div className="ved-seats-card-label">Активные</div>
              </div>
                <div className="ved-seats-card ved-seats-card--total">
                  <div className="ved-seats-card-value">10</div>
                  <div className="ved-seats-card-label">Всего</div>
                </div>
              </div>
              
              <div className="ved-summary-price">Минимальная цена: <strong>59 500 ₽</strong></div>
            </div>
          </div>

          <fieldset className="ved-edit-tabs" ref={tabsRef}>
            <legend className="ved-visually-hidden">Разделы редактирования ведомости</legend>
            <div className="ved-edit-tabs__list">
              {EDIT_SECTIONS.map((section) => (
                <label key={section} className="ved-edit-tabs__item">
                  <input
                    type="radio"
                    name="ved-section"
                    value={section}
                    checked={activeSection === section}
                    onChange={() => handleSectionChange(section)}
                    className="ved-visually-hidden"
                  />
                  <span className="ved-edit-tabs__label">{section}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="ved-edit-content">
            {activeSection === 'Настройки' ? (
              <div className="ved-edit-form">
                <div className="ved-edit-section-title">Основные</div>

                <div className="ved-edit-inline-row ved-edit-inline-row--nomenclature">
                  <label className="ved-edit-field ved-edit-field--nomenclature">
                    <span>Номенклатура 1C</span>
                    <input defaultValue="26/09/04-10 Степной бриз/ЖД Россия/ТА/1432/31420/1" maxLength="65" />
                  </label>

                  <div className="ved-toggle-wrapper">
                    <input type="checkbox" id="switch-1c" defaultChecked />
                    <label htmlFor="switch-1c"></label>
                    <span className="ved-toggle-label">Выгружено в 1с</span>
                  </div>
                </div>

                <div className="ved-edit-inline-row ved-edit-inline-row--top">
                  <label className="ved-edit-field ved-edit-field--compact">
                    <span>Дата начала тура</span>
                    <input type="date" defaultValue="2026-09-04" />
                  </label>

                  <label className="ved-edit-field ved-edit-field--compact">
                    <span>Дата конца тура</span>
                    <input type="date" defaultValue="2026-09-10" />
                  </label>

                  <GlassSelect
                    className="ved-edit-field ved-edit-field--compact"
                    label="Праздник"
                    value={selectValues.holiday}
                    options={['', 'Майские', 'Июньские', 'Масленица', 'Новый год', 'Рождество', 'Ноябрьские']}
                    onChange={(value) => setSelectValue('holiday', value)}
                  />

                  <div className="ved-toggle-wrapper">
                    <input type="checkbox" id="switch-sksh" defaultChecked />
                    <label htmlFor="switch-sksh"></label>
                    <span className="ved-toggle-label">С/К/Ш</span>
                  </div>
                  <div className="ved-toggle-wrapper">
                    <input type="checkbox" id="switch-usual" defaultChecked />
                    <label htmlFor="switch-usual"></label>
                    <span className="ved-toggle-label">Обычные</span>
                  </div>
                </div>

                <div className="ved-edit-inline-row ved-edit-inline-row--compact-all">
                  <GlassSelect
                    className="ved-edit-field ved-edit-field--compact-docs"
                    label="Набор документов"
                    value={selectValues.docsPack}
                    options={['3 Договор реализации турпродукта Россия (ВС- Агент)']}
                    onChange={(value) => setSelectValue('docsPack', value)}
                  />

                  <label className="ved-edit-field ved-edit-field--compact-note">
                    <span>На заметку</span>
                    <input defaultValue="Матрешка" />
                  </label>

                  <label className="ved-edit-field ved-edit-field--compact-guide">
                    <span>Экскурсовод</span>
                    <input defaultValue="" placeholder="Введите ФИО" />
                  </label>

                  <GlassSelect
                    className="ved-edit-field ved-edit-field--compact-transport"
                    label="Транспорт"
                    value={selectValues.transport}
                    options={['', 'ИП Иванов А.С.', 'ИП Петров В.Д.', 'ИП Сидоров М.К.', 'ИП Козлова Е.И.', 'ИП Морозов Н.П.']}
                    onChange={(value) => setSelectValue('transport', value)}
                  />
                </div>

                <div className="ved-edit-section-row">
                  <div className="ved-edit-section-block">
                    <div className="ved-edit-section-title ved-edit-section-title--sub">Автобусы</div>

                    <div className="ved-edit-inline-row ved-edit-inline-row--bus-compact">
                      <GlassSelect
                        className="ved-edit-field ved-edit-field--bus-type-compact"
                        label="Тип автобуса"
                        value={selectValues.busType}
                        options={['без схемы', 'схема 2+2', 'схема 2+1']}
                        onChange={(value) => setSelectValue('busType', value)}
                      />

                      <label className="ved-edit-field ved-edit-field--bus-seats-compact">
                        <span>Мест к продаже</span>
                        <input type="number" defaultValue="10" />
                      </label>

                      <label className="ved-edit-field ved-edit-field--bus-service-compact">
                        <span>Услуги по перевозке</span>
                        <input defaultValue="Без мест в автобусе" />
                      </label>
                    </div>
                  </div>

                  <div className="ved-edit-section-block">
                    <div className="ved-edit-section-title ved-edit-section-title--sub">Шаблоны данных</div>

                    <div className="ved-edit-inline-row ved-edit-inline-row--templates">
                      <GlassSelect
                        className="ved-edit-field ved-edit-field--template-compact"
                        label="Шаблон данных заказчика"
                        value={selectValues.customerTemplate}
                        options={['Электронная путевка']}
                        onChange={(value) => setSelectValue('customerTemplate', value)}
                      />

                      <GlassSelect
                        className="ved-edit-field ved-edit-field--template-compact"
                        label="Шаблон данных туриста"
                        value={selectValues.touristTemplate}
                        options={['ЭП российский паспорт']}
                        onChange={(value) => setSelectValue('touristTemplate', value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="ved-edit-section-title">Данные в путевку</div>

                <div className="ved-edit-inline-row ved-edit-inline-row--voucher-all">
                  <label className="ved-edit-field ved-edit-field--voucher-compact">
                    <span>Программа в путёвку</span>
                    <input defaultValue="согласно программе" />
                  </label>

                  <label className="ved-edit-field ved-edit-field--voucher-compact">
                    <span>Питание</span>
                    <input defaultValue="по программе" />
                  </label>

                  <label className="ved-edit-field ved-edit-field--voucher-compact">
                    <span>Добровольное страхование в пакете</span>
                    <input defaultValue="нет, действует ОМС" />
                  </label>

                  <label className="ved-edit-field ved-edit-field--voucher-compact">
                    <span>Виза</span>
                    <input defaultValue="" />
                  </label>

                  <label className="ved-edit-field ved-edit-field--voucher-compact">
                    <span>Трансфер</span>
                    <input defaultValue="по программе" />
                  </label>
                </div>

                <div className="ved-edit-section-row">
                  <label className="ved-edit-field ved-edit-field--textarea-half">
                    <span>важная информация в путевку</span>
                    <textarea rows={3} defaultValue="время встречи: 09:00место встречи: на Привокзальной площади ЖД Вокзала у фонтана «Детский хоровод»табличка: «Степной бриз»" />
                  </label>

                  <label className="ved-edit-field ved-edit-field--textarea-half">
                    <span>общая информация в путевку</span>
                    <textarea rows={3} defaultValue="телефон для экстренной связи
принимающая сторона: сообщается за 2-3 дня до заездаотправляющая сторона (Москва): +7-985-308-35-25 Елена; +7-916-208-20-58 Ирина" />
                  </label>
                </div>

                <div className="ved-edit-section-row">
                  <div className="ved-edit-section-block">
                    <div className="ved-edit-section-title ved-edit-section-title--sub">Сбор группы</div>

                    <div className="ved-edit-inline-row ved-edit-inline-row--collect-compact">
                      <label className="ved-edit-field ved-edit-field--time-compact">
                        <span>Время сбора</span>
                        <input type="time" defaultValue="09:00" placeholder="Выберите время..." />
                      </label>

                      <label className="ved-edit-field ved-edit-field--time-compact">
                        <span>Оттправление</span>
                        <input type="time" defaultValue="09:30" placeholder="Выберите время..." />
                      </label>

                      <label className="ved-edit-field ved-edit-field--collect-point">
                        <span>Место сбора (пункт)</span>
                        <input defaultValue="" />
                      </label>
                    </div>

                    <label className="ved-edit-field ved-edit-field--collect-desc">
                      <span>Место сбора (описание)</span>
                      <textarea rows={2} defaultValue="<p>Встреча в 09:00 на Привокзальной площади ЖД Вокзала у фонтана «Детский хоровод», табличка «Степной бриз».</p>" />
                    </label>
                  </div>

                  <div className="ved-edit-section-block">
                    <div className="ved-edit-section-title ved-edit-section-title--sub">Сроки брони/продаж</div>

                    <div className="ved-edit-inline-row ved-edit-inline-row--datetime-compact">
                      <label className="ved-edit-field ved-edit-field--datetime-compact">
                        <span>Время завершения<br />онлайн продаж</span>
                        <input type="datetime-local" defaultValue="2026-09-02T00:00" />
                      </label>

                      <label className="ved-edit-field ved-edit-field--datetime-compact">
                        <span>Время завершения бронирования<br />в ЛК Агент</span>
                        <input type="datetime-local" defaultValue="2026-09-02T00:00" />
                      </label>
                    </div>

                    <label className="ved-edit-field ved-edit-field--maxterm-compact">
                      <span>Максимальный срок бронирования в ЛК Агент</span>
                      <input defaultValue="" />
                    </label>

                    <label className="ved-edit-field ved-edit-field--note-compact">
                      <span>Примечание</span>
                      <textarea rows={2} defaultValue="" />
                    </label>
                  </div>
                </div>

                <div className="ved-edit-section-title">Скидки</div>

                <div className="ved-discounts-grid">
                  <label className="ved-discount-item"><span>Cкидка (по статусам/базовая)</span><input className="ved-discount-input" defaultValue="" /></label>
                  <label className="ved-discount-item"><span>Скидка заказчика серебро</span><input className="ved-discount-input" defaultValue="" /></label>
                  <label className="ved-discount-item"><span>Скидка заказчика золото</span><input className="ved-discount-input" defaultValue="" /></label>
                  <label className="ved-discount-item"><span>Скидка заказчика платина</span><input className="ved-discount-input" defaultValue="" /></label>
                  <label className="ved-discount-item"><span>Максимальная скидка заказчику</span><input className="ved-discount-input" type="number" defaultValue="12" /></label>
                  <label className="ved-discount-item"><span>Скидка агентства серебро</span><input className="ved-discount-input" defaultValue="" /></label>
                  <label className="ved-discount-item"><span>Скидка агентства золото</span><input className="ved-discount-input" defaultValue="" /></label>
                  <label className="ved-discount-item"><span>Скидка агентства платина</span><input className="ved-discount-input" defaultValue="" /></label>
                  <label className="ved-discount-item"><span>Максимальная скидка агентству</span><input className="ved-discount-input" type="number" defaultValue="10" /></label>
                  <label className="ved-discount-item"><span>Скидка детям</span><input className="ved-discount-input" type="number" defaultValue="100" /></label>
                  <label className="ved-discount-item"><span>Скидка пенсионерам</span><input className="ved-discount-input" type="number" defaultValue="100" /></label>
                </div>

                <div className="ved-edit-section-title">Продажи</div>

                <div className="ved-sales-grid">
                  <GlassSelect
                    className="ved-edit-field ved-sales-field"
                    label="Заказчик (физ.лицо)"
                    value={selectValues.customerPerson}
                    options={['ВС', 'Агент', 'ТО']}
                    onChange={(value) => setSelectValue('customerPerson', value)}
                  />
                  <GlassSelect
                    className="ved-edit-field ved-sales-field"
                    label="Заказчик (юр.лицо) и Агентство"
                    value={selectValues.customerCompany}
                    options={['ВС', 'Агентство', 'Корпоративный']}
                    onChange={(value) => setSelectValue('customerCompany', value)}
                  />
                  <GlassSelect
                    className="ved-edit-field ved-sales-field"
                    label="НДС"
                    value={selectValues.vat}
                    options={['Без НДС', '20%', '10%']}
                    onChange={(value) => setSelectValue('vat', value)}
                  />
                  <label className="ved-edit-field ved-sales-field"><span>Признак агента</span><input defaultValue="" /></label>
                  <label className="ved-edit-field ved-sales-field ved-sales-field--wide">
                    <span>Код освобождения от НДС</span>
                    <input defaultValue="1011225" />
                  </label>
                </div>

                <div className="ved-edit-inline-row ved-edit-inline-row--ignore">
                  <div className="ved-toggle-wrapper">
                    <input type="checkbox" id="switch-nomest" />
                    <label htmlFor="switch-nomest"></label>
                    <span className="ved-toggle-label">Игнорировать нет мест</span>
                  </div>
                  <div className="ved-toggle-wrapper">
                    <input type="checkbox" id="switch-nonomer" />
                    <label htmlFor="switch-nonomer"></label>
                    <span className="ved-toggle-label">Игнорировать нет номеров</span>
                  </div>
                  <div className="ved-toggle-wrapper">
                    <input type="checkbox" id="switch-noquota" />
                    <label htmlFor="switch-noquota"></label>
                    <span className="ved-toggle-label">Игнорировать нет квот</span>
                  </div>
                  <div className="ved-toggle-wrapper">
                    <input type="checkbox" id="switch-noremoved" />
                    <label htmlFor="switch-noremoved"></label>
                    <span className="ved-toggle-label">Игнорировать Тур снят</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="ved-edit-soon">Раздел «{activeSection}» пока не реализован.</div>
            )}
          </div>
        </section>
      </main>

      <BottomBar
        onSelectItem={handleSelectItem}
        activeSelection={{ sectionKey: 'tours', itemLabel: 'Ведомости ред.' }}
        theme={theme}
        onThemeChange={setTheme}
        onLogout={handleLogout}
        showColumnsSettings={false}
      />
    </>
  )
}
