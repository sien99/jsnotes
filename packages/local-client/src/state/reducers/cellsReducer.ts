import produce from "immer";
import { Cell } from "../cell";
import { Action } from "../actions/index";
import { ActionType } from "./../action-types/index";

interface CellsState {
  loading: boolean;
  error: string | null;
  order: string[];
  data: {
    [key: string]: Cell;
  };
}

const initialState: CellsState = {
  loading: false,
  error: null,
  order: [],
  data: {},
};

// Update using immer: https://immerjs.github.io/immer/update-patterns
// No need to write complex logic during state updates!
const reducer = produce(
  (state: CellsState = initialState, action: Action): CellsState => {
    switch (action.type) {
      case ActionType.SAVE_CELLS_ERROR:
        state.error = action.payload;
        return state;

      case ActionType.FETCH_CELLS:
        state.loading = true;
        state.error = null;

        return state;
      case ActionType.FETCH_CELLS_COMPLETE:
        state.order = action.payload.map((cell) => cell.id);
        //* reducer accumulator, default value of acc pass as second arg
        state.data = action.payload.reduce((acc, cell) => {
          // data = [key:string]:Cell;
          acc[cell.id] = cell;
          return acc;
        }, {} as CellsState["data"]);

        return state;
      case ActionType.FETCH_CELLS_ERROR:
        state.loading = false;
        state.error = action.payload;

        return state;
      case ActionType.UPDATE_CELL:
        const { id, content } = action.payload;
        state.data[id].content = content;

        return state;

      case ActionType.DELETE_CELL:
        delete state.data[action.payload];
        state.order = state.order.filter((id) => id !== action.payload);
        return state;

      case ActionType.MOVE_CELL:
        const { direction } = action.payload;
        const index = state.order.findIndex((id) => id === action.payload.id);
        const targetIndex = direction === "up" ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex > state.order.length - 1) {
          return state;
        }
        state.order[index] = state.order[targetIndex];
        // swapping current id with target id, temp = current id = payload id
        state.order[targetIndex] = action.payload.id;
        return state;

      case ActionType.INSERT_CELL_AFTER:
        //array.splice(index, howmanyitemstoremove, item1, ....., itemX)
        const cell: Cell = {
          content: "",
          type: action.payload.type,
          id: randomId(),
        };

        state.data[cell.id] = cell;
        //! in same switch block cannot declare same identifier name
        //* Solution: declare helper function outside if the code size is massive
        const foundIndex = state.order.findIndex(
          (id) => id === action.payload.id
        );
        // if return -1 (=no match cell id) unshift cell id into start of order array
        if (foundIndex < 0) state.order.unshift(cell.id);
        // else go to foundIdx+1(position of next element), remove 0 items, insert current cell id
        else state.order.splice(foundIndex + 1, 0, cell.id);

        return state;

      default:
        return state;
    }
  },
  initialState
);

const randomId = () => {
  return Math.random().toString(36).substring(2, 7);
};

export default reducer;
