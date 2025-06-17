import { Request, Response } from 'express';
import { itemStore } from '../store/item.store';
import { listStore } from '../store/list.store';
import { OK, CREATED, BAD_REQUEST, NOT_FOUND } from '../utils/http-status';

export const createItem = async (req: Request, res: Response): Promise<void> => {
  // Create new item 

  try {
    const { listId } = req.params
    const { title, description = "", completed = false } = req.body

    if (!title) {
      res.status(BAD_REQUEST).json({
        //if it's a bad request (400) throw this error "Title is required"
        success: false,
        error: "Title is required",
      })
      return
    }

    const list = listStore.findById(listId) //find the item by id
    if (!list) { //if the item doesn't exist the status code = 404 display this message "List not found "
      res.status(NOT_FOUND).json({
        success: false,
        error: "List not found",
      })
      return
    }

    const item = itemStore.create({ listId, title, description, completed })
    res.status(CREATED).json({  // Create an item has: "ID", "Title", "Descreption"
      success: true, //if it's true display the item info
      data: item,
    })
  } catch (error) {
    res.status(BAD_REQUEST).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to create item", 
      // if the status code (404) display this message "Failed to create item"
    })
  }
};

export const getListItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const { listId } = req.params;
    const list = listStore.findById(listId);
    if (!list) {
      res.status(NOT_FOUND).json({
        success: false,
        error: 'List not found',
      });
      return;
    }

    const items = itemStore.findByListId(listId);
    res.status(OK).json({
      success: true,
      data: items,
    });
  } catch (error) {
    res.status(BAD_REQUEST).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch items',
    });
  }
};

export const getItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { listId, id } = req.params;
    const list = listStore.findById(listId);
    if (!list) {
      res.status(NOT_FOUND).json({
        success: false,
        error: 'List not found',
      });
      return;
    }

    const item = itemStore.findById(id);
    if (!item || item.listId !== listId) {
      res.status(NOT_FOUND).json({
        success: false,
        error: 'Item not found in this list',
      });
      return;
    }

    res.status(OK).json({
      success: true,
      data: item,
    });
  } catch (error) {
    res.status(BAD_REQUEST).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch item',
    });
  }
};

export const updateItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { listId, id } = req.params;
    const list = listStore.findById(listId);
    if (!list) {
      res.status(NOT_FOUND).json({
        success: false,
        error: 'List not found',
      });
      return;
    }

    const existingItem = itemStore.findById(id);
    if (!existingItem || existingItem.listId !== listId) {
      // Checks if the item does exist or not, if not display this "Item not found in this list"

      res.status(NOT_FOUND).json({
        success: false,
        error: "Item not found in this list",
      })
      return
    }

    const item = itemStore.update(id, req.body);
    res.status(OK).json({
      success: true,
      data: item,
    });
  } catch (error) {
    res.status(BAD_REQUEST).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update item',
    });
  }
};

export const deleteItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { listId, id } = req.params
    const list = listStore.findById(listId)
    if (!list) {
      res.status(NOT_FOUND).json({
        success: false,
        error: "List not found",
      })
      return
    }

    const existingItem = itemStore.findById(id)
    if (!existingItem || existingItem.listId !== listId) {
      res.status(NOT_FOUND).json({
        //if the status code (404) display an error "Item not found in this list"
        success: false,
        error: "Item not found in this list",
      })
      return
    }

    itemStore.delete(id)   // delete the item and return an empty object if the status is OK (200)

    res.status(OK).json({
      success: true,
      data: {},
    })
  } catch (error) {
    // if there's an error display this message "Failed to delete item"

    res.status(BAD_REQUEST).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete item",
    })
  }
}; 