export interface SideNavProps {
    isCollapsed: boolean
    toggleCollapse: () => void
  }
  

  
export interface SideBarProps {
  isCollapsed: boolean
  rtl: boolean
  isToggled: boolean
  handleToggleCollapse : () => void
  handleToggleSidebar :  (value:boolean) => void
}

export interface SpecificSideBarProps {

  handleToggleCollapse : () => void
 
}