
import { create } from './create';
import { find } from './find';
import { findById } from './findById';
import { update } from './update';
import { deleteDoc } from './delete';

export const operations = {
  create,
  find,
  findById,
  update,
  delete: deleteDoc
};
