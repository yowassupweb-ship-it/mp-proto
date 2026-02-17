import { useEffect, useRef, useState } from 'react'
import { BookOpen, CircleUserRound, Download, Map, Users, Settings2 } from 'lucide-react'

function SectionIcon({ name }) {
  const props = { size: 16, strokeWidth: 1.8, 'aria-hidden': true }

  if (name === 'tours') return <Map {...props} />
  if (name === 'partners') return <Users {...props} />
  if (name === 'refs') return <BookOpen {...props} />

  return <Download {...props} />
}

const MENU = [
  {
    key: 'tours',
    label: 'Туры',
    items: ['Ведомости', 'Заказы', 'Заявки', 'Ведомости ред.']
  },
  {
    key: 'partners',
    label: 'Контрагенты',
    items: ['Общий реестр', 'заказчики Туристы', 'Корпораты', 'Договоры', 'Расходы']
  },
  {
    key: 'refs',
    label: 'Справочники',
    items: ['Отели', 'Типы отелей', 'Типы номеров', 'Места сбора', 'География', 'Коллекции', 'Музеи', 'Экономические направления']
  },
  {
    key: 'exports',
    label: 'Выгрузки',
    items: ['Экспорт заказов', 'План выездов', 'Электронная путевка', 'Сверка выездов с ТО', 'Сверка мест', '1С Платежи', '1С счета', 'Сверка по расчетам ТО']
  }
]

export default function BottomBar({ onSelectItem, activeSelection, theme = 'light', onThemeChange, onLogout, showColumnsSettings, onOpenSettings }) {
  const [open, setOpen] = useState(null)
  const [profileOpen, setProfileOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    function onClick(e) {
      if (!containerRef.current) return
      if (!containerRef.current.contains(e.target)) {
        setOpen(null)
        setProfileOpen(false)
      }
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return (
    <div className="bottom-wrap" ref={containerRef}>
      <div className="bottom-bar">
        {MENU.map((m) => (
          <div key={m.key} className="bb-item">
            <button
              className={`bb-btn ${open === m.key || activeSelection?.sectionKey === m.key ? 'active selected-section' : ''}`}
              onClick={(e) => {
                e.stopPropagation()
                setOpen((prev) => (prev === m.key ? null : m.key))
              }}
              aria-expanded={open === m.key}
            >
              <span className="bb-btn-inner">
                <span className="bb-btn-icon">
                  <SectionIcon name={m.key} />
                </span>
                <span>{m.label}</span>
              </span>
            </button>

            <div className={`dropdown ${open === m.key ? 'open' : ''}`}>
              <ul>
                {m.items.map((it) => (
                  <li key={it} className="drop-item">
                    <button
                      className={`drop-link ${
                        activeSelection?.sectionKey === m.key && activeSelection?.itemLabel === it ? 'active' : ''
                      }`}
                      onClick={() => {
                        onSelectItem?.({ sectionKey: m.key, sectionLabel: m.label, itemLabel: it })
                        setOpen(null)
                      }}
                    >
                      <span>{it}</span>
                      {activeSelection?.sectionKey === m.key && activeSelection?.itemLabel === it ? (
                        <span className="drop-check" aria-hidden="true">✓</span>
                      ) : null}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}

        <div className="bb-spacer" />

        <div className="bb-profile-wrap">
          <button
            className={`bb-avatar ${profileOpen ? 'active' : ''}`}
            aria-label="Профиль пользователя"
            title="Профиль"
            onClick={(e) => {
              e.stopPropagation()
              setProfileOpen((v) => !v)
            }}
          >
            <CircleUserRound size={16} strokeWidth={1.9} aria-hidden="true" />
          </button>

          <div className={`bb-profile-pop ${profileOpen ? 'open' : ''}`}>
            {showColumnsSettings && (
              <button
                className="bb-pop-btn"
                onClick={() => {
                  onOpenSettings?.()
                  setProfileOpen(false)
                }}
              >
                <Settings2 size={14} style={{ marginRight: '6px' }} />
                Настройки столбцов
              </button>
            )}

            <button
              className="bb-pop-btn"
              onClick={() => onThemeChange?.(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? 'Светлая тема' : 'Темная тема'}
            </button>

            <button className="bb-pop-btn bb-pop-exit" onClick={() => onLogout?.()}>
              Выход
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
