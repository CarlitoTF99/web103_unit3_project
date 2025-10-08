import { Router } from 'express'
import { getAllEvents, getEventById } from '../controllers/events.js'

const router = Router()
router.get('/', getAllEvents)
router.get('/:id', getEventById)
export default router
