//______________________________________________________________________________
let previousOpenFolderLevel = 0
export function isInOpenFolder(item,props) {
  // Determine wich items should be hidden or shown based on upper closed or opened folders.
  // (To be called sequentially, must start from the first item)
  if (previousOpenFolderLevel === 0) {
    if (item.item_level === 0) return true // Root is always visible
    const previousItem = props.items[props.items.indexOf(item) - 1]
    if (previousItem.open === false && item.item_level === previousItem.item_level + 1) {
      previousOpenFolderLevel = item.item_level
      return false
    }
    return true
  }
  if (item.item_level < previousOpenFolderLevel) {
    previousOpenFolderLevel = 0
    return true
  }
  return false
}
