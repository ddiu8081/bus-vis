export interface Props {}

const Component = (props: Props) => {
  return (
    <div className="absolute flex right-1 bottom-5 z-10 text-xs text-gray-600 dark:text-gray-300">
      Made by 
      <a href="https://ljl.li" target="_blank" className="mx-1 hover:text-gray-900 dark:hover:text-white">Diu</a>
      |
      <a href="https://notes.ljl.li/bus-vis/" target="_blank" className="mx-1 hover:text-gray-900 dark:hover:text-white">Blog</a>
      |
      <a href="https://github.com/ddiu8081/bus-vis" target="_blank" className="mx-1 hover:text-gray-900 dark:hover:text-white">Source Code</a>
    </div>
  )
}

export default Component
