import { Tab } from '../types/Tab'

type TabsProps<T extends string> = {
  tabs: Tab<T>[]
  selectedTab: T
  onClick: (tabValue: T) => void
}

export const Tabs = <T extends string>({
  tabs,
  selectedTab,
  onClick,
}: TabsProps<T>) => {
  return (
    <div>
      <div role="tablist" className="tabs">
        {tabs.map((tab) => (
          <a
            key={String(tab.value)}
            role="tab"
            className={`tab font-bold ${
              selectedTab === tab.value ? 'tab-active text-primary' : ''
            }`}
            onClick={() => onClick(tab.value)}
          >
            {tab.label}
          </a>
        ))}
      </div>
    </div>
  )
}
