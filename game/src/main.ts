import events from 'engine/events'
import * as winpos from 'winpos'

events.addHandler('load', () => {
  winpos.load()
})

events.addHandler('quit', () => {
  winpos.save()
  return false
})

events.addHandler('keypressed', key => {
  if (key === 'q') love.event.quit()
  if (key === 'r') love.event.quit('restart')
})
