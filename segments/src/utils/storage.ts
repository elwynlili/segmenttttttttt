// localStorage 数据持久化工具函数

// 从localStorage获取数据
export const getFromStorage = <T>(key: string, defaultValue: T[]): T[] => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};

// 保存数据到localStorage
export const saveToStorage = <T>(key: string, data: T[] | T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// 添加新数据
export const addToStorage = <T extends { id: string; createdAt: string; updatedAt: string }>(
  key: string, 
  newItem: Omit<T, 'id' | 'createdAt' | 'updatedAt'>
): T[] => {
  try {
    const currentData = getFromStorage<T>(key, []);
    const timestamp = new Date().toISOString();
    const itemWithId: T = {
      ...newItem,
      id: `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: timestamp,
      updatedAt: timestamp
    } as T;
    const updatedData = [...currentData, itemWithId];
    saveToStorage(key, updatedData);
    return updatedData;
  } catch (error) {
    console.error('Error adding to localStorage:', error);
    return getFromStorage<T>(key, []);
  }
};

// 更新数据
export const updateInStorage = <T extends { id: string; updatedAt: string }>(
  key: string, 
  id: string, 
  updatedItem: Partial<T>
): T[] => {
  try {
    const currentData = getFromStorage<T>(key, []);
    const updatedData = currentData.map(item => {
      if (item.id === id) {
        return {
          ...item,
          ...updatedItem,
          updatedAt: new Date().toISOString()
        };
      }
      return item;
    });
    saveToStorage(key, updatedData);
    return updatedData;
  } catch (error) {
    console.error('Error updating in localStorage:', error);
    return getFromStorage<T>(key, []);
  }
};

// 删除数据
export const deleteFromStorage = <T extends { id: string }>(key: string, id: string): T[] => {
  try {
    const currentData = getFromStorage<T>(key, []);
    const updatedData = currentData.filter(item => item.id !== id);
    saveToStorage(key, updatedData);
    return updatedData;
  } catch (error) {
    console.error('Error deleting from localStorage:', error);
    return getFromStorage<T>(key, []);
  }
};

// 批量删除数据
export const deleteMultipleFromStorage = <T extends { id: string }>(key: string, ids: string[]): T[] => {
  try {
    const currentData = getFromStorage<T>(key, []);
    const updatedData = currentData.filter(item => !ids.includes(item.id));
    saveToStorage(key, updatedData);
    return updatedData;
  } catch (error) {
    console.error('Error deleting multiple items from localStorage:', error);
    return getFromStorage<T>(key, []);
  }
};

// 获取单个数据项
export const getItemFromStorage = <T extends { id: string }>(key: string, id: string): T | undefined => {
  try {
    const currentData = getFromStorage<T>(key, []);
    return currentData.find(item => item.id === id);
  } catch (error) {
    console.error('Error getting item from localStorage:', error);
    return undefined;
  }
};
