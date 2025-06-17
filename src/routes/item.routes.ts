import { Router } from "express"
import {
  createItem,
  getListItems,
  getItem,
  updateItem,
  deleteItem,
} from "../controllers/item.controller"

const router = Router({ mergeParams: true }) // it access listId from parent router


// "/" Is The Base route
//  POST → add a new item to that list
router
  .route("/")
  .get(getListItems) // Get the list items
  .post(createItem) // Post the list items

router
  .route("/:id")
  .get(getItem) // when GET /lists/:listId/items/:id
  .put(updateItem) // when PUT /lists/:listId/items/:id
  .delete(deleteItem) // when DELETE /lists/:listId/items/:id

export default router
