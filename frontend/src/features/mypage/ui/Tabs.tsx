import { Tab } from '../types/Tab'
import { TabValue } from '../types/TabValue'

type TabsProps = {
  tabs: Tab[]
  selectedTab: TabValue
  onClick: (tabValue: TabValue) => void
}

export const Tabs = ({ tabs, selectedTab, onClick }: TabsProps) => {
  return (
    <div>
      <div role="tablist" className="tabs">
        {tabs.map((tab) => (
          <a
            key={tab.value}
            role="tab"
            className={`tab font-bold ${selectedTab === tab.value ? 'tab-active text-primary' : ''}`}
            onClick={() => onClick(tab.value)}
          >
            {tab.label}
          </a>
        ))}
      </div>
    </div>
  )
}
