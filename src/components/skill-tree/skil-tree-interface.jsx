export function isUnlocked(task, tasks) {
  return task.dependencies.every(
    depId => tasks.find(t => t.id === depId)?.completed
  );
}

export function buildTree(tasks, parentId = null) {
  return tasks
    .filter(task => task.parentId === parentId)
    .sort((a, b) => b.urgency - a.urgency)
    .map(task => ({
      ...task,
      children: buildTree(tasks, task.id)
    }));
}

