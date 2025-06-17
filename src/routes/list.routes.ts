import { Router } from "express"
import {
  createList,
  getLists,
  getList,
  updateList,
  deleteList,
} from "../controllers/list.controller"

const router = Router()

//Http methods:

router
  .route("/")
  .get(getLists) // Get view the lists
  .post(createList) // Post create a list

router
  .route("/:id")
  .get(getList) // Get a List by ID
  .put(updateList) // Update a list by ID
  .delete(deleteList) // Delete a List by ID

export default router
