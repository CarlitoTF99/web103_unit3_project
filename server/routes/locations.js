import { Router } from 'express'
import { getAllLocations, getLocationById, getEventsByLocation } from '../controllers/locations.js'

const router = Router()
router.get('/', getAllLocations)
router.get('/:id', getLocationById)
router.get('/:id/events', getEventsByLocation)
export default router
