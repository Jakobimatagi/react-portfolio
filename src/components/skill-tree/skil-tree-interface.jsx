export function isUnlocked(node, tasks, category, allInitialTasksComplete) {
  // Find the actual task data
  const task = tasks.find(t => t.id === node.id);
  if (!task) return false;
  
  // For non-initialTasks categories, check if initialTasks are complete first
  if (category !== 'initialTasks' && category !== 'initial-tasks' && !allInitialTasksComplete) {
    return false;
  }
  
  // If no dependencies, it's unlocked
  if (!task.dependencies || task.dependencies.length === 0) return true;
  
  // Check if all dependencies are completed
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

