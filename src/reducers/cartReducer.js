export const initialCartState = {
  items: [], // { id, name, price, image, category, quantity }
};

function getItemKey(item) {
  if (
    item?.id !== undefined &&
    item?.id !== null &&
    String(item.id).trim() !== ""
  ) {
    return `id:${String(item.id)}`;
  }
  return `name:${String(item?.name || "")
    .trim()
    .toLowerCase()}`;
}

export function cartReducer(state, action) {
  switch (action.type) {
    case "SET_CART": {
      const incomingItems = Array.isArray(action.payload?.items)
        ? action.payload.items
        : [];
      return {
        ...state,
        items: incomingItems,
      };
    }

    case "ADD_ITEM": {
      const incoming = action.payload;
      if (!incoming) return state;

      const qtyToAdd = Math.max(1, Number(incoming.quantity) || 1);
      const incomingKey = getItemKey(incoming);

      const existing = state.items.find(
        (item) => getItemKey(item) === incomingKey,
      );

      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            getItemKey(item) === incomingKey
              ? { ...item, quantity: (Number(item.quantity) || 0) + qtyToAdd }
              : item,
          ),
        };
      }

      const normalizedItem = {
        ...incoming,
        id:
          incoming.id !== undefined && incoming.id !== null
            ? incoming.id
            : `${incoming.name}-${Date.now()}`,
        price: Number(incoming.price) || 0,
        quantity: qtyToAdd,
      };

      return {
        ...state,
        items: [...state.items, normalizedItem],
      };
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(
          (item) => String(item.id) !== String(action.payload),
        ),
      };

    case "UPDATE_QTY": {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => String(item.id) !== String(id)),
        };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          String(item.id) === String(id) ? { ...item, quantity } : item,
        ),
      };
    }

    case "CLEAR_CART":
      return initialCartState;

    default:
      return state;
  }
}
