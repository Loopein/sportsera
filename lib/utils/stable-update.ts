export function isDeepEqual<T>(left: T, right: T): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

export function pickStableValue<T>(previous: T, next: T): T {
  return isDeepEqual(previous, next) ? previous : next;
}

export function mergeStableListById<T extends { id: string }>(previous: T[], next: T[]): T[] {
  const previousById = new Map(previous.map((item) => [item.id, item] as const));
  let hasChanges = previous.length !== next.length;

  const merged = next.map((nextItem, index) => {
    const previousItem = previousById.get(nextItem.id);
    if (!previousItem) {
      hasChanges = true;
      return nextItem;
    }
    if (isDeepEqual(previousItem, nextItem)) {
      if (previous[index] !== previousItem) hasChanges = true;
      return previousItem;
    }
    hasChanges = true;
    return nextItem;
  });

  if (!hasChanges) {
    for (let index = 0; index < previous.length; index += 1) {
      if (previous[index] !== merged[index]) {
        hasChanges = true;
        break;
      }
    }
  }

  return hasChanges ? merged : previous;
}

