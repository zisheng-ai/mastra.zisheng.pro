import Link from '@docusaurus/Link'
import { translate } from '@docusaurus/Translate'
import { GitHubIconLink } from '@site/src/components/github-icon-link'
import NavbarLayout from '@theme/Navbar/Layout'
import NavbarMobileSidebarToggle from '@theme/Navbar/MobileSidebar/Toggle'
import LocaleDropdownNavbarItem from '@theme/NavbarItem/LocaleDropdownNavbarItem'
import { ThemeSwitcher } from '@site/src/components/theme-switcher'
import SearchBar from '@theme/SearchBar'
import { type ReactNode } from 'react'
import { AskAI } from './ask-ai'
import { Logo } from './logo'
import { TabSwitcher } from './tab-switcher'

function NavbarContentDesktop() {
  return (
    <div className="@container mx-auto flex h-(--ifm-navbar-height) w-full items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <Link
          to="/"
          aria-label={translate({
            id: 'navbar.logo.ariaLabel',
            message: 'Mastra homepage',
            description: 'Accessible label for the Mastra logo link',
          })}
        >
          <Logo />
        </Link>
        <div className="hidden lg:block">
          <TabSwitcher />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <SearchBar />
          <div className="hidden lg:block">
            <AskAI />
          </div>
          <div className="flex items-center">
            <GitHubIconLink />
          </div>
          <LocaleDropdownNavbarItem
            mobile={false}
            className="hidden items-center lg:flex"
            dropdownItemsBefore={[]}
            dropdownItemsAfter={[]}
          />
          <ThemeSwitcher />
        </div>
        <NavbarMobileSidebarToggle />
      </div>
    </div>
  )
}

export default function Navbar(): ReactNode {
  return (
    <NavbarLayout>
      <NavbarContentDesktop />
    </NavbarLayout>
  )
}
